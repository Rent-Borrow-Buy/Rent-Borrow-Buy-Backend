const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockItem = {
  user_id: '1',
  title: 'Pencil',
  description: 'Dixon Ticonderoga',
  buy: true,
  rent: false,
  borrow: false,
  zipcode: 97034,
  sold: true
};

const mockUser = {
  email: 'testing@example.com',
  password: '654321',  
};

const registerAndLogin = async (userProps = {}) => {
  
  const password = userProps.password ?? mockUser.password;
  
  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];

};

describe('items routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  //   it.skip('lists all items for the authenticated user', async () => {
  //     const [agent] = await registerAndLogin();

  //     await agent.post('/api/v1/items').send(
  //       {
  //         title: 'Potato peeler',
  //         description: 'Works like a charm',
  //         buy: true,
  //         rent: true,
  //         zipcode: 97034,
  //       }
  //     );

  //     const resp = await agent.get('/api/v1/items');
  //     expect(resp.status).toBe(200);
  //     expect(resp.body).toEqual([
  //       {
  //         id: expect.any(String),
  //         user_id: expect.any(String),
  //         title: 'Potato peeler',
  //         description: 'Works like a charm',
  //         buy: true,
  //         rent: true,
  //         borrow: false,
  //         zipcode: 97034,
  //         sold: false,
  //         listed_date: expect.any(String),

  //       }
  //     ]);
  //   });

  it('lists all items', async () => {

    const resp = await request(app).get('/api/v1/items');
    expect(resp.status).toBe(200);
    expect(resp.body[0]).toEqual(
      {
        id: expect.any(String),
        user_id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        buy: expect.any(Boolean),
        rent: expect.any(Boolean),
        borrow: expect.any(Boolean),
        zipcode: expect.any(Number),
        sold: expect.any(Boolean),
        listed_date: expect.any(String),

      }
    );
  });

  it('adds an item to the list of items', async () => {
    const [agent] = await registerAndLogin();

    const resp = await agent.post('/api/v1/items').send(mockItem);

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual(
      {
        id: expect.any(String),
        user_id: expect.any(String),
        title: 'Pencil',
        description: 'Dixon Ticonderoga',
        buy: true,
        rent: false,
        borrow: false,
        zipcode: 97034,
        sold: true,
        listed_date: expect.any(String),    
      }
    );
  });

});
