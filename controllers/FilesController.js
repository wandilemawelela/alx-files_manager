const { ObjectId } = require('mongodb');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class FilesController {
    static async postUpload(req, res) {
        // Implementation of postUpload
    }

    static async getShow(req, res) {
        const token = req.header('X-Token');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fileId = req.params.id;
        const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId });
        if (!file) {
            return res.status(404).json({ error: 'Not found' });
        }

        return res.status(200).json(file);
    }

    static async getIndex(req, res) {
        const token = req.header('X-Token');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const parentId = req.query.parentId || '0';
        const page = parseInt(req.query.page, 10) || 0;
        const pageSize = 20;
        const skip = page * pageSize;

        const files = await dbClient.db.collection('files')
            .aggregate([
                { $match: { userId, parentId } },
                { $skip: skip },
                { $limit: pageSize }
            ])
            .toArray();

        return res.status(200).json(files);
    }
}

module.exports = FilesController;
