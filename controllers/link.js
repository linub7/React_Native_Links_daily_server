const mongoose = require('mongoose');
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

// @desc    update view count
// @route   PUT /api/v1/view-count/:linkId
// @access  Private
exports.updateViewCount = asyncHandler(async (req, res, next) => {
  const {
    params: { linkId },
  } = req;

  if (!mongoose.isValidObjectId(linkId))
    return next(new ErrorResponse('Invalid Link Id', 400));

  await Link.findByIdAndUpdate(linkId, { $inc: { views: 1 } }, { new: true });

  res.json({ ok: true });
});

// @desc    Delete link
// @route   Delete /api/v1/delete-link
// @access  Private
exports.deleteLink = asyncHandler(async (req, res, next) => {});
