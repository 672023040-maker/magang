export interface Profil {
  id: number
  visi: string
  misi: string
  tujuan: string
  visi_bulat: boolean
  misi_bulat: boolean
  tujuan_bulat: boolean
}

export interface Struktur {
  id: number
  nama: string
  jabatan: string
  email: string | null
  foto_url: string | null
}

export interface Dokumentasi {
  id: number
  project_id: number
  file_gambar_url: string | null
}

export type StatusProject = 'publish' | 'unpublish'

export interface Project {
  id: number
  nama_project: string
  deskripsi: string
  status: StatusProject
  tgl_dibuat: string | null
  author: Struktur | null
  dokumentasi: Dokumentasi[]
}

export interface Kontak {
  id: number
  email: string
}

export interface Admin {
  id: number
  username: string
  nama: string
  must_change_password: boolean
}

export interface LoginResponse {
  message: string
  admin: Admin
}

export interface AdminSessions {
  id: number
  current: boolean
  ip_address: string | null
  user_agent: string | null
  last_active_at: string | null
  login_at: string | null
  expires_at: string | null
  revoked_at: string | null
}

export interface PasswordChangePayload {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface ApiResponse<T> {
  message?: string
  data: T
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export interface Paginated<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: PaginationMeta
}