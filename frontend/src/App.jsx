import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Components
import Header from './components/ui/header/Header';
import Footer from './components/ui/footer/Footer';

// Auth Components
import JobSeekerLogin from './components/ui/auth/JobSeekerLogin';
import JobSeekerRegister from './components/ui/auth/JobSeekerRegister';
import RecruiterLogin from './components/ui/auth/RecruiterLogin';
import RecruiterRegister from './components/ui/auth/RecruiterRegister';
import AdminLogin from './components/ui/auth/AdminLogin';

// Page Components
import HomePage from './pages/HomePage';
import JobDetail from './pages/JobDetail';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Job Seeker Routes */}
            <Route path="/jobseeker/login" element={<JobSeekerLogin />} />
            <Route path="/jobseeker/register" element={<JobSeekerRegister />} />

            {/* Recruiter Routes */}
            <Route path="/recruiter/login" element={<RecruiterLogin />} />
            <Route path="/recruiter/register" element={<RecruiterRegister />} />
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
