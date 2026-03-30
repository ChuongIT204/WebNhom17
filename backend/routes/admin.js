const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const adminOnly = [protect, authorizeRoles('admin')];

// GET tất cả users (trừ password)
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// POST thêm user mới
router.post('/users', ...adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });

    const user = await User.create({ name, email, password, role });
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, message: 'Thêm người dùng thành công', user: userObj });
  } catch (error) {
    console.error('Lỗi tạo người dùng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// PUT cập nhật user
router.put('/users/:id', ...adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    res.json({ success: true, message: 'Cập nhật thành công', user });
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// DELETE xóa user
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Không thể tự xóa tài khoản của mình' });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    res.json({ success: true, message: 'Đã xóa người dùng' });
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;