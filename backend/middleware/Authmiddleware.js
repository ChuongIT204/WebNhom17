const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware xác thực JWT token
 * Yêu cầu: Bearer token trong header Authorization
 */
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
      console.error('Lỗi xác thực token:', error.message);
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

/**
 * Middleware kiểm tra quyền (role) của người dùng
 * @param {...string} roles - Các role được phép truy cập
 */
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