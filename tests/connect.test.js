const request = require('supertest');
const app = require('../app');

describe('GET /connect', () => {
  it('should return a token if valid credentials are provided', async () => {
    const response = await request(app)
      .get('/connect')
      .set('Authorization', 'Basic ' + Buffer.from('test@example.com:password123').toString('base64'));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
