import axios from 'axios'
import { getAuth } from './auth'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const { token } = getAuth()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function setTokenHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export function loginUser(email: string, password: string) {
  return api.post('/api/auth/login-user', { email, password })
}

export function loginAdmin(email: string, password: string) {
  return api.post('/api/auth/login-admin', { email, password })
}

export function registerUser(name: string, email: string, password: string) {
  return api.post('/api/auth/register', { name, email, password })
}

export function fetchMe() {
  return api.get('/api/me')
}

export function fetchPublishers(params?: any) {
  return api.get('/api/user/publishers', { params })
}

export function fetchBooks(params?: any) {
  return api.get('/api/user/books', { params })
}

export function fetchLoans(params?: any) {
  return api.get('/api/user/loans', { params })
}

export function createBorrow(payload: { isbn: string; tanggal_pinjam: string; tanggal_kembali: string }) {
  return api.post('/api/user/borrow', payload)
}

export function adminListPenerbit(params?: any) {
  return api.get('/api/penerbit', { params })
}

export function adminGetPenerbit(id: number) {
  return api.get(`/api/penerbit/${id}`)
}

export function adminCreatePenerbit(payload: any) {
  return api.post('/api/penerbit', payload)
}

export function adminUpdatePenerbit(id: number, payload: any) {
  return api.put(`/api/penerbit/${id}`, payload)
}

export function adminDeletePenerbit(id: number) {
  return api.delete(`/api/penerbit/${id}`)
}

export function adminListBuku(params?: any) {
  return api.get('/api/buku', { params })
}

export function adminGetBuku(isbn: string) {
  return api.get(`/api/buku/${isbn}`)
}

export function adminCreateBuku(payload: any) {
  return api.post('/api/buku', payload)
}

export function adminUpdateBuku(isbn: string, payload: any) {
  return api.put(`/api/buku/${isbn}`, payload)
}

export function adminDeleteBuku(isbn: string) {
  return api.delete(`/api/buku/${isbn}`)
}

export function adminListPembaca(params?: any) {
  return api.get('/api/pembaca', { params })
}

export function adminGetPembaca(id: number) {
  return api.get(`/api/pembaca/${id}`)
}

export function adminCreatePembaca(payload: any) {
  return api.post('/api/pembaca', payload)
}

export function adminUpdatePembaca(id: number, payload: any) {
  return api.put(`/api/pembaca/${id}`, payload)
}

export function adminDeletePembaca(id: number) {
  return api.delete(`/api/pembaca/${id}`)
}

export function adminListPeminjaman(params?: any) {
  return api.get('/api/peminjaman', { params })
}

export function adminGetPeminjaman(id: number) {
  return api.get(`/api/peminjaman/${id}`)
}

export function adminCreatePeminjaman(payload: any) {
  return api.post('/api/peminjaman', payload)
}

export function adminUpdatePeminjaman(id: number, payload: any) {
  return api.put(`/api/peminjaman/${id}`, payload)
}

export function adminDeletePeminjaman(id: number) {
  return api.delete(`/api/peminjaman/${id}`)
}
