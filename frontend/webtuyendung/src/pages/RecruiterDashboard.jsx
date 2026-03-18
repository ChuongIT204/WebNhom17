import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EMPTY_FORM = {
  title: '', company: '', companyLogo: '', salary: '', location: '',
  jobType: 'Toàn thời gian', tag: '', description: '',
  requirements: '', benefits: '', workLocation: '', workTime: '',
};

// ✅ FIX: Đưa Field ra NGOÀI component, nhận form và setForm qua props
const Field = ({ label, name, type = 'text', textarea, options, form, setForm }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</label>
    {textarea ? (
      <textarea
        rows={4}
        value={form[name] || ''}
        onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))}
        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', resize: 'vertical', color: '#1e293b', boxSizing: 'border-box' }}
      />
    ) : options ? (
      <select
        value={form[name] || ''}
        onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))}
        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', color: '#1e293b', background: 'white', boxSizing: 'border-box' }}
      >
        {options.map(o => <option key={o} value={o}>{o || '-- Không có --'}</option>)}
      </select>
    ) : (
      <input
        type={type}
        value={form[name] || ''}
        onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))}
        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', color: '#1e293b', boxSizing: 'border-box' }}
      />
    )}
  </div>
);

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'doanhnghiep') {
      navigate('/recruiter/login');
      return;
    }
    fetchMyJobs();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/jobs/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setJobs(data.jobs);
    } catch {
      showToast('Lỗi khi tải danh sách bài đăng', 'error');
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setJobs([data.job, ...jobs]);
        showToast('Đăng bài tuyển dụng thành công! 🎉');
        setModal(null);
      } else showToast(data.message, 'error');
    } catch { showToast('Lỗi server', 'error'); }
    setSaving(false);
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${selected._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setJobs(jobs.map(j => j._id === selected._id ? data.job : j));
        showToast('Cập nhật thành công!');
        setModal(null);
      } else showToast(data.message, 'error');
    } catch { showToast('Lỗi server', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs/${selected._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setJobs(jobs.filter(j => j._id !== selected._id));
        showToast('Đã xóa bài tuyển dụng');
        setModal(null);
      } else showToast(data.message, 'error');
    } catch { showToast('Lỗi server', 'error'); }
  };

  const openAdd = () => { setForm({ ...EMPTY_FORM, company: user.name }); setModal('add'); };
  const openEdit = (job) => { setSelected(job); setForm({ ...job }); setModal('edit'); };
  const openDelete = (job) => { setSelected(job); setModal('delete'); };
  const openView = (job) => { setSelected(job); setModal('view'); };

  const filtered = jobs.filter(j =>
    (j.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (j.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const tagColors = {
    'GẤP': { bg: '#fff3e0', color: '#e65100' },
    'HOT': { bg: '#fce4ec', color: '#c62828' },
    'NỔI BẬT': { bg: '#e8f5e9', color: '#2e7d32' },
  };

  return (
    <>
      <style>{`
        .rd { min-height: 100vh; background: #f0f4ff; font-family: sans-serif; }
        .rd__topbar { background: white; border-bottom: 1px solid #e8edf5; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .rd__brand { font-size: 18px; font-weight: 800; color: #0f4c75; display: flex; align-items: center; gap: 8px; }
        .rd__brand-dot { width: 8px; height: 8px; background: #0ea5e9; border-radius: 50%; }
        .rd__topbar-right { display: flex; align-items: center; gap: 16px; }
        .rd__user { font-size: 14px; color: #64748b; }
        .rd__user strong { color: #1e293b; }
        .rd__home-btn { padding: 8px 16px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: sans-serif; }
        .rd__home-btn:hover { border-color: #0f4c75; color: #0f4c75; }
        .rd__main { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
        .rd__stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
        .rd__stat { background: white; border-radius: 14px; padding: 20px 24px; border: 1.5px solid #e8edf5; display: flex; align-items: center; gap: 16px; }
        .rd__stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .rd__stat-value { font-size: 28px; font-weight: 800; color: #1e293b; line-height: 1; }
        .rd__stat-label { font-size: 13px; color: #94a3b8; margin-top: 4px; }
        .rd__toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .rd__search { flex: 1; padding: 11px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; font-family: sans-serif; color: #1e293b; transition: border-color 0.2s; }
        .rd__search:focus { border-color: #0f4c75; }
        .rd__add-btn { display: flex; align-items: center; gap: 8px; padding: 11px 20px; background: #0f4c75; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: sans-serif; transition: all 0.2s; white-space: nowrap; }
        .rd__add-btn:hover { background: #1b6ca8; transform: translateY(-1px); }
        .rd__list { display: flex; flex-direction: column; gap: 12px; }
        .rd__item { background: white; border-radius: 14px; padding: 20px 24px; border: 1.5px solid #e8edf5; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
        .rd__item:hover { border-color: #bfdbfe; box-shadow: 0 4px 16px rgba(15,76,117,0.08); }
        .rd__item-logo { width: 48px; height: 48px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #1b6ca8; flex-shrink: 0; border: 1px solid #dbeafe; }
        .rd__item-info { flex: 1; min-width: 0; }
        .rd__item-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .rd__item-meta { display: flex; gap: 10px; flex-wrap: wrap; }
        .rd__meta-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; }
        .rd__item-tag { padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .rd__item-date { font-size: 12px; color: #cbd5e1; white-space: nowrap; }
        .rd__item-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .rd__btn { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; font-family: sans-serif; }
        .rd__btn--view { background: #f0f9ff; color: #0284c7; }
        .rd__btn--view:hover { background: #0284c7; color: white; }
        .rd__btn--edit { background: #f0fdf4; color: #16a34a; }
        .rd__btn--edit:hover { background: #16a34a; color: white; }
        .rd__btn--delete { background: #fff1f2; color: #e11d48; }
        .rd__btn--delete:hover { background: #e11d48; color: white; }
        .rd__empty { text-align: center; padding: 64px; color: #cbd5e1; background: white; border-radius: 14px; border: 1.5px solid #e8edf5; }
        .rd__empty-icon { font-size: 48px; margin-bottom: 12px; }
        .rd__loading { display: flex; justify-content: center; padding: 64px; }
        .rd__spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #0f4c75; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .rd__overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); padding: 20px; }
        .rd__modal { background: white; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.15); animation: slideUp 0.2s ease; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .rd__modal-header { padding: 24px 28px 16px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: white; border-radius: 20px 20px 0 0; border-bottom: 1px solid #f1f5f9; }
        .rd__modal-title { font-size: 18px; font-weight: 800; color: #1e293b; }
        .rd__modal-close { width: 32px; height: 32px; border-radius: 8px; border: none; background: #f1f5f9; color: #64748b; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
        .rd__modal-body { padding: 24px 28px; }
        .rd__modal-footer { padding: 16px 28px 24px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #f1f5f9; }
        .rd__modal-cancel { padding: 10px 20px; background: #f1f5f9; color: #64748b; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; font-family: sans-serif; }
        .rd__modal-save { padding: 10px 24px; background: #0f4c75; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 700; font-family: sans-serif; transition: background 0.2s; }
        .rd__modal-save:hover { background: #1b6ca8; }
        .rd__modal-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .rd__modal-danger { padding: 10px 24px; background: #e11d48; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 700; font-family: sans-serif; }
        .rd__view-section { margin-bottom: 20px; }
        .rd__view-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .rd__view-value { font-size: 15px; color: #1e293b; line-height: 1.7; white-space: pre-wrap; }
        .rd__view-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .rd__divider { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin: 20px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
        .rd__toast { position: fixed; bottom: 28px; right: 28px; z-index: 200; background: #1e293b; color: white; border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 10px; font-size: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; }
        .rd__toast--error { background: #e11d48; }
      `}</style>

      <div className="rd">
        <div className="rd__topbar">
          <div className="rd__brand"><div className="rd__brand-dot" /> Recruiter Portal</div>
          <div className="rd__topbar-right">
            <div className="rd__user">Xin chào, <strong>{user?.name}</strong></div>
            <button className="rd__home-btn" onClick={() => navigate('/')}>Trang chủ</button>
          </div>
        </div>

        <div className="rd__main">
          <div className="rd__stats">
            {[
              { icon: '📋', label: 'Tổng bài đăng', value: jobs.length, bg: '#eff6ff', color: '#1d4ed8' },
              { icon: '✅', label: 'Đang hiển thị', value: jobs.filter(j => j.isActive).length, bg: '#f0fdf4', color: '#16a34a' },
              { icon: '🔥', label: 'Bài nổi bật', value: jobs.filter(j => j.tag).length, bg: '#fff7ed', color: '#ea580c' },
            ].map((s, i) => (
              <div key={i} className="rd__stat">
                <div className="rd__stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div>
                  <div className="rd__stat-value">{s.value}</div>
                  <div className="rd__stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rd__toolbar">
            <input className="rd__search" placeholder="Tìm theo tiêu đề hoặc địa điểm..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button className="rd__add-btn" onClick={openAdd}>＋ Đăng bài mới</button>
          </div>

          {loading ? (
            <div className="rd__loading"><div className="rd__spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="rd__empty">
              <div className="rd__empty-icon">{search ? '🔍' : '📭'}</div>
              <div style={{ fontSize: 15 }}>{search ? 'Không tìm thấy bài phù hợp' : 'Bạn chưa đăng bài tuyển dụng nào'}</div>
              {!search && <button className="rd__add-btn" style={{ margin: '16px auto 0', display: 'inline-flex' }} onClick={openAdd}>＋ Đăng bài đầu tiên</button>}
            </div>
          ) : (
            <div className="rd__list">
              {filtered.map(job => {
                const tag = tagColors[job.tag];
                const initials = job.company?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <div key={job._id} className="rd__item">
                    <div className="rd__item-logo">{initials}</div>
                    <div className="rd__item-info">
                      <div className="rd__item-title">{job.title}</div>
                      <div className="rd__item-meta">
                        <span className="rd__meta-chip" style={{ background: '#f0fdf4', color: '#16a34a' }}>💵 {job.salary || 'Thỏa thuận'}</span>
                        <span className="rd__meta-chip" style={{ background: '#eff6ff', color: '#1d4ed8' }}>📍 {job.location}</span>
                        <span className="rd__meta-chip" style={{ background: '#fdf4ff', color: '#9333ea' }}>⏱ {job.jobType}</span>
                      </div>
                    </div>
                    {tag && <span className="rd__item-tag" style={{ background: tag.bg, color: tag.color }}>{job.tag}</span>}
                    <div className="rd__item-date">{new Date(job.createdAt).toLocaleDateString('vi-VN')}</div>
                    <div className="rd__item-actions">
                      <button className="rd__btn rd__btn--view" onClick={() => openView(job)}>Xem</button>
                      <button className="rd__btn rd__btn--edit" onClick={() => openEdit(job)}>Sửa</button>
                      <button className="rd__btn rd__btn--delete" onClick={() => openDelete(job)}>Xóa</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL THÊM / SỬA */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="rd__overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="rd__modal">
            <div className="rd__modal-header">
              <div className="rd__modal-title">{modal === 'add' ? 'Đăng bài tuyển dụng mới' : 'Chỉnh sửa bài tuyển dụng'}</div>
              <button className="rd__modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="rd__modal-body">
              <div className="rd__divider">Thông tin cơ bản</div>
              <Field label="Tiêu đề công việc *" name="title" form={form} setForm={setForm} />
              <Field label="Tên công ty *" name="company" form={form} setForm={setForm} />
              <Field label="Link logo công ty (URL)" name="companyLogo" form={form} setForm={setForm} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Mức lương" name="salary" form={form} setForm={setForm} />
                <Field label="Địa điểm *" name="location" form={form} setForm={setForm} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Hình thức" name="jobType" options={['Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Remote']} form={form} setForm={setForm} />
                <Field label="Tag nổi bật" name="tag" options={['', 'GẤP', 'HOT', 'NỔI BẬT']} form={form} setForm={setForm} />
              </div>
              <div className="rd__divider">Chi tiết công việc</div>
              <Field label="Mô tả công việc *" name="description" textarea form={form} setForm={setForm} />
              <Field label="Yêu cầu ứng viên *" name="requirements" textarea form={form} setForm={setForm} />
              <Field label="Quyền lợi" name="benefits" textarea form={form} setForm={setForm} />
              <div className="rd__divider">Địa điểm & Thời gian</div>
              <Field label="Địa chỉ làm việc cụ thể" name="workLocation" form={form} setForm={setForm} />
              <Field label="Thời gian làm việc" name="workTime" form={form} setForm={setForm} />
            </div>
            <div className="rd__modal-footer">
              <button className="rd__modal-cancel" onClick={() => setModal(null)}>Hủy</button>
              <button className="rd__modal-save" onClick={modal === 'add' ? handleAdd : handleEdit} disabled={saving}>
                {saving ? 'Đang lưu...' : modal === 'add' ? 'Đăng bài' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT */}
      {modal === 'view' && selected && (
        <div className="rd__overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="rd__modal">
            <div className="rd__modal-header">
              <div className="rd__modal-title">Chi tiết bài tuyển dụng</div>
              <button className="rd__modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="rd__modal-body">
              <div className="rd__view-section">
                <div className="rd__view-label">Tiêu đề</div>
                <div className="rd__view-value" style={{ fontSize: 20, fontWeight: 800 }}>{selected.title}</div>
              </div>
              <div className="rd__view-section">
                <div className="rd__view-label">Thông tin</div>
                <div className="rd__view-chips">
                  <span className="rd__meta-chip" style={{ background: '#f0fdf4', color: '#16a34a' }}>💲 {selected.salary}</span>
                  <span className="rd__meta-chip" style={{ background: '#eff6ff', color: '#1d4ed8' }}>📍 {selected.location}</span>
                  <span className="rd__meta-chip" style={{ background: '#fdf4ff', color: '#9333ea' }}>⏱ {selected.jobType}</span>
                  {selected.tag && <span className="rd__meta-chip" style={tagColors[selected.tag]}>{selected.tag}</span>}
                </div>
              </div>
              {[
                { label: 'Mô tả công việc', key: 'description' },
                { label: 'Yêu cầu ứng viên', key: 'requirements' },
                { label: 'Quyền lợi', key: 'benefits' },
                { label: 'Địa điểm làm việc', key: 'workLocation' },
                { label: 'Thời gian làm việc', key: 'workTime' },
              ].filter(s => selected[s.key]).map(s => (
                <div key={s.key} className="rd__view-section">
                  <div className="rd__view-label">{s.label}</div>
                  <div className="rd__view-value">{selected[s.key]}</div>
                </div>
              ))}
            </div>
            <div className="rd__modal-footer">
              <button className="rd__modal-cancel" onClick={() => setModal(null)}>Đóng</button>
              <button className="rd__modal-save" onClick={() => openEdit(selected)}>Chỉnh sửa</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÓA */}
      {modal === 'delete' && selected && (
        <div className="rd__overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="rd__modal" style={{ maxWidth: 420 }}>
            <div className="rd__modal-header">
              <div className="rd__modal-title">Xác nhận xóa</div>
              <button className="rd__modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="rd__modal-body">
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>
                Bạn có chắc muốn xóa bài tuyển dụng <strong style={{ color: '#1e293b' }}>{selected.title}</strong>?<br />
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="rd__modal-footer">
              <button className="rd__modal-cancel" onClick={() => setModal(null)}>Hủy</button>
              <button className="rd__modal-danger" onClick={handleDelete}>Xóa bài</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`rd__toast rd__toast--${toast.type}`}>
          {toast.type === 'success' ? '✔️' : '✖️'} {toast.message}
        </div>
      )}
    </>
  );
};

export default RecruiterDashboard;