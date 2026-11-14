const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'NBN_ENTERPRISE_JWT_SECRET_KEY_2026';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function registerUser({ name, email, phone, password, role = 'member' }) {
  const users = db.getTable('users');
  const existing = users.find(u => u.phone === phone || (email && u.email === email));
  if (existing) {
    throw new Error('இந்த மொபைல் எண் அல்லது மின்னஞ்சல் ஏற்கனவே பதிவாகியுள்ளது! (Account already exists)');
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email: email || `${phone}@nbn.in`,
    phone: phone.replace(/\D/g, ''),
    role,
    passwordHash: hashPassword(password || 'nbn123'),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  db.logAudit(newUser.id, 'REGISTER_USER', 'users', newUser.id, { name, phone, role });
  db.persist();

  const token = generateToken(newUser);
  return { user: sanitizeUser(newUser), token };
}

function loginUser(identifier, password) {
  const users = db.getTable('users');
  const cleanPhone = identifier.replace(/\D/g, '');
  const user = users.find(u => 
    (u.username && u.username.toLowerCase() === identifier.toLowerCase()) || 
    (cleanPhone && u.phone === cleanPhone) || 
    (u.email && u.email.toLowerCase() === identifier.toLowerCase())
  );

  if (!user) {
    throw new Error('பயனர் கிடைக்கவில்லை (User not found. Check your Username, Phone or Email)');
  }

  const hash = hashPassword(password);
  if (user.passwordHash !== hash) {
    throw new Error('கடவுச்சொல் தவறானது (Incorrect password)');
  }

  // Find linked business profile
  const businesses = db.getTable('businesses') || [];
  const biz = businesses.find(b => b.userId === user.id || (user.phone && b.phone === user.phone)) || businesses[0];

  const token = generateToken(user);
  return { 
    user: sanitizeUser(user), 
    token,
    businessId: biz ? biz.id : (user.businessId || 'biz_001')
  };
}

function sanitizeUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

module.exports = {
  hashPassword,
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  sanitizeUser
};
