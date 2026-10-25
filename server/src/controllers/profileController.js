const { z } = require('zod');
const User = require('../models/User');

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(60).optional(),
  summary: z.string().trim().max(500).optional(),
  field: z.string().trim().max(80).optional(),
  skills: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  links: z.array(z.string().trim().url().max(2048)).max(5).optional(),
}).strict();

function publicProfile(user) {
  const profile = user.profile || {};
  return {
    displayName: profile.displayName || user.username,
    summary: profile.summary || '',
    field: profile.field || '',
    skills: profile.skills || [],
    links: profile.links || [],
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
