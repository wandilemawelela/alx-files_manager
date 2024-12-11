const request = require('supertest');
const app = require('../app');

describe('GET /stats', () => {
  it('should return statistics', async () => {
    const response = await request(app).get('/stats');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('files');
  });
});
