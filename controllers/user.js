const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
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
