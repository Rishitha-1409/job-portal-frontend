import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationsAPI, jobsAPI } from '../../api'
import { useToast } from '../../context/ToastContext'
import { extractError } from '../../utils/helpers'
import ApplicationCard from '../../components/applications/ApplicationCard'
import './EmployerApplications.css'

const STATUSES = ['ALL', 'PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED']

export default function EmployerApplications() {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const toast = useToast()

  useEffect(() => {
    jobsAPI.getById(jobId).then(r => setJob(r.data)).catch(() => {})
  }, [jobId])

  const fetchApps = (p = 0) => {
    setLoading(true)
    const call = filter !== 'ALL'
      ? applicationsAPI.getForJobByStatus(jobId, filter, { page: p, size: 10 })
      : applicationsAPI.getForJob(jobId, { page: p, size: 10 })
    call
      .then(r => {
        setApps(r.data.data?.content || [])
        setTotalPages(r.data.data?.totalPages || 0)
      })
      .catch(err => toast.error(extractError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchApps(page) }, [jobId, filter, page])

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(appId, newStatus, '')
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
      fetchApps(page)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  const count = (s) => apps.filter(a => a.status === s).length

  return (
    <div className="emp-apps-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/employer/jobs">← My Jobs</Link>
          {job && <><span>/</span><span>{job.title}</span></>}
        </div>

        <div className="emp-apps-header">
          <div>
            <h1 className="page-title">{job ? `${job.title} — Applicants` : 'Applicants'}</h1>
            <p className="page-sub">{apps.length} applications{filter !== 'ALL' ? ` · filtered by ${filter.replace('_', ' ')}` : ''}</p>
          </div>
          {job && (
            <Link to={`/jobs/${jobId}`} className="btn btn-secondary">View Job Posting →</Link>
          )}
        </div>

        {/* Status filter tabs */}
        <div className="status-tabs">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`status-tab ${filter === s ? 'active' : ''}`}
              onClick={() => { setFilter(s); setPage(0) }}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" style={{height:'140px'}} />)}
          </div>
        ) : apps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No applications{filter !== 'ALL' ? ` with status "${filter.replace('_',' ')}"` : ' yet'}</h3>
            <p>Applications will appear here once candidates apply to this job.</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {apps.map(app => (
              <ApplicationCard
                key={app.id}
                app={app}
                isEmployer
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" onClick={() => setPage(p => p-1)} disabled={page===0}>←</button>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} className={`pagination-btn ${i===page?'active':''}`} onClick={() => setPage(i)}>{i+1}</button>
            ))}
            <button className="pagination-btn" onClick={() => setPage(p => p+1)} disabled={page>=totalPages-1}>→</button>
          </div>
        )}
      </div>
    </div>
  )
}
