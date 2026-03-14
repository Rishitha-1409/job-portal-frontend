import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { jobsAPI, applicationsAPI } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, formatSalary, getJobTypeBadge, getExperienceBadge, timeAgo, extractError } from '../../utils/helpers'
import './JobDetail.css'

export default function JobDetail() {
  const { id } = useParams()
  const { user, isJobSeeker } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [form, setForm] = useState({ coverLetter: '', resumeUrl: '' })

  useEffect(() => {
    jobsAPI.getById(id)
      .then(r => setJob(r.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      await applicationsAPI.apply(id, form)
      toast.success('Application submitted successfully!')
      setShowApplyModal(false)
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="container" style={{padding: '80px 24px', textAlign:'center'}}>
      <div className="spinner" style={{margin:'0 auto', width:40, height:40}}></div>
    </div>
  )

  if (!job) return null

  const typeBadge = getJobTypeBadge(job.jobType)
  const expBadge = getExperienceBadge(job.experienceLevel)

  return (
    <div className="job-detail-page">
      <div className="container">
        <div className="job-detail-layout">
          {/* Main content */}
          <main className="job-detail-main animate-fade-up">
            {/* Header */}
            <div className="job-detail-header card">
              <div className="job-detail-company">
                <div className="company-logo-lg">
                  {job.companyLogoUrl
                    ? <img src={job.companyLogoUrl} alt={job.companyName} />
                    : <span>{(job.companyName || '?')[0]}</span>
                  }
                </div>
                <div>
                  <div className="company-name-lg">{job.companyName || job.employerName}</div>
                  <div className="company-location">{job.companyLocation || job.location}</div>
                </div>
              </div>

              <h1 className="job-detail-title">{job.title}</h1>

              <div className="job-detail-tags">
                <span className={`badge ${typeBadge.cls}`}>{typeBadge.label}</span>
                <span className={`badge ${expBadge.cls}`}>{expBadge.label}</span>
                {job.remote && <span className="badge badge-green">🌐 Remote</span>}
                {job.category && <span className="badge badge-gray">{job.category}</span>}
              </div>

              <div className="job-detail-meta-row">
                <span>📍 {job.location || 'Not specified'}</span>
                <span>📅 Posted {timeAgo(job.createdAt)}</span>
                <span>👁 {job.viewCount} views</span>
                <span>📋 {job.applicationCount} applicants</span>
                {job.deadline && <span>⏰ Deadline: {formatDate(job.deadline)}</span>}
              </div>

              {isJobSeeker && (
                <button className="btn btn-primary btn-lg apply-btn" onClick={() => setShowApplyModal(true)}>
                  Apply Now →
                </button>
              )}

              {!user && (
                <div className="apply-cta">
                  <Link to="/login" className="btn btn-primary btn-lg">Sign in to Apply</Link>
                  <span className="apply-hint">or <Link to="/register">create an account</Link></span>
                </div>
              )}
            </div>

            {/* Description */}
            {job.description && (
              <div className="card job-detail-section">
                <h2 className="section-h2">About this Role</h2>
                <div className="prose">{job.description}</div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="card job-detail-section">
                <h2 className="section-h2">Responsibilities</h2>
                <div className="prose">{job.responsibilities}</div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="card job-detail-section">
                <h2 className="section-h2">Requirements</h2>
                <div className="prose">{job.requirements}</div>
              </div>
            )}

            {/* Skills */}
            {job.skillsRequired && (
              <div className="card job-detail-section">
                <h2 className="section-h2">Required Skills</h2>
                <div className="skills-list">
                  {job.skillsRequired.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} className="skill-tag-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="job-detail-sidebar">
            <div className="card sidebar-card">
              <h3 className="sidebar-title">Compensation</h3>
              <div className="salary-display">
                {formatSalary(job.salaryMin, job.salaryMax, job.currency, job.salaryVisible)}
              </div>
              <span className="salary-period">per year</span>
            </div>

            {job.tags && (
              <div className="card sidebar-card">
                <h3 className="sidebar-title">Tags</h3>
                <div className="tags-list">
                  {job.tags.split(',').map(t => t.trim()).filter(Boolean).map((t, i) => (
                    <span key={i} className="badge badge-gray">{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="card sidebar-card">
              <h3 className="sidebar-title">Job Overview</h3>
              <div className="overview-list">
                <div className="overview-item">
                  <span className="ov-label">Type</span>
                  <span className="ov-val">{job.jobType?.replace('_', ' ')}</span>
                </div>
                <div className="overview-item">
                  <span className="ov-label">Experience</span>
                  <span className="ov-val">{job.experienceLevel?.replace('_', ' ')}</span>
                </div>
                <div className="overview-item">
                  <span className="ov-label">Location</span>
                  <span className="ov-val">{job.remote ? 'Remote' : job.location}</span>
                </div>
                {job.deadline && (
                  <div className="overview-item">
                    <span className="ov-label">Deadline</span>
                    <span className="ov-val">{formatDate(job.deadline)}</span>
                  </div>
                )}
              </div>
            </div>

            <Link to="/jobs" className="btn btn-secondary" style={{width:'100%', justifyContent:'center'}}>
              ← Back to Jobs
            </Link>
          </aside>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-box animate-fade-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApply} className="modal-form">
              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  value={form.coverLetter}
                  onChange={e => setForm(f => ({...f, coverLetter: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Resume URL</label>
                <input
                  className="form-input"
                  type="url"
                  placeholder="https://drive.google.com/your-resume"
                  value={form.resumeUrl}
                  onChange={e => setForm(f => ({...f, resumeUrl: e.target.value}))}
                />
                <span className="form-hint">Link to your resume (Google Drive, Dropbox, etc.)</span>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? <><span className="spinner" style={{borderTopColor:'white'}}></span>Submitting…</> : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
