const request = require('supertest');
const app = require('../app');

describe('GET /disconnect', () => {
  it('should successfully log out the user and delete the token', async () => {
    const response = await request(app).get('/disconnect').set('X-Token', 'valid_token');
    expect(response.status).toBe(204);
  });
});
