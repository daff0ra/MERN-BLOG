const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  summary: { type: String, trim: true, maxlength: 300, default: '' },
  topics: { type: [{ type: String, trim: true, maxlength: 40 }], default: [], validate: [(items) => items.length <= 10, 'A maximum of 10 topics is allowed.'] },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'private' },
  shareSlug: { type: String, unique: true, sparse: true, select: false },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Article', articleSchema);
