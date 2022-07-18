const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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

const mockImage = {
  url: 'http://res.cloudinary.com/rent-borrow-buy/image/upload/v1657842214/fippnhlwjujsmqrc6clw.png',
};

describe.skip('images routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  it('uploads image', async () => {

    const resp = await request(app).post('/api/v1/images/upload');
    const { url } = mockImage;
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual(
      {
    

      }
    );
  });
});
