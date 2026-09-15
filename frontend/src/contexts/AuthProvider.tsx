import { useEffect, useState, type ReactNode } from 'react'
import { auth } from '../api'
import type { Admin } from '../types'
import { AuthContext } from './AuthContext'

const TOKEN_KEY = 'digifin_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      queueMicrotask(() => setLoading(false))
      return
    }

    auth
      .me()
      .then((res) => setAdmin(res.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const login = async (username: string, password: string) => {
    const res = await auth.login(username, password)

    localStorage.setItem(TOKEN_KEY, res.token)
    setAdmin(res.admin)
  }

  const logout = async () => {
    try {
      await auth.logout()
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setAdmin(null)
    }
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}