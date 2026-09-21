import client, { csrfClient } from './client'
import type {
  Admin,
  AdminSessions,
  ApiResponse,
  Kontak,
  LoginResponse,
  PasswordChangePayload,
  Profil,
  Project,
  Struktur,
} from '../types'

const adminPath = `/digfin-secure-panel`

export const auth = {
  login: async (username: string, password: string) => {
    // Ambil cookie CSRF dulu (GET /sanctum/csrf-cookie). Route Sanctum berada
    // di ROOT (bukan di bawah /api), jadi wajib pakai instance csrfClient —
    // memakai `client` (baseURL /api) akan meminta /api/sanctum/csrf-cookie
    // yang tidak terdaftar → 404.
    await csrfClient.get('/sanctum/csrf-cookie')
    const { data } = await client.post<LoginResponse>('/login', {
      username,
      password,
    })
    return data
  },

  logout: () => client.post('/logout').then((res) => res.data),

  me: () =>
    client.get<ApiResponse<Admin>>('/me').then((res) => res.data.data),
}

export const profil = {
  get: () =>
    client
      .get<ApiResponse<Profil | null>>('/profil')
      .then((res) => res.data.data),
  update: (data: Omit<Profil, 'id'>) =>
    client
      .put<ApiResponse<Profil>>(`${adminPath}/profil`, data)
      .then((res) => res.data),
}

export const struktur = {
  get: () =>
    client
      .get<ApiResponse<Struktur[]>>('/struktur')
      .then((res) => res.data.data),
  create: (data: FormData) =>
    client
      .post<ApiResponse<Struktur>>(`${adminPath}/struktur`, data)
      .then((res) => res.data),
  update: (id: number, data: FormData) =>
    client
      .put<ApiResponse<Struktur>>(`${adminPath}/struktur/${id}`, data)
      .then((res) => res.data),
  remove: (id: number) =>
    client.delete(`${adminPath}/struktur/${id}`).then((res) => res.data),
}

export const project = {
  get: () =>
    client
      .get<ApiResponse<Project[]>>('/project')
      .then((res) => res.data.data),
  create: (data: FormData) =>
    client
      .post<ApiResponse<Project>>(`${adminPath}/project`, data)
      .then((res) => res.data),
  update: (id: number, data: FormData) =>
    client
      .put<ApiResponse<Project>>(`${adminPath}/project/${id}`, data)
      .then((res) => res.data),
  remove: (id: number) =>
    client.delete(`${adminPath}/project/${id}`).then((res) => res.data),
}

export const kontak = {
  get: () =>
    client.get<ApiResponse<Kontak | null>>('/kontak').then((res) => res.data.data),
  create: (data: { email: string }) =>
    client
      .post<ApiResponse<Kontak>>(`${adminPath}/kontak`, data)
      .then((res) => res.data),
  update: (id: number, data: { email: string }) =>
    client
      .put<ApiResponse<Kontak>>(`${adminPath}/kontak/${id}`, data)
      .then((res) => res.data),
}

export const password = {
  change: (payload: PasswordChangePayload) =>
    client
      .put(`${adminPath}/password`, payload)
      .then((res) => res.data.data as { message: string }),
}

export const devices = {
  list: () =>
    client
      .get<ApiResponse<AdminSessions[]>>(`${adminPath}/devices`)
      .then((res) => res.data.data),
  revoke: (id: number) =>
    client
      .post(`${adminPath}/devices/${id}/revoke`)
      .then((res) => res.data),
  revokeAll: () =>
    client
      .post(`${adminPath}/devices/revoke-all`)
      .then((res) => res.data),
}
