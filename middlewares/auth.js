const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access Denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_dev');
    // Fetch latest user data from DB to ensure isVerified is current
    const db = require('../models');
    const user = await db.AdminUser.findByPk(verified.id, {
      attributes: ['id', 'email', 'role', 'isVerified', 'isActive', 'fullName', 'isProfileComplete', 'mustChangePassword', 'phoneNumber', 'address', 'zipCode']
    });
    
    if (!user) return res.status(404).json({ error: 'User no longer exists.' });
    if (!user.isActive) return res.status(403).json({ error: 'Access Denied. This account has been deactivated.' });
    
    req.user = user.toJSON();
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token.' });
  }
};

module.exports = authMiddleware;
