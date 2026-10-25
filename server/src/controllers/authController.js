const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require('../models/User');
const { createToken, setAuthCookie, clearAuthCookie } = require('../utils/auth');

const registerSchema = z.object({
  username: z.string().trim().min(2).max(30),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
});
const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

function parseBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const error = new Error('Please provide valid registration details.');
    error.status = 400;
    error.details = result.error.issues.map(({ path, message }) => ({
      field: path.join('.'), message,
    }));
    throw error;
  }
  return result.data;
}

function publicUser(user) {
  return { id: user.id, username: user.username, email: user.email };
}

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = parseBody(registerSchema, req.body);
    const normalizedEmail = email.toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email: normalizedEmail, password: passwordHash });
    setAuthCookie(res, createToken(user.id));
    return res.status(201).json(publicUser(user));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = parseBody(loginSchema, req.body);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    const passwordMatches = user && await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    setAuthCookie(res, createToken(user.id));
    return res.status(200).json(publicUser(user));
  } catch (error) {
    return next(error);
  }
};

exports.logout = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: 'Logged out successfully.' });
};

exports.me = (req, res) => res.status(200).json(publicUser(req.user));
