import {Toaster} from 'sonner';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import Header from './components/ui/header/Header';
import Content from './components/ui/content/Content';
import Pagination from './components/ui/pagination/Pagination';
import Footer from './components/ui/footer/Footer';
import JobSeekerLogin from './components/ui/auth/JobSeekerLogin';
import JobSeekerRegister from './components/ui/auth/JobSeekerRegister';
import RecruiterLogin from './components/ui/auth/RecruiterLogin';
import RecruiterRegister from './components/ui/auth/RecruiterRegister';
import JobDetail from './pages/JobDetail';
import AdminLogin from './components/ui/auth/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Content />} />
          <Route path='/jobseeker/login' element={<JobSeekerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path='/jobseeker/register' element={<JobSeekerRegister />} />
          <Route path='/recruiter/login' element={<RecruiterLogin />} />
          <Route path='/recruiter/register' element={<RecruiterRegister />} />
          <Route path='/job/:id' element={<JobDetail />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Pagination />
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
