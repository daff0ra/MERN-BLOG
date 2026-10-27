const { z } = require('zod');
const User = require('../models/User');
const Article = require('../models/Article');

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(60).optional(),
  summary: z.string().trim().max(500).optional(),
  field: z.string().trim().max(80).optional(),
  skills: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  links: z.array(z.string().trim().url().max(2048).refine((value) => /^https?:\/\//i.test(value), 'Links must use HTTP or HTTPS.')).max(5).optional(),
  portfolioPublic: z.boolean().optional(),
}).strict();

function publicProfile(user) {
  const profile = user.profile || {};
  return {
    displayName: profile.displayName || user.username,
    summary: profile.summary || '',
    field: profile.field || '',
    skills: profile.skills || [],
    links: profile.links || [],
    portfolioPublic: profile.portfolioPublic || false,
  };
}

function validate(body) {
  const result = profileSchema.safeParse(body);
  if (!result.success) {
    const error = new Error('Please provide valid profile details.');
    error.status = 400;
    error.details = result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }));
    throw error;
  }
  if (Object.keys(result.data).length === 0) {
    const error = new Error('Provide at least one profile field to update.');
    error.status = 400;
    throw error;
  }
  return result.data;
}

exports.get = (req, res) => res.status(200).json(publicProfile(req.user));

exports.update = async (req, res, next) => {
  try {
    const updates = validate(req.body);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: Object.fromEntries(Object.entries(updates).map(([key, value]) => [`profile.${key}`, value])) },
      { new: true, runValidators: true },
    ).select('_id username profile');
    return res.status(200).json(publicProfile(user));
  } catch (error) {
    return next(error);
  }
};

exports.getPortfolioArticles = (req, res) => res.status(200).json({
  articleIds: (req.user.profile?.portfolioArticleIds || []).map(String),
});

exports.updatePortfolioArticles = async (req, res, next) => {
  try {
    const schema = z.object({
      articleIds: z.array(z.string().regex(/^[a-f\d]{24}$/i)).max(20)
        .refine((ids) => new Set(ids.map((id) => id.toLowerCase())).size === ids.length, 'Article IDs must be unique.'),
    }).strict();
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = new Error('Provide up to 20 unique article IDs.');
      error.status = 400;
      error.details = result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }));
      throw error;
    }

    const { articleIds } = result.data;
    if (articleIds.length) {
      const eligible = await Article.find({
        _id: { $in: articleIds }, owner: req.user._id, status: 'published', visibility: 'public',
      }).select('_id').lean();
      if (eligible.length !== articleIds.length) {
        const error = new Error('Only your published public articles can appear in the portfolio.');
        error.status = 400;
        throw error;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { 'profile.portfolioArticleIds': articleIds } },
      { new: true, runValidators: true },
    ).select('_id profile.portfolioArticleIds');
    return res.status(200).json({ articleIds: (user.profile?.portfolioArticleIds || []).map(String) });
  } catch (error) { return next(error); }
};

exports.readPublicPortfolio = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(404).json({ message: 'Portfolio not found.' });

    const user = await User.findById(req.params.id).select('username profile').lean();
    if (!user || !user.profile?.portfolioPublic) return res.status(404).json({ message: 'Portfolio not found.' });

    const selectedIds = (user.profile.portfolioArticleIds || []).map(String);
    const foundArticles = selectedIds.length ? await Article.find({
      _id: { $in: selectedIds }, owner: user._id, status: 'published', visibility: 'public',
    }).select('title summary topics updatedAt +shareSlug').lean() : [];
    const byId = new Map(foundArticles.map((article) => [String(article._id), article]));
    const articles = selectedIds.map((id) => byId.get(id)).filter(Boolean);
    return res.status(200).json({ profile: publicProfile(user), articles });
  } catch (error) { return next(error); }
};
