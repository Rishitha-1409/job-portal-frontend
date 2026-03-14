import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { jobsAPI } from '../../api'
import JobCard from '../../components/jobs/JobCard'
import './Jobs.css'

const PAGE_SIZE = 12

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  const page = Number(searchParams.get('page') || 0)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const jobType = searchParams.get('jobType') || ''
  const experienceLevel = searchParams.get('exp') || ''
  const remoteOnly = searchParams.get('remote') === 'true'

  const [search, setSearch] = useState(query)

  const fetchJobs = useCallback(() => {
    setLoading(true)
    const params = { page, size: PAGE_SIZE, sort: 'createdAt,desc' }
    jobsAPI.getAll(params)
      .then(r => {
        setJobs(r.data.content || [])
        setTotal(r.data.totalElements || 0)
        setTotalPages(r.data.totalPages || 0)
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams(p => { const n = new URLSearchParams(p); n.set('q', search); n.set('page', '0'); return n })
  }

  const setParam = (k, v) => {
    setSearchParams(p => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); n.set('page', '0'); return n })
  }

  const setPage = (p) => {
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', p); return n })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header-bar">
        <div className="container">
          <h1 className="jobs-page-title">Browse Jobs</h1>
          <p className="jobs-page-sub">{total.toLocaleString()} opportunities waiting for you</p>

          <form className="jobs-search-bar" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search jobs, skills, companies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container jobs-layout">
        {/* Sidebar filters */}
        <aside className="jobs-sidebar">
          <div className="filter-panel">
            <h3 className="filter-title">Filters</h3>

            <div className="filter-group">
              <label className="filter-label">Job Type</label>
              {['', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].map(t => (
                <label key={t} className="filter-radio">
                  <input
                    type="radio"
                    name="jobType"
                    checked={jobType === t}
                    onChange={() => setParam('jobType', t)}
                  />
                  <span>{t === '' ? 'All Types' : t.replace('_', ' ')}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <label className="filter-label">Experience Level</label>
              {['', 'ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL'].map(l => (
                <label key={l} className="filter-radio">
                  <input
                    type="radio"
                    name="exp"
                    checked={experienceLevel === l}
                    onChange={() => setParam('exp', l)}
                  />
                  <span>{l === '' ? 'All Levels' : l.replace('_', ' ')}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <label className="filter-label">Work Mode</label>
              <label className="filter-radio">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={e => setParam('remote', e.target.checked ? 'true' : '')}
                />
                <span>Remote Only 🌐</span>
              </label>
            </div>

            {(jobType || experienceLevel || remoteOnly || query || category) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSearchParams({})}
                style={{color: 'var(--rose)'}}
              >
                ✕ Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Jobs list */}
        <main className="jobs-main">
          {loading ? (
            <div className="jobs-grid-list">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" style={{height:'200px'}} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search filters or check back later for new opportunities.</p>
            </div>
          ) : (
            <>
              <div className="jobs-grid-list">
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 0}>←</button>
                  {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                    const p = i
                    return (
                      <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                        {p + 1}
                      </button>
                    )
                  })}
                  <button className="pagination-btn" onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>→</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
