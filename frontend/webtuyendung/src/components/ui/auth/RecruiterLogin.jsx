import React, { useState } from 'react';
import './Auth.css';
import { recruiterLogin } from '../../../api/userApi';

const RecruiterLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await recruiterLogin(form);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setMessage({ type: 'success', text: res.message });
      window.dispatchEvent(new Event('authChange'));
      // TODO: điều hướng sang dashboard nhà tuyển dụng
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="auth">
      <h1>Đăng nhập nhà tuyển dụng</h1>

      {message && (
        <div className={`auth__message auth__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      <p className="text-black">
        Don't have an account?{' '}
        <a href="/recruiter/register" className="text-indigo-600 hover:underline">
          Sign up now
        </a>
      </p>
    </div>
  );
};

export default RecruiterLogin;
