import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, FILE_TYPES, MAX_FILE_SIZE, getTagStyle, STORAGE_KEYS } from '../constants/config';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  // State
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [cv, setCv] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Get user from localStorage
  const user = localStorage.getItem(STORAGE_KEYS.USER)
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))
    : null;

  useEffect(() => {
    fetchJob();
  }, [id]);

  /**
   * Fetch job details
   */
  const fetchJob = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`);
      const data = await res.json();
      if (data.success) setJob(data.job);
    } catch (err) {
      console.error('Lỗi tải chi tiết công việc:', err);
    }
    setLoading(false);
  };

  /**
   * Handle CV file selection and validation
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!FILE_TYPES.includes(file.type)) {
      setError('Chỉ chấp nhận file .pdf, .doc, .docx');
      setCv(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File phải nhỏ hơn ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      setCv(null);
      return;
    }

    setError('');
    setCv(file);
  };

  /**
   * Submit job application
   */
  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!cv) {
      setError('Vui lòng chọn file CV');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('cv', cv);

      const res = await fetch(`${API_URL}/apply/${id}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi nộp hồ sơ:', err);
      setError('Lỗi kết nối, vui lòng thử lại');
    }

    setSubmitting(false);
  };

  /**
   * Open apply modal with auth check
   */
  const openApply = () => {
    if (!user) {
      navigate('/jobseeker/login');
      return;
    }
    if (user.role !== 'ungvien') {
      alert('Chỉ ứng viên mới có thể ứng tuyển!');
      return;
    }
    setSubmitted(false);
    setError('');
    setCv(null);
    setForm({
      fullName: user.name || '',
      email: user.email || '',
      phone: '',
    });
    setShowApply(true);
  };

  /**
   * Close apply modal
   */
  const closeModal = () => {
    setShowApply(false);
    setSubmitted(false);
    setError('');
  };

  /**
   * Get company initials for avatar
   */
  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#1b6ca8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!job) return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>😕</div>
      <div style={{ fontSize: 18 }}>Không tìm thấy bài tuyển dụng</div>
      <button onClick={() => navigate('/')} style={{ marginTop: 20, padding: '10px 24px', background: '#0f4c75', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Về trang chủ</button>
    </div>
  );

  const tag = getTagStyle(job.tag);
  const initials = getInitials(job.company);

  return (
    <>
      <style>{`
        .jd{min-height:100vh;background:#f8f9fc;font-family:sans-serif;padding:32px 24px}
        .jd__inner{max-width:900px;margin:0 auto}
        .jd__back{display:inline-flex;align-items:center;gap:6px;color:#64748b;font-size:14px;cursor:pointer;margin-bottom:24px;background:none;border:none;padding:0;font-family:sans-serif;transition:color 0.2s}
        .jd__back:hover{color:#0f4c75}
        .jd__header{background:white;border-radius:18px;padding:32px;border:1.5px solid #e8edf5;margin-bottom:20px;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
        .jd__header-top{display:flex;align-items:flex-start;gap:20px;margin-bottom:24px}
        .jd__logo{width:72px;height:72px;border-radius:14px;border:1.5px solid #e8edf5;flex-shrink:0;background:#eff6ff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#1b6ca8}
        .jd__title{font-size:24px;font-weight:800;color:#1e293b;margin-bottom:6px;line-height:1.3}
        .jd__company{font-size:16px;color:#1b6ca8;font-weight:600;margin-bottom:12px}
        .jd__tag{display:inline-block;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700;margin-bottom:8px}
        .jd__chips{display:flex;gap:10px;flex-wrap:wrap}
        .jd__chip{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;font-size:13px;font-weight:500}
        .jd__chip--salary{background:#f0fdf4;color:#16a34a}
        .jd__chip--loc{background:#eff6ff;color:#1d4ed8}
        .jd__chip--type{background:#fdf4ff;color:#9333ea}
        .jd__chip--date{background:#f8fafc;color:#94a3b8}
        .jd__apply-bar{display:flex;align-items:center;justify-content:space-between;padding-top:24px;border-top:1px solid #f1f5f9;flex-wrap:wrap;gap:12px}
        .jd__apply-note{font-size:13px;color:#94a3b8}
        .jd__apply-btn{padding:14px 36px;background:linear-gradient(135deg,#0f4c75,#1b6ca8);color:white;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:sans-serif;box-shadow:0 4px 16px rgba(15,76,117,0.3)}
        .jd__apply-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(15,76,117,0.4)}
        .jd__body{display:flex;flex-direction:column;gap:16px}
        .jd__section{background:white;border-radius:16px;padding:28px 32px;border:1.5px solid #e8edf5;box-shadow:0 2px 12px rgba(0,0,0,0.03)}
        .jd__section-title{font-size:17px;font-weight:700;color:#1e293b;margin-bottom:16px;display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:2px solid #f1f5f9}
        .jd__section-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
        .jd__content{color:#475569;font-size:15px;line-height:1.8;white-space:pre-wrap;word-break:break-word}
        .jd__info-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f8fafc}
        .jd__info-row:last-child{border-bottom:none}
        .jd__info-label{font-size:13px;color:#94a3b8;margin-bottom:2px}
        .jd__info-value{font-size:15px;color:#1e293b;font-weight:500}

        /* MODAL */
        .ap__overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(6px);padding:20px;animation:fadeIn 0.15s ease}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .ap__modal{background:white;border-radius:22px;width:100%;max-width:480px;box-shadow:0 32px 80px rgba(0,0,0,0.2);animation:slideUp 0.2s ease;overflow:hidden}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        .ap__header{background:linear-gradient(135deg,#0f4c75,#1b6ca8);padding:24px 28px;display:flex;align-items:flex-start;justify-content:space-between}
        .ap__header-title{color:white;font-size:18px;font-weight:800}
        .ap__header-sub{color:rgba(255,255,255,0.75);font-size:13px;margin-top:4px}
        .ap__close{background:rgba(255,255,255,0.2);border:none;color:white;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .ap__body{padding:24px 28px}
        .ap__label{display:block;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}
        .ap__input{width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:sans-serif;outline:none;color:#1e293b;box-sizing:border-box;transition:border-color 0.2s;margin-bottom:14px}
        .ap__input:focus{border-color:#1b6ca8}
        .ap__file-area{border:2px dashed #e2e8f0;border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:all 0.2s;margin-bottom:14px;background:#f8fafc}
        .ap__file-area:hover{border-color:#1b6ca8;background:#eff6ff}
        .ap__file-area.has-file{border-color:#16a34a;background:#f0fdf4}
        .ap__file-icon{font-size:28px;margin-bottom:8px}
        .ap__file-text{font-size:13px;color:#64748b}
        .ap__file-name{font-size:13px;color:#16a34a;font-weight:600;margin-top:4px}
        .ap__file-hint{font-size:11px;color:#94a3b8;margin-top:4px}
        .ap__error{background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:10px 14px;font-size:13px;color:#e11d48;margin-bottom:14px}
        .ap__submit{width:100%;padding:14px;background:linear-gradient(135deg,#0f4c75,#1b6ca8);color:white;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:sans-serif;transition:all 0.2s;box-shadow:0 4px 16px rgba(15,76,117,0.25)}
        .ap__submit:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(15,76,117,0.35)}
        .ap__submit:disabled{opacity:0.6;cursor:not-allowed;transform:none}
        .ap__success{padding:40px 28px;text-align:center}
        .ap__success-icon{font-size:56px;margin-bottom:16px}
        .ap__success-title{font-size:20px;font-weight:800;color:#1e293b;margin-bottom:8px}
        .ap__success-text{font-size:14px;color:#64748b;line-height:1.6;margin-bottom:24px}
        .ap__success-btn{padding:12px 28px;background:#0f4c75;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:sans-serif}
      `}</style>

      <div className="jd">
        <div className="jd__inner">
          <button className="jd__back" onClick={() => navigate(-1)}>← Quay lại</button>
          <div className="jd__header">
            <div className="jd__header-top">
              {job.companyLogo ? <img src={job.companyLogo} alt={job.company} className="jd__logo" style={{objectFit:'cover'}} /> : <div className="jd__logo">{initials}</div>}
              <div style={{ flex: 1 }}>
                {tag && <span className="jd__tag" style={{ background: tag.bg, color: tag.color }}>{job.tag}</span>}
                <h1 className="jd__title">{job.title}</h1>
                <div className="jd__company">{job.company}</div>
                <div className="jd__chips">
                  <span className="jd__chip jd__chip--salary">💵 {job.salary}</span>
                  <span className="jd__chip jd__chip--loc">📍 {job.location}</span>
                  {job.jobType && <span className="jd__chip jd__chip--type">⏱ {job.jobType}</span>}
                  <span className="jd__chip jd__chip--date">📅 {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            <div className="jd__apply-bar">
              <div className="jd__apply-note">Nhanh tay ứng tuyển trước khi hết hạn!</div>
              <button className="jd__apply-btn" onClick={openApply}>Ứng tuyển ngay</button>
            </div>
          </div>

          <div className="jd__body">
            <div className="jd__section">
              <div className="jd__section-title"><span className="jd__section-icon">▪️</span>Mô tả công việc</div>
              <div className="jd__content">{job.description}</div>
            </div>
            <div className="jd__section">
              <div className="jd__section-title"><span className="jd__section-icon">▪️</span>Yêu cầu ứng viên</div>
              <div className="jd__content">{job.requirements}</div>
            </div>
            {job.benefits && (
              <div className="jd__section">
                <div className="jd__section-title"><span className="jd__section-icon">▪️</span>Quyền lợi</div>
                <div className="jd__content">{job.benefits}</div>
              </div>
            )}
            <div className="jd__section">
              <div className="jd__section-title"><span className="jd__section-icon" style={{background:'#fff7ed'}}>ℹ</span>Thông tin công việc</div>
              {job.workLocation && <div className="jd__info-row"><span style={{fontSize:18}}>📍</span><div><div className="jd__info-label">Địa điểm làm việc</div><div className="jd__info-value">{job.workLocation}</div></div></div>}
              {job.workTime && <div className="jd__info-row"><span style={{fontSize:18}}>🕐</span><div><div className="jd__info-label">Thời gian làm việc</div><div className="jd__info-value">{job.workTime}</div></div></div>}
              <div className="jd__info-row"><span style={{fontSize:18}}>💼</span><div><div className="jd__info-label">Hình thức</div><div className="jd__info-value">{job.jobType}</div></div></div>
              <div className="jd__info-row"><span style={{fontSize:18}}>💵</span><div><div className="jd__info-label">Mức lương</div><div className="jd__info-value">{job.salary}</div></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showApply && (
        <div className="ap__overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="ap__modal">
            <div className="ap__header">
              <div>
                <div className="ap__header-title">Nộp hồ sơ ứng tuyển</div>
                <div className="ap__header-sub">{job.title} · {job.company}</div>
              </div>
              <button className="ap__close" onClick={closeModal}>✕</button>
            </div>

            {submitted ? (
              <div className="ap__success">
                <div className="ap__success-title">Nộp hồ sơ thành công!</div>
                <div className="ap__success-text">
                  Hồ sơ đã được gửi đến nhà tuyển dụng.<br />
                  Email xác nhận đã gửi đến <strong>{form.email}</strong>
                </div>
                <button className="ap__success-btn" onClick={closeModal}>Đóng</button>
              </div>
            ) : (
              <div className="ap__body">
                <label className="ap__label">Họ và tên *</label>
                <input className="ap__input" placeholder="Nguyễn Văn A" value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />

                <label className="ap__label">Email *</label>
                <input className="ap__input" type="email" placeholder="email@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />

                <label className="ap__label">Số điện thoại *</label>
                <input className="ap__input" type="tel" placeholder="0912 345 678" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />

                <label className="ap__label">CV của bạn *</label>
                <div className={`ap__file-area ${cv ? 'has-file' : ''}`} onClick={() => fileRef.current.click()}>
                  <div className="ap__file-icon">{cv ? '📎' : '📁'}</div>
                  {cv ? (
                    <>
                      <div className="ap__file-name">✅ {cv.name}</div>
                      <div className="ap__file-hint">{(cv.size/1024/1024).toFixed(2)} MB · Nhấn để đổi file</div>
                    </>
                  ) : (
                    <>
                      <div className="ap__file-text">Nhấn để chọn file CV</div>
                      <div className="ap__file-hint">Hỗ trợ .pdf, .doc, .docx · Tối đa 5MB</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileChange} />

                {error && <div className="ap__error">⚠️ {error}</div>}

                <button className="ap__submit" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? '⏳ Đang gửi...' : 'Nộp hồ sơ'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default JobDetail;