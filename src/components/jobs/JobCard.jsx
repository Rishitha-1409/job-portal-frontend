import React from 'react'
import { Link } from 'react-router-dom'
import { formatSalary, timeAgo, getJobTypeBadge, getExperienceBadge } from '../../utils/helpers'
import './JobCard.css'

export default function JobCard({ job, showActions, onDelete }) {
  const typeBadge = getJobTypeBadge(job.jobType)
  const expBadge = getExperienceBadge(job.experienceLevel)

  return (
    <div className="job-card animate-fade-up">
      <div className="job-card-header">
        <div className="company-logo">
          {job.companyLogoUrl
            ? <img src={job.companyLogoUrl} alt={job.companyName} />
            : <span>{(job.companyName || job.employerName || '?')[0].toUpperCase()}</span>
          }
        </div>
        <div className="job-card-meta">
          <span className="company-name">{job.companyName || job.employerName}</span>
          <span className="post-time">{timeAgo(job.createdAt)}</span>
        </div>
        {job.remote && <span className="remote-badge">🌐 Remote</span>}
      </div>

      <h3 className="job-title">
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
      </h3>

      <div className="job-location">
        <span>📍 {job.location || 'Location not specified'}</span>
      </div>

      <div className="job-badges">
        <span className={`badge ${typeBadge.cls}`}>{typeBadge.label}</span>
        <span className={`badge ${expBadge.cls}`}>{expBadge.label}</span>
        {job.category && <span className="badge badge-gray">{job.category}</span>}
      </div>

      {job.skillsRequired && (
        <div className="job-skills">
          {job.skillsRequired.split(',').slice(0, 4).map(s => s.trim()).filter(Boolean).map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}

      <div className="job-card-footer">
        <div className="job-salary">
          {formatSalary(job.salaryMin, job.salaryMax, job.currency, job.salaryVisible)}
        </div>

        <div className="job-actions">
          {showActions ? (
            <>
              <Link to={`/employer/jobs/${job.id}/applications`} className="btn btn-ghost btn-sm">
                {job.applicationCount || 0} applicants
              </Link>
              <Link to={`/employer/jobs/${job.id}/edit`} className="btn btn-secondary btn-sm">
                Edit
              </Link>
              {onDelete && (
                <button onClick={() => onDelete(job.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              )}
            </>
          ) : (
            <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
              View Job
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
