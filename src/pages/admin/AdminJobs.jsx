import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../api'
import { useToast } from '../../context/ToastContext'
import { formatDate, timeAgo, getJobTypeBadge, extractError } from '../../utils/helpers'
import './Admin.css'

const JOB_STATUSES = ['', 'ACTIVE', 'CLOSED', 'DRAFT']

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [filterStatus, setFilterStatus] = useState('')
  const toast = useToast()

  const fetchJobs = (p = 0) => {
    setLoading(true)
    const params = { page: p, size: 20 }
    if (filterStatus) params.status = filterStatus
    adminAPI.getJobs(params)
      .then(r => {
        setJobs(r.data.data?.content || [])
        setTotalPages(r.data.data?.totalPages || 0)
        setTotal(r.data.data?.totalElements || 0)
      })
      .catch(err => toast.error(extractError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchJobs(page) }, [page, filterStatus])

  const handleStatusChange = async (jobId, status) => {
    try {
      await adminAPI.updateJobStatus(jobId, status)
      toast.success('Job status updated')
      fetchJobs(page)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  const handleDelete = async (jobId, title) => {
    if (!confirm(`Delete job "${title}"? This cannot be undone.`)) return
    try {
      await adminAPI.deleteJob(jobId)
      toast.success('Job deleted')
      fetchJobs(page)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  const statusBadge = { ACTIVE: 'badge-green', CLOSED: 'badge-rose', DRAFT: 'badge-gray' }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-page-header">
          <div>
            <div className="breadcrumb"><Link to="/admin">← Dashboard</Link></div>
            <h1 className="page-title">Job Management</h1>
            <p className="page-sub">{total} total job listings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <select
            className="form-select"
            style={{width:'auto', minWidth:160}}
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(0) }}
          >
            <option value="">All Statuses</option>
            {JOB_STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="skeleton-card" style={{height:'400px'}} />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr><td colSpan={7} style={{textAlign:'center', padding:'40px', color:'var(--muted)'}}>No jobs found</td></tr>
                ) : jobs.map(j => {
                  const typeBadge = getJobTypeBadge(j.jobType)
                  return (
                    <tr key={j.id}>
                      <td>
                        <div className="job-cell">
                          <Link to={`/jobs/${j.id}`} className="job-cell-title">{j.title}</Link>
                          <span className="job-cell-loc">📍 {j.location || 'Remote'}</span>
                        </div>
                      </td>
                      <td className="company-cell">{j.companyName || j.employerName || '—'}</td>
                      <td><span className={`badge ${typeBadge.cls}`}>{typeBadge.label}</span></td>
                      <td>
                        <select
                          className="form-select status-select-sm"
                          value={j.status || 'ACTIVE'}
                          onChange={e => handleStatusChange(j.id, e.target.value)}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="CLOSED">Closed</option>
                          <option value="DRAFT">Draft</option>
                        </select>
                      </td>
                      <td className="center-cell">{j.applicationCount || 0}</td>
                      <td className="date-cell">{timeAgo(j.createdAt)}</td>
                      <td>
                        <div style={{display:'flex', gap:'6px'}}>
                          <Link to={`/jobs/${j.id}`} className="btn btn-secondary btn-sm">View</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(j.id, j.title)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" onClick={() => setPage(p => p-1)} disabled={page===0}>←</button>
            {[...Array(Math.min(totalPages, 8))].map((_,i) => (
              <button key={i} className={`pagination-btn ${i===page?'active':''}`} onClick={() => setPage(i)}>{i+1}</button>
            ))}
            <button className="pagination-btn" onClick={() => setPage(p => p+1)} disabled={page>=totalPages-1}>→</button>
          </div>
        )}
      </div>
    </div>
  )
}
