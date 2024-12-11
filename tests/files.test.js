const request = require('supertest');
const app = require('../app');

describe('POST /files', () => {
  it('should upload a file and return file details', async () => {
    const file = {
      name: 'test-image.jpg',
      type: 'image',
      data: 'base64datahere',
    };

    const response = await request(app).post('/files').set('X-Token', 'valid_token').send(file);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'test-image.jpg');
  });
});
