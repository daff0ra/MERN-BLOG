const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { COOKIE_NAME } = require('../utils/auth');

module.exports = async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'mern-api',
      audience: 'mern-client',
    });
    const user = await User.findById(payload.sub).select('_id username email profile');
    if (!user) return res.status(401).json({ message: 'Authentication required.' });

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Authentication required.' });
  }
};
