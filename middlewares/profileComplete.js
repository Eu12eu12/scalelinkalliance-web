// Middleware to enforce profile completion for workers
const enforceProfileComplete = (req, res, next) => {
  // Only enforce for 'worker' role
  if (req.user && req.user.role === 'worker') {
    if (!req.user.isProfileComplete) {
      return res.status(403).json({ 
        error: 'Profile incomplete.', 
        needsProfileCompletion: true 
      });
    }
  }
  next();
};

module.exports = enforceProfileComplete;
