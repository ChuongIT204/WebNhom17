import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../../api/userApi';
import './Auth.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await adminLogin(form);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      window.dispatchEvent(new Event('authChange'));
      setMessage({ type: 'success', text: res.message });
      setIsSuccess(true); // hiện 2 nút
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="auth">
      <h1>Đăng nhập Admin</h1>

      {message && (
        <div className={`auth__message auth__message--${message.type}`}>
          {message.text}
        </div>
      )}

      {isSuccess ? (
        <div className="auth__actions">
          <button onClick={() => navigate('/admin/dashboard')} className="auth__btn auth__btn--primary">
            Đi đến Dashboard
          </button>
          <button onClick={() => navigate('/')} className="auth__btn auth__btn--secondary">
            Về trang chủ
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" name="email" placeholder="Nhập email"
            value={form.email} onChange={handleChange} required />
          <label>Mật khẩu:</label>
          <input type="password" name="password" placeholder="Nhập mật khẩu"
            value={form.password} onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminLogin;