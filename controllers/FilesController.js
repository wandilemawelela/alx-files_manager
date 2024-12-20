import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import { fileQueue } from '../queues/fileQueue';

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    let parentFile = null;
    if (parentId !== 0) {
      parentFile = await dbClient.db.collection('files').findOne({ _id: ObjectId(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const file = {
      userId: ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentFile ? parentId : 0,
    };

    if (type !== 'folder') {
      const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH, { recursive: true });
      }
      const localPath = `${FOLDER_PATH}/${uuidv4()}`;
      fs.writeFileSync(localPath, Buffer.from(data, 'base64'));
      file.localPath = localPath;
    }

    const result = await dbClient.db.collection('files').insertOne(file);

    // If the file is an image, add a job to the queue for thumbnail generation
    if (type === 'image') {
      fileQueue.add({
        userId: file.userId.toString(),
        fileId: result.insertedId.toString(),
      });
    }

    return res.status(201).json({
      id: result.insertedId,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
      localPath: file.localPath || null,
    });
  }

  static async getFile(req, res) {
    const { id } = req.params;
    const { size = 500 } = req.query;  // Get the size query parameter
    const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(id) });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (!file.isPublic && !(req.headers['x-token'] && (await redisClient.get(`auth_${req.headers['x-token']}`)) === file.userId.toString())) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }

    // Check if the requested size thumbnail exists
    const thumbnailPath = `${file.localPath.replace(/(\.\w+)$/, `_${size}$1`)}`;

    if (!fs.existsSync(thumbnailPath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const mimeType = mime.lookup(file.name);
    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(thumbnailPath).pipe(res);
  }
}

export default FilesController;

