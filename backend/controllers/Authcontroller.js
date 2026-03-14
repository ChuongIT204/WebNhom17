const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Tạo JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ========================
// ĐĂNG KÝ ỨNG VIÊN
// POST /api/auth/jobseeker/register
// ========================
const registerJobSeeker = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được sử dụng',
      });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
      role: 'ungvien',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Đăng ký ứng viên thành công! 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng ký ứng viên:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau',
    });
  }
};

// ========================
// ĐĂNG NHẬP ỨNG VIÊN
// POST /api/auth/jobseeker/login
// ========================
const loginJobSeeker = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu',
      });
    }

    // Tìm user theo email và role
    const user = await User.findOne({ email, role: 'ungvien' });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
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
    console.error('Lỗi đăng nhập ứng viên:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau',
    });
  }
};

// ========================
// ĐĂNG KÝ NHÀ TUYỂN DỤNG
// POST /api/auth/recruiter/register
// ========================
const registerRecruiter = async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được sử dụng',
      });
    }

    const user = await User.create({
      name: companyName,
      email,
      password,
      role: 'doanhnghiep',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Đăng ký nhà tuyển dụng thành công! 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng ký nhà tuyển dụng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau',
    });
  }
};

// ========================
// ĐĂNG NHẬP NHÀ TUYỂN DỤNG
// POST /api/auth/recruiter/login
// ========================
const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu',
      });
    }

    const user = await User.findOne({ email, role: 'doanhnghiep' });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      });
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
    console.error('Lỗi đăng nhập nhà tuyển dụng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau',
    });
  }
};

module.exports = {
  registerJobSeeker,
  loginJobSeeker,
  registerRecruiter,
  loginRecruiter,
};