import Bull from 'bull';
import imageThumbnail from 'image-thumbnail';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import fs from 'fs';

export const fileQueue = new Bull('fileQueue', {
  redis: { host: 'localhost', port: 6379 },
});

fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
  if (!file) {
    throw new Error('File not found');
  }

  if (file.type !== 'image') {
    throw new Error('File is not an image');
  }

  // Generate thumbnails with different sizes
  const thumbnailSizes = [500, 250, 100];
  const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

  for (const size of thumbnailSizes) {
    const thumbnailPath = `${file.localPath.replace(/(\.\w+)$/, `_${size}$1`)}`;

    try {
      const options = { width: size };
      const thumbnail = await imageThumbnail(file.localPath, options);

      if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH, { recursive: true });
      }

      fs.writeFileSync(thumbnailPath, thumbnail);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }
});

