const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/jobs/my - Bài đăng của doanh nghiệp hiện tại (phải đặt TRƯỚC /:id)
router.get('/my', protect, authorizeRoles('doanhnghiep', 'admin'), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Lỗi lấy danh sách bài của doanh nghiệp:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// GET /api/jobs - Tất cả bài tuyển dụng (public)
router.get('/', async (req, res) => {
  try {
    const { location, search, page = 1, limit = 9 } = req.query;
    const query = { isActive: true };
    if (location && location !== 'all') query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .select('title company companyLogo salary location jobType tag createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, jobs, total, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) {
    console.error('Lỗi lấy danh sách công việc:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// GET /api/jobs/:id - Chi tiết bài (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài tuyển dụng' });
    res.json({ success: true, job });
  } catch (error) {
    console.error('Lỗi lấy chi tiết công việc:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// POST /api/jobs - Đăng bài mới
router.post('/', protect, authorizeRoles('doanhnghiep', 'admin'), async (req, res) => {
  try {
    const { title, company, companyLogo, salary, location, jobType, tag, description, requirements, benefits, workLocation, workTime } = req.body;
    if (!title || !company || !location || !description || !requirements)
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    const job = await Job.create({ title, company, companyLogo, salary, location, jobType, tag, description, requirements, benefits, workLocation, workTime, postedBy: req.user._id });
    res.status(201).json({ success: true, message: 'Đăng bài thành công!', job });
  } catch (error) {
    console.error('Lỗi tạo bài tuyển dụng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// PUT /api/jobs/:id - Cập nhật bài
router.put('/:id', protect, authorizeRoles('doanhnghiep', 'admin'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy bài tuyển dụng' });
    res.json({ success: true, message: 'Cập nhật thành công', job });
  } catch (error) {
    console.error('Lỗi cập nhật bài tuyển dụng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// DELETE /api/jobs/:id - Xóa bài
router.delete('/:id', protect, authorizeRoles('doanhnghiep', 'admin'), async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Không tìm thấy bài tuyển dụng' });
    res.json({ success: true, message: 'Đã xóa bài tuyển dụng' });
  } catch (error) {
    console.error('Lỗi xóa bài tuyển dụng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;