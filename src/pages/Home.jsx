import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobsAPI } from "../api";
import JobCard from "../components/jobs/JobCard";
import './Home.css'

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Data Science']

export default function Home() {
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    jobsAPI.getAll({ page: 0, size: 6 })
      .then(r => setRecentJobs(r.data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?q=${encodeURIComponent(search)}`)
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">🚀 Your next career move starts here</div>
          <h1 className="hero-title">
            Find Jobs That<br />
            <span className="hero-accent">Actually Fit You</span>
          </h1>
          <p className="hero-subtitle">
            TalentBridge connects ambitious professionals with companies that value them.
            Browse thousands of curated opportunities across every industry.
          </p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Job title, skills, or company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Search Jobs</button>
          </form>

          <div className="hero-stats">
            <div className="stat"><strong>10K+</strong><span>Active Jobs</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>5K+</strong><span>Companies</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>50K+</strong><span>Professionals</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-heading">Browse by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat} to={`/jobs?category=${encodeURIComponent(cat)}`} className="category-chip">
                <span className="category-name">{cat}</span>
                <span className="category-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="jobs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-heading">Latest Opportunities</h2>
            <Link to="/jobs" className="btn btn-secondary">View All Jobs →</Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="jobs-grid">
              {recentJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA split */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-card cta-seeker">
              <div className="cta-icon">👤</div>
              <h3>Looking for Work?</h3>
              <p>Create your profile and apply to hundreds of open positions with one click.</p>
              <Link to="/register?role=JOB_SEEKER" className="btn btn-primary">Get Started Free</Link>
            </div>
            <div className="cta-card cta-employer">
              <div className="cta-icon">🏢</div>
              <h3>Hiring Talent?</h3>
              <p>Post jobs, manage applicants, and find the right candidate faster than ever.</p>
              <Link to="/register?role=EMPLOYER" className="btn btn-primary">Post a Job</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
