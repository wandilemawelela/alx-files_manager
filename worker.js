const Bull = require('bull');
const dbClient = require('./utils/dbClient');

// Create fileQueue for generating thumbnails
const fileQueue = new Bull('fileQueue');

// Create userQueue for sending welcome emails
const userQueue = new Bull('userQueue');

// Process fileQueue for generating thumbnails
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const fileDoc = await dbClient.findFileById(fileId);

  if (!fileDoc || fileDoc.userId !== userId) {
    throw new Error('File not found');
  }

  const thumbnails = [500, 250, 100].map(async (size) => {
    const thumbnail = await generateThumbnail(fileDoc.localPath, { width: size });
    await saveThumbnail(fileDoc.localPath, thumbnail, size);
  });

  await Promise.all(thumbnails);
});

// Process userQueue for sending welcome emails
userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const userDoc = await dbClient.findUserById(userId);

  if (!userDoc) {
    throw new Error('User not found');
  }

  console.log(`Welcome ${userDoc.email}!`);
});

