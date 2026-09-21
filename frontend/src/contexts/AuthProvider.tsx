import { useEffect, useState, type ReactNode } from 'react'
import { auth } from '../api'
import type { Admin } from '../types'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  // Session disimpan backend sebagai cookie HttpOnly. Tidak ada token yang
  // perlu disimpan di localStorage — browser otomatis mengirim cookie session
  // + header X-XSRF-TOKEN (dibaca axios dari cookie XSRF-TOKEN).
  useEffect(() => {
    let mounted = true

    auth
      .me()
      .then((adminData) => {
        if (mounted) setAdmin(adminData)
      })
      .catch(() => {
        // Cookie HttpOnly kosong / session kedaluwarsa — admin tetap null.
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const login = async (username: string, password: string) => {
    const res = await auth.login(username, password)

    setAdmin(res.admin)

    return res.admin
  }

  const refresh = async () => {
    const adminData = await auth.me()

    setAdmin(adminData)

    return adminData
  }

  const logout = async () => {
    try {
      await auth.logout()
    } finally {
      setAdmin(null)
    }
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
