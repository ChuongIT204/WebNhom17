const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request handler
 */
const apiRequest = async (endpoint, data) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

/**
 * ========================
 * JOB SEEKER ROUTES
 * ========================
 */
export const jobSeekerRegister = (data) => apiRequest('/auth/jobseeker/register', data);
export const jobSeekerLogin = (data) => apiRequest('/auth/jobseeker/login', data);

/**
 * ========================
 * RECRUITER ROUTES
 * ========================
 */
export const recruiterRegister = (data) => apiRequest('/auth/recruiter/register', data);
export const recruiterLogin = (data) => apiRequest('/auth/recruiter/login', data);

/**
 * ========================
 * ADMIN ROUTES
 * ========================
 */
export const adminLogin = (data) => apiRequest('/auth/admin/login', data);

/**
 * ========================
 * JOB ROUTES
 * ========================
 */
export const getAllJobs = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_URL}/jobs?${params}`);
  return res.json();
};

export const getJobById = async (jobId) => {
  const res = await fetch(`${API_URL}/jobs/${jobId}`);
  return res.json();
};

export const getMyJobs = async (token) => {
  const res = await fetch(`${API_URL}/jobs/my`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

export const createJob = async (jobData, token) => {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  return res.json();
};

export const updateJob = async (jobId, jobData, token) => {
  const res = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  return res.json();
};

export const deleteJob = async (jobId, token) => {
  const res = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

/**
 * ========================
 * APPLICATION ROUTES
 * ========================
 */
export const applyForJob = async (jobId, formData) => {
  const res = await fetch(`${API_URL}/apply/${jobId}`, {
    method: 'POST',
    body: formData, // FormData cho file upload
  });
  return res.json();
};

/**
 * ========================
 * AUTH UTILITIES
 * ========================
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
};

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('authChange'));
};