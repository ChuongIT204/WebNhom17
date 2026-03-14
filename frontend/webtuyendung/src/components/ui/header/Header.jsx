import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../../api/userApi';
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <span className="header__title">Nhom17</span>
        </Link>
      </div>
      <nav className="header__nav">
{user ? (
  <>
    <span className="header__user">Xin chào, {user.name}</span>
    {user.role === 'admin' && (
      <Link to="/admin/dashboard" className="header__link">Dashboard</Link>
    )}
    <button onClick={handleLogout} className="header__link header__logout">
      Đăng xuất
    </button>
  </>
) : (
  <>
  <Link to="/admin/login" className="header__link">Đăng nhập admin</Link>
    <Link to="/jobseeker/login" className="header__link">Đăng nhập ứng viên</Link>
    <Link to="/recruiter/login" className="header__link">Đăng nhập doanh nghiệp</Link>
  </>
)}
      </nav>
    </header>
  );
};

export default Header;