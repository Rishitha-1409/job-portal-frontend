import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../api'
import { useToast } from '../../context/ToastContext'
import { extractError } from '../../utils/helpers'
import './Admin.css'

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="admin-stat-card" style={{'--card-accent': color}}>
      <div className="asc-icon">{icon}</div>
      <div className="asc-body">
        <div className="asc-value">{value ?? '—'}</div>
        <div className="asc-label">{label}</div>
        {sub && <div className="asc-sub">{sub}</div>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setStats(r.data.data))
      .catch(err => toast.error(extractError(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-sub">Overview of platform activity</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-stats-grid">
            {[...Array(7)].map((_, i) => <div key={i} className="skeleton-card" style={{height:'110px'}} />)}
          </div>
        ) : (
          <>
            <div className="admin-stats-grid">
              <StatCard icon="👥" label="Total Users"       value={stats?.totalUsers}         color="var(--accent)" />
              <StatCard icon="🎯" label="Job Seekers"       value={stats?.jobSeekers}          color="var(--emerald)" />
              <StatCard icon="🏢" label="Employers"         value={stats?.employers}           color="var(--sky)" />
              <StatCard icon="💼" label="Total Jobs"        value={stats?.totalJobs}           color="var(--amber)" />
              <StatCard icon="✅" label="Active Jobs"       value={stats?.activeJobs}          color="var(--emerald)" />
              <StatCard icon="📋" label="Total Applications" value={stats?.totalApplications}  color="var(--accent)" />
              <StatCard icon="⏳" label="Pending Applications" value={stats?.pendingApplications} color="var(--amber)" />
            </div>

            <div className="admin-nav-cards">
              <Link to="/admin/users" className="admin-nav-card">
                <div className="anc-icon">👥</div>
                <div>
                  <div className="anc-title">Manage Users</div>
                  <div className="anc-sub">View, suspend, or delete user accounts</div>
                </div>
                <span className="anc-arrow">→</span>
              </Link>
              <Link to="/admin/jobs" className="admin-nav-card">
                <div className="anc-icon">💼</div>
                <div>
                  <div className="anc-title">Manage Jobs</div>
                  <div className="anc-sub">Review, update status, or remove job listings</div>
                </div>
                <span className="anc-arrow">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
