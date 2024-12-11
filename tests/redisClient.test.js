const redisClient = require('../utils/redisClient');

describe('redisClient', () => {
  it('should set a value in Redis', async () => {
    await redisClient.set('key', 'value');
    expect(redisClient.set).toHaveBeenCalledWith('key', 'value');
  });

  it('should get a value from Redis', async () => {
    redisClient.get.mockResolvedValue('value');
    const value = await redisClient.get('key');
    expect(value).toBe('value');
  });

  it('should delete a value from Redis', async () => {
    await redisClient.del('key');
    expect(redisClient.del).toHaveBeenCalledWith('key');
  });
});
