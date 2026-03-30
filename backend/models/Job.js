const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề công việc là bắt buộc'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Tên công ty là bắt buộc'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    salary: {
      type: String,
      default: 'Thỏa thuận',
    },
    location: {
      type: String,
      required: [true, 'Địa điểm là bắt buộc'],
    },
    jobType: {
      type: String,
      enum: ['Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Remote'],
      default: 'Toàn thời gian',
    },
    tag: {
      type: String,
      enum: ['GẤP', 'HOT', 'NỔI BẬT', ''],
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Mô tả công việc là bắt buộc'],
    },
    requirements: {
      type: String,
      required: [true, 'Yêu cầu ứng viên là bắt buộc'],
    },
    benefits: {
      type: String,
      default: '',
    },
    workLocation: {
      type: String,
      default: '',
    },
    workTime: {
      type: String,
      default: '',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);