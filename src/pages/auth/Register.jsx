import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { extractError } from '../../utils/helpers'
import './Auth.css'

export default function Register() {
  const { register, loading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [role, setRole] = useState(params.get('role') || 'JOB_SEEKER')
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    companyName: '', companyWebsite: '', industry: '',
    skills: '', currentTitle: '',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setErrors(e => ({...e, [k]: ''})) }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (role === 'EMPLOYER' && !form.companyName.trim()) e.companyName = 'Company name is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      const payload = { fullName: form.fullName, email: form.email, password: form.password, role }
      if (role === 'EMPLOYER') {
        payload.companyName = form.companyName
        payload.companyWebsite = form.companyWebsite
        payload.industry = form.industry
      } else {
        payload.skills = form.skills
        payload.currentTitle = form.currentTitle
      }
      const user = await register(payload)
      toast.success('Account created successfully!')
      if (user.role === 'EMPLOYER') navigate('/employer/jobs')
      else navigate('/jobs')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide animate-fade-up">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⬡ TalentBridge</Link>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join thousands of professionals on TalentBridge</p>
        </div>

        {/* Role selector */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'JOB_SEEKER' ? 'active' : ''}`}
            onClick={() => setRole('JOB_SEEKER')}
          >
            <span>👤</span>
            <div>
              <strong>Job Seeker</strong>
              <span>Find your next opportunity</span>
            </div>
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'EMPLOYER' ? 'active' : ''}`}
            onClick={() => setRole('EMPLOYER')}
          >
            <span>🏢</span>
            <div>
              <strong>Employer</strong>
              <span>Hire top talent</span>
            </div>
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Jane Smith" />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password" />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            {role === 'EMPLOYER' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input className="form-input" value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Acme Corp" />
                  {errors.companyName && <span className="form-error">{errors.companyName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input className="form-input" value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="Technology, Healthcare…" />
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Company Website</label>
                  <input className="form-input" value={form.companyWebsite} onChange={e => set('companyWebsite', e.target.value)} placeholder="https://yourcompany.com" />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Current Title</label>
                  <input className="form-input" value={form.currentTitle} onChange={e => set('currentTitle', e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills</label>
                  <input className="form-input" value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="React, Python, SQL…" />
                </div>
              </>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%', marginTop: '8px'}} disabled={loading}>
            {loading ? <><span className="spinner" style={{borderTopColor:'white'}}></span> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
