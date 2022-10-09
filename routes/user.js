const express = require('express');
const { uploadProfilePhoto } = require('../controllers/user');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/upload-profile-photo', protect, uploadProfilePhoto);

module.exports = router;
