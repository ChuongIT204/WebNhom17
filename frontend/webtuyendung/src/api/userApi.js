const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========================
// ỨNG VIÊN
// ========================
export const jobSeekerRegister = async (data) => {
  const res = await fetch(`${API_URL}/auth/jobseeker/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const jobSeekerLogin = async (data) => {
  const res = await fetch(`${API_URL}/auth/jobseeker/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ========================
// NHÀ TUYỂN DỤNG
// ========================
export const recruiterRegister = async (data) => {
  const res = await fetch(`${API_URL}/auth/recruiter/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const recruiterLogin = async (data) => {
  const res = await fetch(`${API_URL}/auth/recruiter/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ĐĂNG XUẤT
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
};

export const adminLogin = async (data) => {
  const res = await fetch(`${API_URL}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};