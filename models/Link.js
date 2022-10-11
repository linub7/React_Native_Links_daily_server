const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    link: {
      type: String,
      trim: true,
      required: true,
    },
    urlPreview: {},
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Link', LinkSchema);
