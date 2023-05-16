const express = require('express');
const {
  uploadProfilePhoto,
  getSingleUser,
  getAllUsers,
} = require('../controllers/user');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/upload-profile-photo', protect, uploadProfilePhoto);
router.get('/users/:id', protect, getSingleUser);

// TODO: temp route -> remove then
router.get('/users', protect, getAllUsers);

module.exports = router;
