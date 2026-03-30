const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const applyRoutes = require('./routes/apply');

const app = express();

/**
 * ===== MIDDLEWARE CONFIGURATION =====
 */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

/**
 * ===== DATABASE CONNECTION =====
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });

/**
 * ===== API ROUTES =====
 */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/apply', applyRoutes);

/**
 * ===== HEALTH CHECK =====
 */
app.get('/', (req, res) => {
  res.json({ message: 'Backend Web Tuyển Dụng đang chạy 🚀' });
});

/**
 * ===== ERROR HANDLING - 404 =====
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy route này',
  });
});

/**
 * ===== SERVER STARTUP =====
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});