import client from './client'
import type {
  Admin,
  ApiResponse,
  Kontak,
  LoginResponse,
  Profil,
  Project,
  Struktur,
} from '../types'

export const auth = {
  login: (username: string, password: string) =>
    client
      .post<LoginResponse>('/login', { username, password })
      .then((res) => res.data),

  logout: () => client.post('/logout').then((res) => res.data),

  me: () => client.get<ApiResponse<Admin>>('/me').then((res) => res.data),
}

export const profil = {
  get: () =>
    client.get<ApiResponse<Profil | null>>('/profil').then((res) => res.data.data),
  update: (data: Omit<Profil, 'id'>) =>
    client.put<ApiResponse<Profil>>('/admin/profil', data).then((res) => res.data),
}

export const struktur = {
  get: () =>
    client
      .get<ApiResponse<Struktur[]>>('/struktur')
      .then((res) => res.data.data),
  create: (data: FormData) =>
    client.post<ApiResponse<Struktur>>('/admin/struktur', data).then((res) => res.data),
  update: (id: number, data: FormData) =>
    client
      .put<ApiResponse<Struktur>>(`/admin/struktur/${id}`, data)
      .then((res) => res.data),
  remove: (id: number) =>
    client.delete(`/admin/struktur/${id}`).then((res) => res.data),
}

export const project = {
  get: () =>
    client
      .get<ApiResponse<Project[]>>('/project')
      .then((res) => res.data.data),
  create: (data: FormData) =>
    client.post<ApiResponse<Project>>('/admin/project', data).then((res) => res.data),
  update: (id: number, data: FormData) =>
    client
      .put<ApiResponse<Project>>(`/admin/project/${id}`, data)
      .then((res) => res.data),
  remove: (id: number) =>
    client.delete(`/admin/project/${id}`).then((res) => res.data),
}

export interface KontakPayload {
  email: string
}

export const kontak = {
  get: () =>
    client.get<ApiResponse<Kontak | null>>('/kontak').then((res) => res.data.data),
  create: (data: KontakPayload) =>
    client.post<ApiResponse<Kontak>>('/admin/kontak', data).then((res) => res.data),
  update: (id: number, data: KontakPayload) =>
    client
      .put<ApiResponse<Kontak>>(`/admin/kontak/${id}`, data)
      .then((res) => res.data),
  remove: (id: number) =>
    client.delete(`/admin/kontak/${id}`).then((res) => res.data),
}