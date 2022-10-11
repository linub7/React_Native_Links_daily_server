const User = require('../models/User');
const Link = require('../models/Link');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    create link
// @route   POST /api/v1/create-link
// @access  Private
exports.createLink = asyncHandler(async (req, res, next) => {
  const { body, user } = req;

  const link = new Link({ ...body, postedBy: user._id });
  await link.save();

  res.json({ link });
});

// @desc    get links
// @route   GET /api/v1/links
// @access  Public
exports.getLinks = asyncHandler(async (req, res, next) => {
  const links = await Link.find({}).sort('-createdAt').limit(500);

  res.json({ links });
});
// @desc    update link
// @route   PUT /api/v1/update-link
// @access  Private
exports.updateLink = asyncHandler(async (req, res, next) => {});
// @desc    Delete link
// @route   Delete /api/v1/delete-link
// @access  Private
exports.deleteLink = asyncHandler(async (req, res, next) => {});
