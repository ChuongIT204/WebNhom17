const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Bạn cần đăng nhập để thực hiện hành động này',
    });
  }
};

// Middleware kiểm tra role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này',
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };