const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Check API usage limits
exports.checkApiLimit = async (req, res, next) => {
  try {
    const user = req.user;

    // Free tier: 50 requests per month
    // Pro tier: unlimited
    const limits = {
      free: 50,
      pro: Infinity,
      enterprise: Infinity
    };

    if (user.apiUsageCount >= limits[user.subscription]) {
      return res.status(429).json({
        success: false,
        message: 'API limit exceeded. Please upgrade your plan.',
        currentUsage: user.apiUsageCount,
        limit: limits[user.subscription]
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking API limits'
    });
  }
};
