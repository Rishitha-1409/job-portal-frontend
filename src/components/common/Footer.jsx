import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">⬡ TalentBridge</Link>
          <p className="footer-tagline">Connecting talent with opportunity, one job at a time.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>For Job Seekers</h4>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/register?role=JOB_SEEKER">Create Account</Link>
            <Link to="/my-applications">My Applications</Link>
          </div>
          <div className="footer-col">
            <h4>For Employers</h4>
            <Link to="/register?role=EMPLOYER">Post a Job</Link>
            <Link to="/employer/jobs">Manage Postings</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} TalentBridge. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
