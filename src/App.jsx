import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Jobs from './pages/jobs/Jobs'
import JobDetail from './pages/jobs/JobDetail'
import MyApplications from './pages/seeker/MyApplications'
import EmployerJobs from './pages/employer/EmployerJobs'
import { PostJob, EditJob } from './pages/employer/PostJob'
import EmployerApplications from './pages/employer/EmployerApplications'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminJobs from './pages/admin/AdminJobs'
import NotFound from './pages/NotFound'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Job Seeker */}
              <Route path="/my-applications" element={
                <ProtectedRoute roles={['JOB_SEEKER']}>
                  <MyApplications />
                </ProtectedRoute>
              } />

              {/* Employer */}
              <Route path="/employer/jobs" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <EmployerJobs />
                </ProtectedRoute>
              } />
              <Route path="/employer/post-job" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <PostJob />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs/:id/edit" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <EditJob />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs/:jobId/applications" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <EmployerApplications />
                </ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminJobs />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
