/**
 * Global Configuration & Constants
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const LOCATIONS = ['Tất cả', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Remote'];

export const JOB_TYPES = ['Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Remote'];

export const FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Tag colors & styles
 */
export const TAG_STYLES = {
  'GẤP': { bg: '#fff3e0', color: '#e65100' },
  'HOT': { bg: '#fce4ec', color: '#c62828' },
  'NỔI BẬT': { bg: '#e8f5e9', color: '#2e7d32' },
};

/**
 * Utility function to get tag style
 */
export const getTagStyle = (tag) => TAG_STYLES[tag] || null;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  FILTERS: 'jobFilters',
};

/**
 * Pagination
 */
export const ITEMS_PER_PAGE = 9;
