import React, { useState } from 'react';
import './Auth.css';
import { jobSeekerLogin } from '../../../api/userApi';
import { useNavigate } from 'react-router-dom';


const JobSeekerLogin = () => {
   const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await jobSeekerLogin(form);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setMessage({ type: 'success', text: res.message });
      window.dispatchEvent(new Event('authChange'));
      setTimeout(() => navigate('/'), 1000); 
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="auth">
      <h1>Đăng nhập ứng viên</h1>

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

      <p className="auth__signup text-black">
        Don't have an account?{' '}
        <a href="/jobseeker/register" className="text-indigo-600 hover:underline">
          Sign up now
        </a>
      </p>
    </div>
  );
};

export default JobSeekerLogin;
