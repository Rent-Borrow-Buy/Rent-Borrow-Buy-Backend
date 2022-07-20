const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Item = require('../lib/models/Item');
jest.mock('../lib/utils/cloudinaryConfig.js');

const mockItem = {
  user_id: '1',
  title: 'Pencil',
  description: 'Dixon Ticonderoga',
  buy: true,
  rent: false,
  borrow: false,
  price: '2',
  zipcode: '97034',
  sold: true,
  encodedImage: 'fake image',
};

const mockUser = {
  email: 'testing4@example.com',
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
    const [agent] = await registerAndLogin();

    await agent.post('/api/v1/items').send(mockItem);
    
    const resp = await request(app).get('/api/v1/items');
    expect(resp.status).toBe(200);
    expect(resp.body[0]).toEqual({
      id: expect.any(String),
      user_id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      buy: expect.any(Boolean),
      rent: expect.any(Boolean),
      borrow: expect.any(Boolean),
      price: expect.any(String),
      zipcode: expect.any(String),
      sold: expect.any(Boolean),
      url: expect.any(String),
      listed_date: expect.any(String),
    });
  });
            
  it('posts an item to the list of items', async () => {
    const [agent] = await registerAndLogin();
              
    const resp = await agent.post('/api/v1/items').send(mockItem);
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      item: {
        id: expect.any(String),
        user_id: expect.any(String),
        title: 'Pencil',
        description: 'Dixon Ticonderoga',
        buy: true,
        rent: false,
        borrow: false,
        zipcode: '97034',
        sold: true,
        listed_date: expect.any(String),
      },
      image: {
        id: expect.any(String),
        url: expect.any(String),
        item_id: expect.any(String),
      },
    });
  });
  it.only('PUT /api/v1/items/:id should update an item by authorized user', async () => {
    const [agent, user] = await registerAndLogin();
    const item = await Item.insert({
      title: 'Wine',
      description: 'Real bad',
      buy: true,
      rent: false,
      borrow: false,
      price:'8',
      zipcode: '97034',
      sold: true,
      encodedImage: 'fake image',
      user_id: user.id,
    });
    
    //object we are going to edit
    const resp = await agent.put(`/api/v1/items/${item.id}`).send({ 
      description: 'Boxed wine because we are on a budget girl' });
   
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ ...item, listed_date: expect.any(String), description: 'Boxed wine because we are on a budget girl' });
  });
            
  afterAll(() => {
    pool.end();
  });
});
