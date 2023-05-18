const express = require('express');
const {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  updateViewCount,
  manageLike,
  manageUnlike,
  getMyLinks,
  getTrendingAndLatestLinks,
} = require('../controllers/link');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/links', protect, getLinks);
router.post('/create-link', protect, createLink);
router.put('/update-link', protect, updateLink);
router.put('/view-count/:linkId', protect, updateViewCount);
router.put('/links/like/:linkId', protect, manageLike);
router.put('/links/unlike/:linkId', protect, manageUnlike);

router.get('/links/me', protect, getMyLinks);
router.get('/links/trending-latest', protect, getTrendingAndLatestLinks);
router.put('/links/:id', protect, updateLink);
router.delete('/links/:id', protect, deleteLink);

module.exports = router;
