import React from 'react';
import { useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return (
    <footer className="footer">
      <div className="footer__logo">
        {/* <img src="/logo.jpg" alt="Website Logo" className="footer__logo-image" /> */}
        <span className="footer__title">Nhom17</span>
        <br />
        <span className="footer__subtitle">Tìm việc làm, tuyển dụng hiệu quả</span>
      </div>
      <div className="footer__info">
        <p>Hotline: 123-456-789</p>
        <p>Email: contact@webtuyendung.com</p>
        <div className="footer__social">
          <a href="#" className="footer__social-link">Facebook</a>
          <a href="#" className="footer__social-link">LinkedIn</a>
          <a href="#" className="footer__social-link">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;