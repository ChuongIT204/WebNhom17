const User = require('../models/User');
const jwt = require('jsonwebtoken');

const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  JWT_EXPIRY: '7d',
};

// Tạo JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: VALIDATION.JWT_EXPIRY }
  );
};

// Validate input
const validateRegister = (name, email, password) => {
  if (!name || !email || !password) {
    return 'Vui lòng điền đầy đủ thông tin';
  }
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return `Mật khẩu phải có ít nhất ${VALIDATION.MIN_PASSWORD_LENGTH} ký tự`;
  }
  return null;
};

const validateLogin = (email, password) => {
  return !email || !password ? 'Vui lòng nhập email và mật khẩu' : null;
};

// Generic register handler
const handleRegister = async (req, res, role, roleLabel) => {
  try {
    const { name, email, password } = req.body;
    const nameField = role === 'ungvien' ? 'name' : 'companyName';
    const inputName = req.body[nameField];

    const error = validateRegister(inputName, email, password);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email này đã được sử dụng' });
    }

    const user = await User.create({
      name: inputName,
      email,
      password,
      role,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: `Đăng ký ${roleLabel} thành công! 🎉`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Lỗi đăng ký ${roleLabel}:`, error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau',
    });
  }
};

// Generic login handler
const handleLogin = async (req, res, role, roleLabel) => {
  try {
    const { email, password } = req.body;

    const error = validateLogin(email, password);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Đăng nhập thành công! Chào mừng ${user.name} 👋`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Lỗi đăng nhập ${roleLabel}:`, error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau',
    });
  }
};

// ========================
// ỨNG VIÊN ROUTES
// ========================

const registerJobSeeker = async (req, res) => {
  await handleRegister(req, res, 'ungvien', 'ứng viên');
};

const loginJobSeeker = async (req, res) => {
  await handleLogin(req, res, 'ungvien', 'ứng viên');
};

// ========================
// NHÀ TUYỂN DỤNG ROUTES
// ========================

const registerRecruiter = async (req, res) => {
  // Map companyName to name field
  req.body.name = req.body.companyName;
  await handleRegister(req, res, 'doanhnghiep', 'nhà tuyển dụng');
};

const loginRecruiter = async (req, res) => {
  await handleLogin(req, res, 'doanhnghiep', 'nhà tuyển dụng');
};

// ========================
// ADMIN ROUTES
// ========================

const loginAdmin = async (req, res) => {
  await handleLogin(req, res, 'admin', 'admin');
};

module.exports = {
  registerJobSeeker,
  loginJobSeeker,
  registerRecruiter,
  loginRecruiter,
  loginAdmin,
};