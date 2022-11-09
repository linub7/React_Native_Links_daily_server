const express = require('express');
const {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  updateViewCount,
  manageLike,
  manageUnlike,
} = require('../controllers/link');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/links', getLinks);
router.post('/create-link', protect, createLink);
router.put('/update-link', protect, updateLink);
router.put('/view-count/:linkId', protect, updateViewCount);
router.put('/links/like/:linkId', protect, manageLike);
router.put('/links/unlike/:linkId', protect, manageUnlike);
router.delete('/delete-link', protect, deleteLink);

module.exports = router;
