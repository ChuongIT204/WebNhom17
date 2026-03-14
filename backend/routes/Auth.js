const express = require('express');
const router = express.Router();
const {
  registerJobSeeker,
  loginJobSeeker,
  registerRecruiter,
  loginRecruiter,
} = require('../controllers/authController');

// ===== ỨNG VIÊN =====
router.post('/jobseeker/register', registerJobSeeker);
router.post('/jobseeker/login', loginJobSeeker);

// ===== NHÀ TUYỂN DỤNG =====
router.post('/recruiter/register', registerRecruiter);
router.post('/recruiter/login', loginRecruiter);


router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });

  const user = await require('../models/User').findOne({ email, role: 'admin' });
  if (!user)
    return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(200).json({
    success: true,
    message: `Đăng nhập thành công! Chào mừng Admin 👋`,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});



module.exports = router;