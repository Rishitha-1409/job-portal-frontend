import React, { useState } from 'react'
import './JobForm.css'

const DEFAULT = {
  title: '',
  description: '',
  requirements: '',
  responsibilities: '',
  location: '',
  remote: false,
  jobType: 'FULL_TIME',
  experienceLevel: 'MID_LEVEL',
  category: '',
  skillsRequired: '',
  tags: '',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  salaryVisible: true,
  deadline: '',
}

export default function JobForm({ initial = {}, onSubmit, loading, submitLabel = 'Post Job' }) {
  const [form, setForm] = useState({ ...DEFAULT, ...initial,
    salaryMin: initial.salaryMin || '',
    salaryMax: initial.salaryMax || '',
    deadline: initial.deadline ? initial.deadline.slice(0, 16) : '',
  })
  const [errors, setErrors] = useState({})

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Job title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.location.trim() && !form.remote) e.location = 'Location or Remote is required'
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax))
      e.salaryMax = 'Max salary must be greater than min'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const payload = {
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    }
    onSubmit(payload)
  }

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      {/* Basic Info */}
      <section className="form-section">
        <h3 className="section-title">Basic Information</h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior React Developer" />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Engineering, Design, Marketing" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-textarea" rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role, responsibilities and what makes this a great opportunity..." />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Requirements</label>
          <textarea className="form-textarea" rows={4} value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="List qualifications, education, and skills required..." />
        </div>

        <div className="form-group">
          <label className="form-label">Responsibilities</label>
          <textarea className="form-textarea" rows={4} value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} placeholder="Key responsibilities and day-to-day tasks..." />
        </div>
      </section>

      {/* Location & Type */}
      <section className="form-section">
        <h3 className="section-title">Location & Job Type</h3>
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. New York, NY" />
            {errors.location && <span className="form-error">{errors.location}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select className="form-select" value={form.jobType} onChange={e => set('jobType', e.target.value)}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select className="form-select" value={form.experienceLevel} onChange={e => set('experienceLevel', e.target.value)}>
              <option value="ENTRY_LEVEL">Entry Level</option>
              <option value="MID_LEVEL">Mid Level</option>
              <option value="SENIOR_LEVEL">Senior Level</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="remote-toggle">
            <input type="checkbox" checked={form.remote} onChange={e => set('remote', e.target.checked)} />
            <span className="toggle-label">🌐 This is a remote position</span>
          </label>
        </div>
      </section>

      {/* Skills & Tags */}
      <section className="form-section">
        <h3 className="section-title">Skills & Tags</h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Required Skills</label>
            <input className="form-input" value={form.skillsRequired} onChange={e => set('skillsRequired', e.target.value)} placeholder="React, TypeScript, Node.js (comma-separated)" />
            <span className="form-hint">Separate skills with commas</span>
          </div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <input className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="startup, saas, fintech (comma-separated)" />
          </div>
        </div>
      </section>

      {/* Salary */}
      <section className="form-section">
        <h3 className="section-title">Compensation</h3>
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Min Salary</label>
            <input className="form-input" type="number" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} placeholder="60000" />
          </div>
          <div className="form-group">
            <label className="form-label">Max Salary</label>
            <input className="form-input" type="number" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} placeholder="100000" />
            {errors.salaryMax && <span className="form-error">{errors.salaryMax}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-select" value={form.currency} onChange={e => set('currency', e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="remote-toggle">
            <input type="checkbox" checked={form.salaryVisible} onChange={e => set('salaryVisible', e.target.checked)} />
            <span className="toggle-label">Show salary to applicants</span>
          </label>
        </div>
      </section>

      {/* Deadline */}
      <section className="form-section">
        <h3 className="section-title">Application Deadline</h3>
        <div className="form-group" style={{maxWidth: '280px'}}>
          <label className="form-label">Deadline (optional)</label>
          <input className="form-input" type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
        </div>
      </section>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? <><span className="spinner" style={{borderTopColor:'white'}}></span> Saving…</> : submitLabel}
        </button>
      </div>
    </form>
  )
}
