import { createContext } from 'react'
import type { Admin } from '../types'

export interface AuthContextValue {
  admin: Admin | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)