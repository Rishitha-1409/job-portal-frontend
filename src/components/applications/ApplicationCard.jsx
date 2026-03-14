import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate, getStatusBadge, timeAgo } from '../../utils/helpers'
import './ApplicationCard.css'

export default function ApplicationCard({ app, isEmployer, onStatusChange, onWithdraw }) {
  const statusBadge = getStatusBadge(app.status)

  return (
    <div className="app-card animate-fade-up">
      <div className="app-card-top">
        <div className="app-card-info">
          {isEmployer ? (
            <>
              <div className="app-avatar">{(app.applicantName || '?')[0].toUpperCase()}</div>
              <div>
                <div className="app-name">{app.applicantName}</div>
                <div className="app-sub">{app.applicantEmail}</div>
              </div>
            </>
          ) : (
            <>
              <div className="app-job-icon">💼</div>
              <div>
                <div className="app-name">{app.jobTitle}</div>
                <div className="app-sub">{app.companyName} · {app.jobLocation}</div>
              </div>
            </>
          )}
        </div>
        <div className="app-card-right">
          <span className={`badge ${statusBadge.cls}`}>{statusBadge.label}</span>
          <span className="app-date">{timeAgo(app.appliedAt)}</span>
        </div>
      </div>

      {app.coverLetter && (
        <div className="app-cover-preview">
          "{app.coverLetter.slice(0, 160)}{app.coverLetter.length > 160 ? '…' : ''}"
        </div>
      )}

      {app.employerNotes && (
        <div className="app-notes">
          <span className="notes-label">Employer note:</span> {app.employerNotes}
        </div>
      )}

      <div className="app-card-footer">
        <div className="app-card-actions">
          {app.resumeUrl && (
            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
              📄 Resume
            </a>
          )}

          {isEmployer && onStatusChange && app.status !== 'WITHDRAWN' && (
            <div className="status-select-wrapper">
              <select
                className="form-select status-select"
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWING">Reviewing</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}

          {!isEmployer && app.status === 'PENDING' && onWithdraw && (
            <button onClick={() => onWithdraw(app.id)} className="btn btn-ghost btn-sm" style={{color:'var(--rose)'}}>
              Withdraw
            </button>
          )}

          {!isEmployer && (
            <Link to={`/jobs/${app.jobId}`} className="btn btn-ghost btn-sm">
              View Job →
            </Link>
          )}
        </div>
        <div className="app-applied-date">Applied {formatDate(app.appliedAt)}</div>
      </div>
    </div>
  )
}
