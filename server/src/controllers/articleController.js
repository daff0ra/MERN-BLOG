const mongoose = require('mongoose');
const { randomBytes } = require('node:crypto');
const { z } = require('zod');
const Article = require('../models/Article');

const createSchema = z.object({
  title: z.string().trim().min(3).max(120),
  content: z.string().trim().min(1).max(20000),
  summary: z.string().trim().max(300).optional(),
  topics: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
}).strict();
const updateSchema = createSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'Provide at least one article field to update.',
});

function parse(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const error = new Error('Please provide valid article details.');
    error.status = 400;
    error.details = result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }));
    throw error;
  }
  return result.data;
}

function validId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Article not found.');
    error.status = 404;
    throw error;
  }
}

exports.list = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id }).select('+shareSlug').sort({ updatedAt: -1 }).lean();
    return res.status(200).json(articles);
  } catch (error) { return next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const data = parse(createSchema, req.body);
    const article = await Article.create({
      ...data,
      summary: data.summary ?? '',
      topics: data.topics ?? [],
      status: 'draft',
      owner: req.user._id,
    });
    return res.status(201).json(article);
  } catch (error) { return next(error); }
};

exports.get = async (req, res, next) => {
  try {
    validId(req.params.id);
    const article = await Article.findOne({ _id: req.params.id, owner: req.user._id }).select('+shareSlug').lean();
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    return res.status(200).json(article);
  } catch (error) { return next(error); }
};

exports.preview = async (req, res, next) => {
  try {
    validId(req.params.id);
    const article = await Article.findOne({ _id: req.params.id, owner: req.user._id }).select('+shareSlug').lean();
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    return res.status(200).json({ ...article, preview: true });
  } catch (error) { return next(error); }
};

exports.publish = async (req, res, next) => {
  try {
    validId(req.params.id);
    const result = z.object({ visibility: z.enum(['private', 'unlisted', 'public']) }).strict().safeParse(req.body);
    if (!result.success) {
      const error = new Error('Choose private, unlisted, or public visibility.');
      error.status = 400;
      error.details = result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }));
      throw error;
    }
    const visibility = result.data.visibility;
    const updates = visibility === 'private'
      ? { $set: { status: 'published', visibility }, $unset: { shareSlug: 1 } }
      : { $set: { status: 'published', visibility, shareSlug: randomBytes(24).toString('base64url') } };
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, updates, { new: true, runValidators: true },
    ).select('+shareSlug');
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    return res.status(200).json(article);
  } catch (error) { return next(error); }
};

exports.unpublish = async (req, res, next) => {
  try {
    validId(req.params.id);
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: { status: 'draft', visibility: 'private' }, $unset: { shareSlug: 1 } },
      { new: true, runValidators: true },
    );
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    return res.status(200).json(article);
  } catch (error) { return next(error); }
};

exports.readPublic = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      shareSlug: req.params.slug,
      status: 'published',
      visibility: { $in: ['unlisted', 'public'] },
    }).populate({ path: 'owner', select: 'username profile.displayName profile.portfolioPublic' }).lean();
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    return res.status(200).json({
      title: article.title,
      content: article.content,
      summary: article.summary,
      topics: article.topics,
      author: article.owner?.profile?.displayName || article.owner?.username || 'Author',
      authorPortfolioId: article.owner?.profile?.portfolioPublic ? article.owner._id : null,
      updatedAt: article.updatedAt,
    });
  } catch (error) { return next(error); }
};

exports.update = async (req, res, next) => {
  try {
    validId(req.params.id);
    const updates = parse(updateSchema, req.body);
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updates },
      { new: true, runValidators: true },
    ).select('+shareSlug').lean();
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    return res.status(200).json(article);
  } catch (error) { return next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    validId(req.params.id);
    const article = await Article.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    return res.status(204).end();
  } catch (error) { return next(error); }
};
