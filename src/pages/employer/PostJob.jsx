import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { jobsAPI } from '../../api'
import { useToast } from '../../context/ToastContext'
import { extractError } from '../../utils/helpers'
import JobForm from '../../components/jobs/JobForm'
import './PostJob.css'

export function PostJob() {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await jobsAPI.create(data)
      toast.success('Job posted successfully!')
      navigate(`/jobs/${res.data.id}`)
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-job-page">
      <div className="container-sm">
        <div className="post-job-header">
          <h1 className="page-title">Post a New Job</h1>
          <p className="page-sub">Fill in the details below to attract the best candidates</p>
        </div>
        <JobForm onSubmit={handleSubmit} loading={loading} submitLabel="Post Job" />
      </div>
    </div>
  )
}

export function EditJob() {
  const { id } = useParams()
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    jobsAPI.getById(id)
      .then(r => setInitial(r.data))
      .catch(() => navigate('/employer/jobs'))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await jobsAPI.update(id, data)
      toast.success('Job updated successfully!')
      navigate('/employer/jobs')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div style={{textAlign:'center', padding:'80px'}}>
      <div className="spinner" style={{margin:'0 auto', width:40, height:40}}></div>
    </div>
  )

  return (
    <div className="post-job-page">
      <div className="container-sm">
        <div className="post-job-header">
          <h1 className="page-title">Edit Job</h1>
          <p className="page-sub">Update the job details below</p>
        </div>
        {initial && <JobForm initial={initial} onSubmit={handleSubmit} loading={loading} submitLabel="Save Changes" />}
      </div>
    </div>
  )
}
