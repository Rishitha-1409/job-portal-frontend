import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../api'
import { useToast } from '../../context/ToastContext'
import { extractError } from '../../utils/helpers'
import JobCard from '../../components/jobs/JobCard'
import './EmployerJobs.css'

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchJobs = () => {
  setLoading(true)
  jobsAPI.getEmployerJobs({ page: 0, size: 50 })
    .then(r => setJobs(r.data.content || []))
    .catch(err => toast.error(extractError(err)))
    .finally(() => setLoading(false))
}

  useEffect(() => { fetchJobs() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting? This cannot be undone.')) return
    try {
      await jobsAPI.delete(id)
      toast.success('Job deleted')
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0)

  return (
    <div className="employer-jobs-page">
      <div className="container">
        <div className="employer-header">
          <div>
            <h1 className="page-title">My Job Postings</h1>
            <p className="page-sub">{jobs.length} jobs · {totalApplicants} total applicants</p>
          </div>
          <Link to="/employer/post-job" className="btn btn-primary btn-lg">
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="employer-stats">
          <div className="emp-stat">
            <span className="emp-stat-num">{jobs.length}</span>
            <span>Total Jobs</span>
          </div>
          <div className="emp-stat">
            <span className="emp-stat-num">{jobs.filter(j => j.status === 'ACTIVE').length}</span>
            <span>Active</span>
          </div>
          <div className="emp-stat">
            <span className="emp-stat-num">{jobs.filter(j => j.status === 'CLOSED').length}</span>
            <span>Closed</span>
          </div>
          <div className="emp-stat">
            <span className="emp-stat-num">{totalApplicants}</span>
            <span>Applicants</span>
          </div>
        </div>

        {loading ? (
          <div className="emp-jobs-grid">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" style={{height:'220px'}} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            <h3>No job postings yet</h3>
            <p>Create your first job posting to start receiving applications.</p>
            <Link to="/employer/post-job" className="btn btn-primary">Post Your First Job</Link>
          </div>
        ) : (
          <div className="emp-jobs-grid">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} showActions onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
