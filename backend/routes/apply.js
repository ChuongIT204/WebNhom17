const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const Job = require('../models/Job');
const User = require('../models/User');

// Cấu hình multer - lưu file trong memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file .pdf, .doc, .docx'));
    }
  },
});

// Cấu hình transporter Gmail
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// POST /api/apply/:jobId
router.post('/:jobId', upload.single('cv'), async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const { jobId } = req.params;

    // Validate
    if (!fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng đính kèm CV' });
    }

    // Lấy thông tin job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài tuyển dụng' });
    }

    // Lấy email doanh nghiệp
    const recruiter = await User.findById(job.postedBy);
    const recruiterEmail = recruiter?.email || process.env.GMAIL_USER;

    const transporter = createTransporter();

    // Email gửi cho doanh nghiệp
    await transporter.sendMail({
      from: `"Web Tuyển Dụng" <${process.env.GMAIL_USER}>`,
      to: recruiterEmail,
      subject: `[Ứng tuyển] ${job.title} - ${fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f9fc; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0f4c75, #1b6ca8); padding: 24px; border-radius: 10px; margin-bottom: 24px;">
            <h2 style="color: white; margin: 0; font-size: 20px;">📋 Hồ sơ ứng tuyển mới</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Vị trí: <strong style="color: white;">${job.title}</strong></p>
          </div>
          <div style="background: white; border-radius: 10px; padding: 24px;">
            <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 16px;">Thông tin ứng viên</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; width: 40%;">👤 Họ và tên</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${fullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">📧 Email</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">📞 Số điện thoại</td>
                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${phone}</td>
              </tr>
            </table>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">CV của ứng viên được đính kèm trong email này.</p>
        </div>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        },
      ],
    });

    // Email xác nhận gửi cho ứng viên
    await transporter.sendMail({
      from: `"Web Tuyển Dụng" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ Xác nhận nộp hồ sơ - ${job.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: linear-gradient(135deg, #0f4c75, #1b6ca8); padding: 24px; border-radius: 10px; margin-bottom: 24px; text-align: center;">
            <h2 style="color: white; margin: 0;">✅ Nộp hồ sơ thành công!</h2>
          </div>
          <div style="background: white; border-radius: 10px; padding: 24px; border: 1px solid #e2e8f0;">
            <p style="color: #1e293b; font-size: 15px;">Xin chào <strong>${fullName}</strong>,</p>
            <p style="color: #64748b; font-size: 14px; line-height: 1.7;">
              Hồ sơ của bạn cho vị trí <strong style="color: #0f4c75;">${job.title}</strong> tại <strong>${job.company}</strong> đã được gửi thành công. 
              Nhà tuyển dụng sẽ liên hệ với bạn sớm nhất có thể.
            </p>
            <div style="background: #f8f9fc; border-radius: 8px; padding: 16px; margin-top: 16px;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">📜 Vị trí: <strong style="color: #1e293b;">${job.title}</strong></p>
              <p style="margin: 8px 0 0; color: #64748b; font-size: 13px;">🏢 Công ty: <strong style="color: #1e293b;">${job.company}</strong></p>
            </div>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">Chúc bạn thành công!</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Nộp hồ sơ thành công! Email xác nhận đã được gửi.' });

  } catch (error) {
    console.error('Lỗi gửi email ứng tuyển:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File CV phải nhỏ hơn 5MB' });
    }
    res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại' });
  }
});

module.exports = router;