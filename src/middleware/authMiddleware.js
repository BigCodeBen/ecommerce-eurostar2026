const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-eurostar2026-secret';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Provide a valid Bearer token.' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = {
  authenticate,
  JWT_SECRET,
};
