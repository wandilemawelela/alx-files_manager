const request = require('supertest');
const app = require('../app'); 

describe('GET /status', () => {
  it('should return status OK', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });
});
