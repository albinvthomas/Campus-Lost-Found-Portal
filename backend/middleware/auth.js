const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 1. Read the Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.replace('Bearer ', '');

    // 2. Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach decoded user id to req.userId
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
