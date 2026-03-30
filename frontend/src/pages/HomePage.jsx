import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, LOCATIONS, ITEMS_PER_PAGE, getTagStyle } from '../constants/config';

const HomePage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, [location, page, search]);

  /**
   * Fetch jobs with filters and pagination
   */
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: ITEMS_PER_PAGE });
      if (location !== 'Tất cả') params.append('location', location);
      if (search) params.append('search', search);

      const res = await fetch(`${API_URL}/jobs?${params}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách công việc:', err);
    }
    setLoading(false);
  };

  /**
   * Handle search form submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  /**
   * Get initials from company name
   */
  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        .hp { min-height: 100vh; background: #f8f9fc; }

        /* HERO */
        .hp__hero {
          background: linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #00b4d8 100%);
          padding: 64px 24px 80px; text-align: center; position: relative; overflow: hidden;
        }
        .hp__hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 60%);
        }
        .hp__hero-title {
          font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 8px;
          letter-spacing: -0.5px; position: relative;
        }
        .hp__hero-sub { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px; position: relative; }
        .hp__hero-sub span { color: #7dd3fc; font-weight: 600; }

        /* SEARCH BAR */
        .hp__search-bar {
          display: flex; max-width: 640px; margin: 0 auto; position: relative;
          background: white; border-radius: 14px; overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .hp__search-input {
          flex: 1; padding: 16px 20px; border: none; outline: none;
          font-size: 15px; color: #1e293b; font-family: sans-serif;
        }
        .hp__search-btn {
          padding: 12px 24px; background: #0f4c75; color: white; border: none;
          font-size: 14px; font-weight: 700; cursor: pointer; margin: 6px;
          border-radius: 10px; transition: background 0.2s; font-family: sans-serif;
        }
        .hp__search-btn:hover { background: #1b6ca8; }

        /* FILTER TABS */
        .hp__filters {
          display: flex; gap: 8px; justify-content: center; padding: 24px 24px 0;
          flex-wrap: wrap;
        }
        .hp__filter-btn {
          padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 500;
          cursor: pointer; border: 1.5px solid #e2e8f0; background: white;
          color: #64748b; transition: all 0.2s; font-family: sans-serif;
        }
        .hp__filter-btn:hover { border-color: #1b6ca8; color: #1b6ca8; }
        .hp__filter-btn.active {
          background: #0f4c75; color: white; border-color: #0f4c75;
        }

        /* MAIN CONTENT */
        .hp__main { max-width: 1200px; margin: 0px auto; padding: 32px 24px; }
        .hp__meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .hp__total { font-size: 15px; color: #64748b; }
        .hp__total strong { color: #0f4c75; }

        /* JOB GRID */
        .hp__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 900px) { .hp__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .hp__grid { grid-template-columns: 1fr; } }

        /* JOB CARD */
        .hp__card {
          background: white; border-radius: 14px; padding: 20px;
          border: 1.5px solid #e8edf5; cursor: pointer;
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .hp__card:hover {
          border-color: #1b6ca8; transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(15,76,117,0.12);
        }
        .hp__card-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
        .hp__logo {
          width: 48px; height: 48px; border-radius: 10px; object-fit: cover;
          border: 1px solid #e8edf5; flex-shrink: 0; background: #f1f5f9;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; color: #1b6ca8;
        }
        .hp__card-info { flex: 1; min-width: 0; }
        .hp__card-title {
          font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 4px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; line-height: 1.4;
        }
        .hp__card-company { font-size: 13px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hp__tag {
          position: absolute; top: 14px; right: 14px;
          padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 700;
        }
        .hp__card-footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .hp__chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;
        }
        .hp__chip--salary { background: #f0fdf4; color: #16a34a; }
        .hp__chip--loc { background: #eff6ff; color: #1d4ed8; }
        .hp__chip--type { background: #fdf4ff; color: #9333ea; }

        /* LOADING */
        .hp__loading { display: flex; justify-content: center; padding: 80px; }
        .hp__spinner {
          width: 36px; height: 36px; border: 3px solid #e2e8f0;
          border-top-color: #1b6ca8; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .hp__empty { text-align: center; padding: 80px 20px; color: #94a3b8; }
        .hp__empty-icon { font-size: 56px; margin-bottom: 16px; }
        .hp__empty-text { font-size: 16px; }

        /* PAGINATION */
        .hp__pagination { display: flex; justify-content: center; gap: 8px; margin-top: 40px; }
        .hp__page-btn {
          width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid #e2e8f0;
          background: white; color: #64748b; font-size: 14px; cursor: pointer;
          transition: all 0.2s; font-family: sans-serif; display: flex; align-items: center; justify-content: center;
        }
        .hp__page-btn:hover { border-color: #1b6ca8; color: #1b6ca8; }
        .hp__page-btn.active { background: #0f4c75; color: white; border-color: #0f4c75; }
        .hp__page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="hp">
        {/* HERO */}
        <div className="hp__hero">
          <h1 className="hp__hero-title">Tìm Việc Làm Phù Hợp</h1>
          <p className="hp__hero-sub">Hơn <span>{total.toLocaleString()}</span> việc làm đang chờ bạn</p>
          <form className="hp__search-bar" onSubmit={handleSearch}>
            <input
              className="hp__search-input"
              placeholder="Tìm theo tên việc làm hoặc công ty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="hp__search-btn">Tìm kiếm</button>
          </form>
        </div>

        {/* LOCATION FILTERS */}
        <div className="hp__filters">
          {LOCATIONS.map(loc => (
            <button
              key={loc}
              className={`hp__filter-btn ${location === loc ? 'active' : ''}`}
              onClick={() => { setLocation(loc); setPage(1); }}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* MAIN */}
        <div className="hp__main">
          <div className="hp__meta">
            <div className="hp__total">
              Tìm thấy <strong>{total}</strong> việc làm
            </div>
          </div>

          {loading ? (
            <div className="hp__loading"><div className="hp__spinner" /></div>
          ) : jobs.length === 0 ? (
            <div className="hp__empty">
              <div className="hp__empty-text">Không tìm thấy việc làm phù hợp</div>
            </div>
          ) : (
            <div className="hp__grid">
              {jobs.map(job => {
                const tag = getTagStyle(job.tag);
                const initials = getInitials(job.company);
                return (
                  <div key={job._id} className="hp__card" onClick={() => navigate(`/jobs/${job._id}`)}>
                    {tag && (
                      <span className="hp__tag" style={{ background: tag.bg, color: tag.color }}>
                        {job.tag}
                      </span>
                    )}
                    <div className="hp__card-top">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="hp__logo" />
                      ) : (
                        <div className="hp__logo">{initials}</div>
                      )}
                      <div className="hp__card-info">
                        <div className="hp__card-title">{job.title}</div>
                        <div className="hp__card-company">{job.company}</div>
                      </div>
                    </div>
                    <div className="hp__card-footer">
                      <span className="hp__chip hp__chip--salary">💵 {job.salary}</span>
                      <span className="hp__chip hp__chip--loc">📍 {job.location}</span>
                      {job.jobType && <span className="hp__chip hp__chip--type">⏱ {job.jobType}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="hp__pagination">
              <button className="hp__page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`hp__page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="hp__page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;