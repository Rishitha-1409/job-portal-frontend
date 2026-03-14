import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../api'
import { useToast } from '../../context/ToastContext'
import { formatDate, getInitials, extractError, getStatusBadge } from '../../utils/helpers'
import './Admin.css'

const ROLES = ['', 'ADMIN', 'EMPLOYER', 'JOB_SEEKER']
const STATUSES = ['', 'ACTIVE', 'SUSPENDED', 'BANNED']

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const toast = useToast()

  const fetchUsers = (p = 0) => {
    setLoading(true)
    const params = { page: p, size: 20 }
    if (filterRole) params.role = filterRole
    if (filterStatus) params.status = filterStatus
    if (keyword) params.keyword = keyword
    adminAPI.getUsers(params)
      .then(r => {
        setUsers(r.data.data?.content || [])
        setTotalPages(r.data.data?.totalPages || 0)
        setTotal(r.data.data?.totalElements || 0)
      })
      .catch(err => toast.error(extractError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers(page) }, [page, filterRole, filterStatus, keyword])

  const handleStatusChange = async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status)
      toast.success('User status updated')
      fetchUsers(page)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  const handleDelete = async (userId, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await adminAPI.deleteUser(userId)
      toast.success('User deleted')
      fetchUsers(page)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  const roleBadge = { ADMIN: 'badge-rose', EMPLOYER: 'badge-blue', JOB_SEEKER: 'badge-green' }
  const accountStatusBadge = { ACTIVE: 'badge-green', SUSPENDED: 'badge-amber', BANNED: 'badge-rose' }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-page-header">
          <div>
            <div className="breadcrumb"><Link to="/admin">← Dashboard</Link></div>
            <h1 className="page-title">User Management</h1>
            <p className="page-sub">{total} registered users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <form onSubmit={e => { e.preventDefault(); setKeyword(searchInput); setPage(0) }} className="admin-search">
            <input
              className="form-input"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <select className="form-select" style={{width:'auto', minWidth:140}} value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(0) }}>
            <option value="">All Roles</option>
            {ROLES.slice(1).map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
          <select className="form-select" style={{width:'auto', minWidth:140}} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0) }}>
            <option value="">All Statuses</option>
            {STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="skeleton-card" style={{height:'400px'}} />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{textAlign:'center', padding:'40px', color:'var(--muted)'}}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar" style={{background: u.role === 'ADMIN' ? 'var(--rose)' : u.role === 'EMPLOYER' ? 'var(--sky)' : 'var(--accent)'}}>
                          {getInitials(u.fullName || u.email)}
                        </div>
                        <div>
                          <div className="user-name">{u.fullName}</div>
                          <div className="user-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${roleBadge[u.role] || 'badge-gray'}`}>{u.role?.replace('_', ' ')}</span></td>
                    <td>
                      <select
                        className="form-select status-select-sm"
                        value={u.accountStatus || 'ACTIVE'}
                        onChange={e => handleStatusChange(u.id, e.target.value)}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="BANNED">Banned</option>
                      </select>
                    </td>
                    <td className="date-cell">{formatDate(u.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u.id, u.fullName)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
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
