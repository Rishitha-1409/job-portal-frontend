import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, isAdmin, isEmployer, isJobSeeker } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">TalentBridge</span>
        </Link>

        <div className="navbar-links">
          <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>
            Browse Jobs
          </Link>

          {isJobSeeker && (
            <Link to="/my-applications" className={`nav-link ${isActive('/my-applications') ? 'active' : ''}`}>
              My Applications
            </Link>
          )}

          {isEmployer && (
            <>
              <Link to="/employer/jobs" className={`nav-link ${isActive('/employer/jobs') ? 'active' : ''}`}>
                My Jobs
              </Link>
              <Link to="/employer/post-job" className={`nav-link nav-link-cta ${isActive('/employer/post-job') ? 'active' : ''}`}>
                Post a Job
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
              Admin Panel
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="profile-menu-wrapper">
              <button
                className="profile-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="avatar">{getInitials(user.fullName || user.email)}</div>
                <span className="profile-name">{user.fullName?.split(' ')[0] || 'User'}</span>
                <span className="chevron">{profileOpen ? '▲' : '▾'}</span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown" onClick={() => setProfileOpen(false)}>
                  <div className="profile-dropdown-header">
                    <div className="avatar avatar-lg">{getInitials(user.fullName || user.email)}</div>
                    <div>
                      <div className="profile-dropdown-name">{user.fullName}</div>
                      <div className="profile-dropdown-email">{user.email}</div>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-rose' : user.role === 'EMPLOYER' ? 'badge-blue' : 'badge-green'}`}>
                        {user.role?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <hr className="divider" style={{margin: '8px 0'}}/>
                  {isJobSeeker && <Link to="/my-applications" className="dropdown-item">📋 My Applications</Link>}
                  {isEmployer && <Link to="/employer/jobs" className="dropdown-item">💼 My Jobs</Link>}
                  {isAdmin && <Link to="/admin" className="dropdown-item">⚙️ Admin Panel</Link>}
                  <hr className="divider" style={{margin: '8px 0'}}/>
                  <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
