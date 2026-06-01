import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((request) => {
    if (error) request.reject(error)
    else request.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const shouldRefresh =
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes('/auth/refresh')

    if (!shouldRefresh) return Promise.reject(error)

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
)

export const authService = {
  signup: (payload) => api.post('/auth/signup', payload),
  login: (payload) => api.post('/auth/login', payload),
}

export const chatService = {
  createSession: () => api.post('/chat/sessions'),
  sendMessage: (payload) => api.post('/chat/send', payload),
  getSessions: () => api.get('/chat/sessions'),
  getMessages: (sessionId) => api.get(`/chat/sessions/${sessionId}/messages`),
  rateMessage: (messageId, rating) =>
    api.patch(`/chat/messages/${messageId}/rating`, { rating }),
}

export const paymentService = {
  getPlans: () => api.get('/payments/plans'),
  getSubscription: () => api.get('/payments/subscription'),
  createCheckoutSession: (payload) => api.post('/payments/checkout-sessions', payload),
  cancelSubscription: () => api.post('/payments/subscription/cancel'),
}

export const getApiBaseUrl = () => BASE_URL

export default api
