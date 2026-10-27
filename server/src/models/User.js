const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      index: true,
    },
    password: { type: String, required: true, select: false },
    profile: {
      displayName: { type: String, trim: true, maxlength: 60 },
      summary: { type: String, trim: true, maxlength: 500, default: '' },
      field: { type: String, trim: true, maxlength: 80, default: '' },
      skills: {
        type: [{ type: String, trim: true, maxlength: 40 }],
        default: [],
        validate: [(items) => items.length <= 10, 'A maximum of 10 skills is allowed.'],
      },
      links: {
        type: [{ type: String, trim: true, maxlength: 2048 }],
        default: [],
        validate: [(items) => items.length <= 5, 'A maximum of 5 links is allowed.'],
      },
      portfolioPublic: { type: Boolean, default: false },
      portfolioArticleIds: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
        default: [],
        validate: [(items) => items.length <= 20, 'A maximum of 20 portfolio articles is allowed.'],
      },
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model('User', userSchema);
