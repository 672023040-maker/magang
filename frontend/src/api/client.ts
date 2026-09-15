import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('digifin_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default client