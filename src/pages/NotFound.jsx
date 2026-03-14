import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="not-found-page">
      <div className="nf-content animate-fade-up">
        <div className="nf-code">404</div>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-sub">The page you're looking for doesn't exist or has been moved.</p>
        <div className="nf-actions">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">← Go Back</button>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  )
}
