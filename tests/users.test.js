const request = require('supertest');
const app = require('../app');

describe('POST /users', () => {
  it('should create a new user', async () => {
    const newUser = { email: 'test@example.com', password: 'password123' };
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  it('should return error if email is missing', async () => {
    const newUser = { password: 'password123' };
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing email' });
  });
});
