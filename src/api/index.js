import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ---- Auth ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// ---- Jobs ----
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getEmployerJobs: (params) => api.get('/jobs/employer', { params }),
}

// ---- Applications ----
export const applicationsAPI = {
  apply: (jobId, data) => api.post(`/applications/${jobId}`, data),
  getMy: (params) => api.get('/applications/my', { params }),
  getForJob: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  getForJobByStatus: (jobId, status, params) =>
    api.get(`/applications/job/${jobId}/status`, { params: { status, ...params } }),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status, notes) =>
    api.patch(`/applications/${id}/status`, { status, notes }),
  withdraw: (id) => api.delete(`/applications/${id}`),
}
// ---- Admin ----
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  getJobById: (id) => api.get(`/admin/jobs/${id}`),
  updateJobStatus: (id, status) => api.patch(`/admin/jobs/${id}/status`, { status }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
}

export default api
