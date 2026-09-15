import client from './client'
import type {
  Admin,
  ApiResponse,
  Informasi,
  Kontak,
  LoginResponse,
  PesanKontak,
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

export const informasi = {
  get: () =>
    client
      .get<ApiResponse<Informasi[]>>('/informasi')
      .then((res) => res.data.data),
  create: (data: FormData) =>
    client.post<ApiResponse<Informasi>>('/admin/informasi', data).then((res) => res.data),
  update: (id: number, data: FormData) =>
    client
      .put<ApiResponse<Informasi>>(`/admin/informasi/${id}`, data)
      .then((res) => res.data),
  remove: (id: number) =>
    client.delete(`/admin/informasi/${id}`).then((res) => res.data),
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

export interface SosialMediaPayload {
  platform: string
  url: string
}

export interface KontakPayload {
  email: string
  phone: string
  alamat: string
  sosial_media: SosialMediaPayload[]
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

export const pesanKontak = {
  kirim: (data: {
    nama_pengirim: string
    email: string
    subjek: string
    pesan: string
  }) =>
    client
      .post<ApiResponse<PesanKontak>>('/pesan-kontak', data)
      .then((res) => res.data),
  get: () =>
    client
      .get<ApiResponse<PesanKontak[]>>('/admin/pesan')
      .then((res) => res.data.data),
  remove: (id: number) =>
    client.delete(`/admin/pesan/${id}`).then((res) => res.data),
}