export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export function formatSalary(min, max, currency = 'USD', visible = true) {
  if (!visible) return 'Salary not disclosed'
  if (!min && !max) return 'Salary not specified'
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max)}`
}

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function getJobTypeBadge(type) {
  const map = {
    FULL_TIME: { label: 'Full Time', cls: 'badge-green' },
    PART_TIME: { label: 'Part Time', cls: 'badge-blue' },
    CONTRACT: { label: 'Contract', cls: 'badge-amber' },
    INTERNSHIP: { label: 'Internship', cls: 'badge-purple' },
  }
  return map[type] || { label: type, cls: 'badge-gray' }
}

export function getExperienceBadge(level) {
  const map = {
    ENTRY_LEVEL: { label: 'Entry Level', cls: 'badge-green' },
    MID_LEVEL: { label: 'Mid Level', cls: 'badge-blue' },
    SENIOR_LEVEL: { label: 'Senior Level', cls: 'badge-purple' },
  }
  return map[level] || { label: level, cls: 'badge-gray' }
}

export function getStatusBadge(status) {
  const map = {
    PENDING: { label: 'Pending', cls: 'badge-amber' },
    REVIEWING: { label: 'Reviewing', cls: 'badge-blue' },
    SHORTLISTED: { label: 'Shortlisted', cls: 'badge-purple' },
    INTERVIEW_SCHEDULED: { label: 'Interview', cls: 'badge-rose' },
    ACCEPTED: { label: 'Accepted', cls: 'badge-green' },
    REJECTED: { label: 'Rejected', cls: 'badge-rose' },
    WITHDRAWN: { label: 'Withdrawn', cls: 'badge-gray' },
    ACTIVE: { label: 'Active', cls: 'badge-green' },
    CLOSED: { label: 'Closed', cls: 'badge-rose' },
    DRAFT: { label: 'Draft', cls: 'badge-gray' },
  }
  return map[status] || { label: status, cls: 'badge-gray' }
}

export function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function extractError(err) {
  return err?.response?.data?.message || err?.message || 'Something went wrong'
}
