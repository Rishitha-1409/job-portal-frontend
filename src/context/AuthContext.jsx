import React, { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

 const login = useCallback(async (email, password) => {
  setLoading(true)
  try {
    const res = await authAPI.login({ email, password })

    const data = res.data.data
    const token = data.accessToken

    const user = {
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role
    }

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))

    setUser(user)

    return user
  } finally {
    setLoading(false)
  }
}, [])

  const register = useCallback(async (payload) => {
  setLoading(true)
  try {
    const res = await authAPI.register(payload)

    const data = res.data.data
    const token = data.accessToken

    const user = {
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role
    }

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))

    setUser(user)

    return user
  } finally {
    setLoading(false)
  }
}, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isEmployer = user?.role === 'EMPLOYER'
  const isJobSeeker = user?.role === 'JOB_SEEKER'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isEmployer, isJobSeeker }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
