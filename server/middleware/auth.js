const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.adminId = admin.id;
    req.adminUsername = admin.username;
    next();
  });
}

module.exports = { authenticateToken };