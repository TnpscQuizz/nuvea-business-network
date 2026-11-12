const { verifyToken } = require('../services/authService');

function requireAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'அங்கீகரிக்கப்படாத அணுகல். உள்நுழைக (Unauthorized. Please login)' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'செல்லுபடியாகாத டோக்கன் (Invalid or expired session token)' });
  }

  req.user = decoded;
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'அங்கீகரிக்கப்படாத அணுகல் (Unauthorized)' });
    }
    // Super admin has access to everything
    if (req.user.role === 'super_admin') {
      return next();
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'இந்த பக்கத்தை அணுக உங்களுக்கு அனுமதி இல்லை (Forbidden: Insufficient privileges)' });
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
