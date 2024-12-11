module.exports = {
  testEnvironment: 'node',
  transform: {},
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // to initialize any setup like mock setups
};

