import { fileQueue } from './queues/fileQueue';  // Import the Bull queue
import imageThumbnail from 'image-thumbnail';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import dbClient from './utils/db';  // MongoDB client
import path from 'path';

fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  // Ensure fileId and userId are present
  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  // Retrieve the file from the database
  const file = await dbClient.db.collection('files').findOne({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });

  // If no file is found for the given userId and fileId, raise an error
  if (!file) {
    throw new Error('File not found');
  }

  // If the file is not an image, raise an error
  if (file.type !== 'image') {
    throw new Error('File is not an image');
  }

  const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

  // Ensure the folder exists
  if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH, { recursive: true });
  }

  // Thumbnail sizes (500px, 250px, and 100px)
  const thumbnailSizes = [500, 250, 100];

  for (const size of thumbnailSizes) {
    const thumbnailPath = path.join(FOLDER_PATH, `${fileId}_${size}${path.extname(file.name)}`);

    try {
      // Generate the thumbnail with the specified size
      const options = { width: size };
      const thumbnail = await imageThumbnail(file.localPath, options);

      // Save the thumbnail to the local filesystem
      fs.writeFileSync(thumbnailPath, thumbnail);
      console.log(`Generated thumbnail at ${thumbnailPath}`);
    } catch (error) {
      console.error(`Error generating thumbnail for ${fileId}:`, error);
    }
  }
});

