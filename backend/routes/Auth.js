const express = require('express');
const router = express.Router();
const {
  registerJobSeeker,
  loginJobSeeker,
  registerRecruiter,
  loginRecruiter,
  loginAdmin,
} = require('../controllers/authController');

// ===== ỨNG VIÊN =====
router.post('/jobseeker/register', registerJobSeeker);
router.post('/jobseeker/login', loginJobSeeker);

// ===== NHÀ TUYỂN DỤNG =====
router.post('/recruiter/register', registerRecruiter);
router.post('/recruiter/login', loginRecruiter);

// ===== ADMIN =====
router.post('/admin/login', loginAdmin);

module.exports = router;