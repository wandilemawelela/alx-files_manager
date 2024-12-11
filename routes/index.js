const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');
const Bull = require('bull');

// Create userQueue for sending welcome emails
const userQueue = new Bull('userQueue');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/files', FilesController.postUpload)
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);

router.post('/users', async (req, res) => {
  try {
    const user = await UsersController.createUser(req, res);
    // Add a job to the userQueue for the new user
    await userQueue.add({ userId: user._id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
