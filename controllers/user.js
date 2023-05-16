const User = require('../models/User');
const Link = require('../models/Link');
const ErrorResponse = require('../utils/errorResponse');
const { isValidObjectId } = require('mongoose');
const asyncHandler = require('../middleware/async');
const cloudinary = require('cloudinary');
const { v4: uuidv4 } = require('uuid');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// @desc    upload user profile
// @route   POST /api/v1/upload-profile-photo
// @access  Private
exports.uploadProfilePhoto = asyncHandler(async (req, res, next) => {
  const {
    body: { image },
    user,
  } = req;

  const result = await cloudinary.uploader.upload(image, {
    public_id: uuidv4(),
    resource_type: 'jpg',
  });

  console.log('CLOUDINARY: ', result);

  const existsUser = await User.findById(user._id);

  existsUser.image.public_id = result?.public_id;
  existsUser.image.url = result?.secure_url;

  await existsUser.save();

  res.status(200).json({
    name: existsUser.name,
    email: existsUser.email,
    role: existsUser.role,
    image: existsUser.image,
  });
});

// @desc    get single user
// @route   GET /api/v1/users/:id
// @access  Private
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;

  if (!isValidObjectId(id))
    return next(new ErrorResponse('Please provide a valid id', 400));

  const user = await User.findById(id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  const links = await Link.find({ postedBy: id }).select(
    'urlPreview views likes'
  );

  return res.json({
    user,
    links,
  });
});

// @desc    get all users
// @route   GET /api/v1/users
// @access  Private
// temp route
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  return res.json({
    users,
  });
});
