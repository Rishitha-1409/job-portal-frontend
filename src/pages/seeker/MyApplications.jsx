import React, { useEffect, useState } from 'react'
import { applicationsAPI } from '../../api'
import { useToast } from '../../context/ToastContext'
import { extractError } from '../../utils/helpers'
import ApplicationCard from '../../components/applications/ApplicationCard'
import './MyApplications.css'

const STATUSES = ['ALL', 'PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']

export default function MyApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const toast = useToast()

  const fetchApps = (p = 0) => {
    setLoading(true)
    applicationsAPI.getMy({ page: p, size: 10 })
      .then(r => {
        setApps(r.data.data?.content || [])
        setTotalPages(r.data.data?.totalPages || 0)
      })
      .catch(err => toast.error(extractError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchApps(page) }, [page])

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return
    try {
      await applicationsAPI.withdraw(id)
      toast.success('Application withdrawn')
      fetchApps(page)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  const filtered = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  const statusCount = (s) => apps.filter(a => a.status === s).length

  return (
    <div className="my-apps-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Applications</h1>
          <p className="page-sub">Track all your job applications in one place</p>
        </div>

        {/* Stats row */}
        <div className="apps-stats">
          <div className="stat-pill"><span className="sp-num">{apps.length}</span><span>Total</span></div>
          <div className="stat-pill sp-green"><span className="sp-num">{statusCount('ACCEPTED')}</span><span>Accepted</span></div>
          <div className="stat-pill sp-amber"><span className="sp-num">{statusCount('PENDING')}</span><span>Pending</span></div>
          <div className="stat-pill sp-blue"><span className="sp-num">{statusCount('REVIEWING') + statusCount('SHORTLISTED')}</span><span>In Review</span></div>
          <div className="stat-pill sp-purple"><span className="sp-num">{statusCount('INTERVIEW_SCHEDULED')}</span><span>Interviews</span></div>
        </div>

        {/* Status filter tabs */}
        <div className="status-tabs">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`status-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
              {s !== 'ALL' && statusCount(s) > 0 && <span className="tab-count">{statusCount(s)}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="apps-list">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" style={{height:'140px'}} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>{filter === 'ALL' ? "No applications yet" : `No ${filter.replace('_', ' ').toLowerCase()} applications`}</h3>
            <p>Start applying to jobs to track your progress here.</p>
          </div>
        ) : (
          <div className="apps-list">
            {filtered.map(app => (
              <ApplicationCard key={app.id} app={app} isEmployer={false} onWithdraw={handleWithdraw} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>←</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`pagination-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>→</button>
          </div>
        )}
      </div>
    </div>
  )
}
