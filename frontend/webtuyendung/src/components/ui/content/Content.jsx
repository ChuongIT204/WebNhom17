import React from 'react';
import './Content.css';
import { useNavigate } from 'react-router-dom';

const jobPosts = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    logo: '/company1-logo.png',
    description: 'We are looking for a skilled Frontend Developer to join our team.',
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'CodeBase',
    logo: '/company2-logo.png',
    description: 'Join our backend team to build scalable applications.',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Designify',
    logo: '/company3-logo.png',
    description: 'Creative UI/UX Designer needed for exciting projects.',
  },
    {
    id: 4,
    title: 'Frontend Developer',
    company: 'TechCorp',
    logo: '/company1-logo.png',
    description: 'We are looking for a skilled Frontend Developer to join our team.',
  },
  {
    id: 5,
    title: 'Backend Developer',
    company: 'CodeBase',
    logo: '/company2-logo.png',
    description: 'Join our backend team to build scalable applications.',
  },
  {
    id: 6,
    title: 'UI/UX Designer',
    company: 'Designify',
    logo: '/company3-logo.png',
    description: 'Creative UI/UX Designer needed for exciting projects.',
  },
      {
    id: 4,
    title: 'Frontend Developer',
    company: 'TechCorp',
    logo: '/company1-logo.png',
    description: 'We are looking for a skilled Frontend Developer to join our team.',
  },
  {
    id: 5,
    title: 'Backend Developer',
    company: 'CodeBase',
    logo: '/company2-logo.png',
    description: 'Join our backend team to build scalable applications.',
  },
  {
    id: 6,
    title: 'UI/UX Designer',
    company: 'Designify',
    logo: '/company3-logo.png',
    description: 'Creative UI/UX Designer needed for exciting projects.',
  },
];

const Content = () => {
  const navigate = useNavigate();

  return (
    <div className="content">
      {jobPosts.map((job) => (
<div key={job.id} className="job-post">
  
  <img 
    src={job.logo} 
    alt={`${job.company} logo`} 
    className="job-post__logo" 
  />

  <div className="job-post__info">
    <h3 className="job-post__title">{job.title}</h3>
    <p className="job-post__company">{job.company}</p>
  </div>

  <button 
    className="job-post__details"
    onClick={() => navigate(`/job/${job.id}`)}
  >
    Xem chi tiết
  </button>

</div>
      ))}
    </div>
  );
};

export default Content;