const redis = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  createClient: jest.fn().mockReturnValue(redis),  // Mocked createClient function
};

module.exports = redis;
