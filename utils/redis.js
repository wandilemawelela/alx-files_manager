const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Handle errors
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });
  }

  // Check if Redis client is alive
  isAlive() {
    return this.client.connected;
  }

  // Get value by key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) return reject(err);
        resolve(reply);
      });
    });
  }

  // Set value with expiration
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, reply) => {
        if (err) return reject(err);
        resolve(reply);
      });
    });
  }

  // Delete value by key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) return reject(err);
        resolve(reply);
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;

