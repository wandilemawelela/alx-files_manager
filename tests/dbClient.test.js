const dbClient = require('../utils/dbClient');

describe('dbClient', () => {
  it('should find a document in the database', async () => {
    dbClient.db.collection().findOne.mockResolvedValue({ id: 1, name: 'Test' });

    const result = await dbClient.db.collection().findOne({ id: 1 });
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should insert a new document', async () => {
    const newDoc = { name: 'Test' };
    dbClient.db.collection().insertOne.mockResolvedValue({ insertedId: '123' });

    const result = await dbClient.db.collection().insertOne(newDoc);
    expect(result.insertedId).toBe('123');
  });
});
