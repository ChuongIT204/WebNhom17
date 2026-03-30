import React, { useState } from 'react';
import './Auth.css';
import { recruiterRegister } from '../../../api/userApi';

const RecruiterRegister = () => {
  const [form, setForm] = useState({ companyName: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await recruiterRegister(form);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setMessage({ type: 'success', text: res.message });
      window.dispatchEvent(new Event('authChange'));
      // TODO: điều hướng sang dashboard
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="auth">
      <h1>Đăng ký nhà tuyển dụng</h1>

      {message && (
        <div className={`auth__message auth__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Tên công ty:</label>
        <input
          type="text"
          name="companyName"
          placeholder="Nhập tên công ty"
          value={form.companyName}
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

export default RecruiterRegister;
