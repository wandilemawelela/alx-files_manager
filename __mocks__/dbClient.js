const db = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
};

module.exports = {
  db: db,
  collection: db.collection,
};
