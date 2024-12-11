const request = require('supertest');
const app = require('../app');

describe('GET /users/me', () => {
  it('should return the user data if authenticated', async () => {
    const response = await request(app).get('/users/me').set('X-Token', 'valid_token');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email');
  });

  it('should return Unauthorized if not authenticated', async () => {
    const response = await request(app).get('/users/me');
    expect(response.status).toBe(401);
  });
});
