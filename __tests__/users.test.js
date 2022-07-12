const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'testing@example.com',
  password: '123456',
};

describe('users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Post /api/v1/users should create user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).not.toHaveProperty('password');
  });
  afterAll(() => {
    pool.end();
  });
});
