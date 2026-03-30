import React, { useState } from 'react';
import './Auth.css';
import { jobSeekerRegister } from '../../../api/userApi';

const JobSeekerRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await jobSeekerRegister(form);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      window.dispatchEvent(new Event('authChange'));
      setMessage({ type: 'success', text: res.message });
      // TODO: điều hướng sang trang chính
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="auth">
      <h1>Đăng ký ứng viên</h1>

      {message && (
        <div className={`auth__message auth__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Họ và tên:</label>
        <input
          type="text"
          name="name"
          placeholder="Nhập họ và tên"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label>Mật khẩu:</label>
        <input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
};

export default JobSeekerRegister;
