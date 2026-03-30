import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [modal, setModal] = useState(null); // { type: 'edit' | 'delete' | 'add', user? }
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ungvien' });
  const [toast, setToast] = useState(null);
  const admin = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!admin || admin.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch {
      showToast('Lỗi khi tải danh sách người dùng', 'error');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== id));
        showToast('Đã xóa người dùng thành công');
        setModal(null);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('Lỗi khi xóa người dùng', 'error');
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${modal.user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: formData.name, email: formData.email, role: formData.role }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u._id === modal.user._id ? data.user : u));
        showToast('Cập nhật thành công');
        setModal(null);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('Lỗi khi cập nhật', 'error');
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setUsers([data.user, ...users]);
        showToast('Thêm người dùng thành công');
        setModal(null);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('Lỗi khi thêm người dùng', 'error');
    }
  };

  const openEdit = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    setModal({ type: 'edit', user });
  };

  const openAdd = () => {
    setFormData({ name: '', email: '', password: '', role: 'ungvien' });
    setModal({ type: 'add' });
  };

const filtered = users.filter(u => {
  const matchRole = filterRole === 'all' || u.role === filterRole;
  const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase());
  return matchRole && matchSearch;
});

  const stats = {
    total: users.length,
    ungvien: users.filter(u => u.role === 'ungvien').length,
    doanhnghiep: users.filter(u => u.role === 'doanhnghiep').length,
    admin: users.filter(u => u.role === 'admin').length,
  };

  const roleLabel = (role) => ({
    admin: { label: 'Admin', color: '#ef4444', bg: '#fef2f2' },
    ungvien: { label: 'Ứng viên', color: '#3b82f6', bg: '#eff6ff' },
    doanhnghiep: { label: 'Doanh nghiệp', color: '#10b981', bg: '#ecfdf5' },
  }[role] || { label: role, color: '#6b7280', bg: '#f3f4f6' });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash { min-height: 100vh; background: #0a0a0f; color: #e8e8f0; font-family: sans-serif; }

        /* SIDEBAR */
        .dash__sidebar {
          position: fixed; left: 0; top: 0; bottom: 0; width: 240px;
          background: #0f0f18; border-right: 1px solid #1e1e2e;
          display: flex; flex-direction: column; padding: 32px 20px; z-index: 10;
        }
        .dash__brand {
          font-family: sans-serif; font-size: 22px; font-weight: 800;
          color: #fff; letter-spacing: -0.5px; margin-bottom: 48px;
          display: flex; align-items: center; gap: 10px;
        }
        .dash__brand-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; }
        .dash__nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .dash__nav-item {
          display: flex; align-items: center; gap: 12px; padding: 10px 14px;
          border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer;
          color: #6b6b8a; transition: all 0.2s; border: none; background: none; text-align: left;
        }
        .dash__nav-item:hover, .dash__nav-item.active {
          background: #1a1a2e; color: #e8e8f0;
        }
        .dash__nav-item.active { color: #6366f1; }
        .dash__nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .dash__user-card {
          background: #1a1a2e; border-radius: 12px; padding: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .dash__avatar {
          width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 14px; color: white; flex-shrink: 0;
        }
        .dash__user-name { font-size: 13px; font-weight: 600; color: #e8e8f0; }
        .dash__user-role { font-size: 11px; color: #6366f1; }

        /* MAIN */
        .dash__main { margin-left: 240px; padding: 40px; min-height: 100vh; }

        /* HEADER */
        .dash__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .dash__title { font-family: sans-serif; font-size: 28px; font-weight: 800; color: #fff; }
        .dash__subtitle { font-size: 14px; color: #6b6b8a; margin-top: 4px; }
        .dash__add-btn {
          display: flex; align-items: center; gap: 8px;
          background: #6366f1; color: white; border: none; padding: 12px 20px;
          border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .dash__add-btn:hover { background: #5254cc; transform: translateY(-1px); }

        /* STATS */
        .dash__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .dash__stat {
          background: #0f0f18; border: 1px solid #1e1e2e; border-radius: 16px;
          padding: 20px 24px; transition: border-color 0.2s;
        }
        .dash__stat:hover { border-color: #2e2e4e; }
        .dash__stat-value { font-family: sans-serif; font-size: 32px; font-weight: 800; color: #fff; }
        .dash__stat-label { font-size: 12px; color: #6b6b8a; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .dash__stat-bar { height: 3px; border-radius: 2px; margin-top: 16px; }

        /* CONTROLS */
        .dash__controls { display: flex; gap: 12px; margin-bottom: 24px; }
        .dash__search {
          flex: 1; background: #0f0f18; border: 1px solid #1e1e2e; border-radius: 12px;
          padding: 12px 16px; color: #e8e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .dash__search:focus { border-color: #6366f1; }
        .dash__search::placeholder { color: #3a3a5a; }
        .dash__filter {
          background: #0f0f18; border: 1px solid #1e1e2e; border-radius: 12px;
          padding: 12px 16px; color: #e8e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; cursor: pointer; min-width: 160px;
        }

        /* TABLE */
        .dash__table-wrap {
          background: #0f0f18; border: 1px solid #1e1e2e; border-radius: 16px; overflow: hidden;
        }
        .dash__table { width: 100%; border-collapse: collapse; }
        .dash__table th {
          padding: 14px 20px; text-align: left; font-size: 11px; font-weight: 600;
          color: #3a3a5a; text-transform: uppercase; letter-spacing: 0.8px;
          border-bottom: 1px solid #1e1e2e; background: #0a0a0f;
        }
        .dash__table td { padding: 16px 20px; border-bottom: 1px solid #0f0f18; font-size: 14px; }
        .dash__table tr:last-child td { border-bottom: none; }
        .dash__table tr:hover td { background: #13131f; }
        .dash__table-name { font-weight: 500; color: #e8e8f0; }
        .dash__table-email { color: #6b6b8a; font-size: 13px; margin-top: 2px; }

        .dash__badge {
          display: inline-flex; align-items: center; padding: 4px 10px;
          border-radius: 6px; font-size: 12px; font-weight: 600;
        }

        .dash__actions { display: flex; gap: 8px; }
        .dash__btn {
          padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
          cursor: pointer; border: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .dash__btn--edit { background: #1a1a2e; color: #6366f1; }
        .dash__btn--edit:hover { background: #6366f1; color: white; }
        .dash__btn--delete { background: #1a0f0f; color: #ef4444; }
        .dash__btn--delete:hover { background: #ef4444; color: white; }

        /* EMPTY / LOADING */
        .dash__empty { padding: 80px 20px; text-align: center; color: #3a3a5a; }
        .dash__empty-icon { font-size: 48px; margin-bottom: 16px; }
        .dash__loading { display: flex; align-items: center; justify-content: center; padding: 80px; }
        .dash__spinner {
          width: 32px; height: 32px; border: 2px solid #1e1e2e;
          border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* MODAL */
        .dash__overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center; z-index: 100;
          backdrop-filter: blur(4px); animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .dash__modal {
          background: #0f0f18; border: 1px solid #1e1e2e; border-radius: 20px;
          padding: 32px; width: 480px; animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .dash__modal-title {
          font-family: sans-serif; font-size: 20px; font-weight: 700;
          color: #fff; margin-bottom: 24px;
        }
        .dash__modal-label { font-size: 12px; color: #6b6b8a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
        .dash__modal-input {
          width: 100%; background: #0a0a0f; border: 1px solid #1e1e2e; border-radius: 10px;
          padding: 11px 14px; color: #e8e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; margin-bottom: 16px; transition: border-color 0.2s;
        }
        .dash__modal-input:focus { border-color: #6366f1; }
        .dash__modal-select {
          width: 100%; background: #0a0a0f; border: 1px solid #1e1e2e; border-radius: 10px;
          padding: 11px 14px; color: #e8e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; margin-bottom: 24px; cursor: pointer;
        }
        .dash__modal-btns { display: flex; gap: 10px; justify-content: flex-end; }
        .dash__modal-cancel {
          padding: 10px 20px; background: #1a1a2e; color: #6b6b8a; border: none;
          border-radius: 10px; cursor: pointer; font-size: 14px; font-family: 'DM Sans', sans-serif;
        }
        .dash__modal-confirm {
          padding: 10px 20px; background: #6366f1; color: white; border: none;
          border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
        }
        .dash__modal-danger {
          padding: 10px 20px; background: #ef4444; color: white; border: none;
          border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
        }
        .dash__modal-text { color: #6b6b8a; font-size: 14px; margin-bottom: 24px; line-height: 1.6; }
        .dash__modal-text strong { color: #e8e8f0; }

        /* TOAST */
        .dash__toast {
          position: fixed; bottom: 32px; right: 32px; z-index: 200;
          background: #0f0f18; border: 1px solid #1e1e2e; border-radius: 12px;
          padding: 14px 20px; display: flex; align-items: center; gap: 10px;
          font-size: 14px; animation: slideUp 0.2s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
           color: #fff; 
        }
        .dash__toast--success { border-left: 3px solid #10b981; }
        .dash__toast--error { border-left: 3px solid #ef4444; }
        .dash__toast-icon { font-size: 16px; }

        .dash__count { font-size: 13px; color: #3a3a5a; padding: 16px 20px; border-top: 1px solid #1e1e2e; }
      `}</style>

      <div className="dash">
        {/* SIDEBAR */}
        <aside className="dash__sidebar">
          <div className="dash__brand">
            <div className="dash__brand-dot" />
            Admin Panel
          </div>
          <nav className="dash__nav">
            <button className="dash__nav-item active">
              <span className="dash__nav-icon">👥</span> Người dùng
            </button>
            <button className="dash__nav-item" onClick={() => navigate('/')}>
              <span className="dash__nav-icon"></span> Trang chủ
            </button>
          </nav>
          <div className="dash__user-card">
            <div className="dash__avatar">{admin?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="dash__user-name">{admin?.name}</div>
              <div className="dash__user-role">Administrator</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="dash__main">
          <div className="dash__header">
            <div>
              <div className="dash__title">Quản lý người dùng</div>
              <div className="dash__subtitle">Danh sách tất cả tài khoản trong hệ thống</div>
            </div>
            <button className="dash__add-btn" onClick={openAdd}>
              ＋ Thêm người dùng
            </button>
          </div>

          {/* STATS */}
          <div className="dash__stats">
            {[
              { value: stats.total, label: 'Tổng người dùng', color: '#6366f1' },
              { value: stats.ungvien, label: 'Ứng viên', color: '#3b82f6' },
              { value: stats.doanhnghiep, label: 'Doanh nghiệp', color: '#10b981' },
              { value: stats.admin, label: 'Admin', color: '#ef4444' },
            ].map((s, i) => (
              <div className="dash__stat" key={i}>
                <div className="dash__stat-value">{s.value}</div>
                <div className="dash__stat-label">{s.label}</div>
                <div className="dash__stat-bar" style={{ background: s.color + '33' }}>
                  <div style={{ height: '100%', width: stats.total ? `${(s.value / stats.total) * 100}%` : '0%', background: s.color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* CONTROLS */}
          <div className="dash__controls">
            <input className="dash__search" placeholder="Tìm theo tên hoặc email..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="dash__filter" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="all">Tất cả vai trò</option>
              <option value="ungvien">Ứng viên</option>
              <option value="doanhnghiep">Doanh nghiệp</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="dash__table-wrap">
            {loading ? (
              <div className="dash__loading"><div className="dash__spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="dash__empty">
                <div className="dash__empty-icon">🔍</div>
                <div>Không tìm thấy người dùng nào</div>
              </div>
            ) : (
              <table className="dash__table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const role = roleLabel(u.role);
                    return (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                              background: `linear-gradient(135deg, ${role.color}33, ${role.color}66)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: 14, color: role.color
                            }}>
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="dash__table-name">{u.name}</div>
                              <div className="dash__table-email">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="dash__badge" style={{ color: role.color, background: role.color + '22' }}>
                            {role.label}
                          </span>
                        </td>
                        <td style={{ color: '#6b6b8a', fontSize: 13 }}>
                          {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td>
                          <div className="dash__actions">
                            <button className="dash__btn dash__btn--edit" onClick={() => openEdit(u)}>Sửa</button>
                            <button className="dash__btn dash__btn--delete" onClick={() => setModal({ type: 'delete', user: u })}>Xóa</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <div className="dash__count">Hiển thị {filtered.length} / {users.length} người dùng</div>
          </div>
        </main>
      </div>

      {/* MODAL THÊM / SỬA */}
      {(modal?.type === 'add' || modal?.type === 'edit') && (
        <div className="dash__overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="dash__modal">
            <div className="dash__modal-title">
              {modal.type === 'add' ? '＋ Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
            </div>
            <label className="dash__modal-label">Họ và tên</label>
            <input className="dash__modal-input" placeholder="Nhập họ và tên"
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <label className="dash__modal-label">Email</label>
            <input className="dash__modal-input" type="email" placeholder="Nhập email"
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            {modal.type === 'add' && (
              <>
                <label className="dash__modal-label">Mật khẩu</label>
                <input className="dash__modal-input" type="password" placeholder="Nhập mật khẩu"
                  value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </>
            )}
            <label className="dash__modal-label">Vai trò</label>
            <select className="dash__modal-select" value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="ungvien">Ứng viên</option>
              <option value="doanhnghiep">Doanh nghiệp</option>
              <option value="admin">Admin</option>
            </select>
            <div className="dash__modal-btns">
              <button className="dash__modal-cancel" onClick={() => setModal(null)}>Hủy</button>
              <button className="dash__modal-confirm" onClick={modal.type === 'add' ? handleAdd : handleEdit}>
                {modal.type === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÓA */}
      {modal?.type === 'delete' && (
        <div className="dash__overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="dash__modal">
            <div className="dash__modal-title">Xác nhận xóa</div>
            <p className="dash__modal-text">
              Bạn có chắc muốn xóa tài khoản <strong>{modal.user.name}</strong>?<br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="dash__modal-btns">
              <button className="dash__modal-cancel" onClick={() => setModal(null)}>Hủy</button>
              <button className="dash__modal-danger" onClick={() => handleDelete(modal.user._id)}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`dash__toast dash__toast--${toast.type}`}>
          <span className="dash__toast-icon">{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.message}
        </div>
      )}
    </>
  );
};

export default AdminDashboard;