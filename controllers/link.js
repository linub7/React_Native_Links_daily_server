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
  await link.populate('postedBy', 'name');

  res.json({ link });
});

// @desc    get links
// @route   GET /api/v1/links
// @access  Public
exports.getLinks = asyncHandler(async (req, res, next) => {
  const links = await Link.find({})
    .populate('postedBy', 'name')
    .sort('-createdAt')
    .limit(500);

  res.json({ links });
});

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

// @desc    manage like
// @route   PUT /api/v1/links/like/:linkId
// @access  Private
exports.manageLike = asyncHandler(async (req, res, next) => {
  const {
    params: { linkId },
    user,
  } = req;

  if (!mongoose.isValidObjectId(linkId))
    return next(new ErrorResponse('Invalid Link Id', 400));

  const link = await Link.findById(linkId);

  const isLikedAlready = link.likes.find(
    (el) => el.toString() === user._id.toString()
  );

  if (isLikedAlready) {
    return next(new ErrorResponse('You can not like a link twice', 400));
  } else {
    await Link.findByIdAndUpdate(
      linkId,
      { $addToSet: { likes: user._id } },
      { new: true }
    );
    return res.json({ like: true });
  }
});

// @desc    manage unlike
// @route   PUT /api/v1/links/unlike/:linkId
// @access  Private
exports.manageUnlike = asyncHandler(async (req, res, next) => {
  const {
    params: { linkId },
    user,
  } = req;

  if (!mongoose.isValidObjectId(linkId))
    return next(new ErrorResponse('Invalid Link Id', 400));

  const link = await Link.findById(linkId);

  const isLikedAlready = link.likes.find(
    (el) => el.toString() === user._id.toString()
  );

  if (!isLikedAlready) {
    return next(
      new ErrorResponse(
        'You can not unlike a link that you did not like already',
        400
      )
    );
  } else {
    await Link.findByIdAndUpdate(
      linkId,
      { $pull: { likes: user._id } },
      { new: true }
    );
    return res.json({ unlike: true });
  }
});

// @desc    Delete link
// @route   Delete /api/v1/links/:id
// @access  Private
exports.deleteLink = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;

  const link = await Link.findById(id);
  if (link.postedBy?.toString() !== user?._id?.toString())
    return next(new ErrorResponse('Authorized Wrong!', 401));

  await link.remove();
  return res.json({
    message: 'Link deleted successfully',
  });
});

// @desc    Update Link
// @route   PUT /api/v1/links/:id
// @access  Private
exports.updateLink = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    body: { title },
    user,
  } = req;

  const link = await Link.findById(id);
  if (link.postedBy?.toString() !== user?._id?.toString())
    return next(new ErrorResponse('Authorized Wrong!', 401));
  link.title = title;

  await link.save();

  return res.json({
    link,
  });
});

// @desc    Get Trending Links
// @route   GET /api/v1/links/trending
// @access  Public
exports.getTrendingAndLatestLinks = asyncHandler(async (req, res, next) => {
  const trendingLinks = await Link.find({})
    .populate('postedBy', 'name')
    .sort('-views')
    .limit(5);

  const latestLinks = await Link.find({})
    .populate('postedBy', 'name')
    .sort('-createdAt')
    .limit(5);

  return res.json({
    trendingLinks,
    latestLinks,
  });
});

// @desc    Get My Links
// @route   GET /api/v1/links/me
// @access  Private
exports.getMyLinks = asyncHandler(async (req, res, next) => {
  const { user } = req;

  const links = await Link.find({ postedBy: user?._id }).populate('likes');

  return res.json({
    count: links.length,
    links,
  });
});
