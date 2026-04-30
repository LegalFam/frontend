import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── REQUEST interceptor: attach access token ──
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── RESPONSE interceptor: auto-refresh on 401 ──
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return api(original)
          })
          .catch((err) => Promise.reject(err))
      }
      original._retry = true
      isRefreshing = true
      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
        processQueue(null, data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch (err) {
        processQueue(err, null)
        useAuthStore.getState().logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// ── AUTH ──
export const authService = {
  signup: (payload) => api.post('/auth/signup', payload),
  login:  (payload) => api.post('/auth/login', payload),
}

// ── CHAT ──
export const chatService = {
  sendMessage:  (payload)   => api.post('/chat', payload),
  getSessions:  ()          => api.get('/chat/sessions'),
  getMessages:  (sessionId) => api.get(`/chat/sessions/${sessionId}/messages`),
  rateMessage:  (messageId, rating) => api.patch(`/chat/messages/${messageId}/rating`, { rating }),
}

export default api
