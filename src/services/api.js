import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

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

export const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) {
    useAuthStore.getState().logout()
    throw new Error('Refresh token is missing')
  }

  isRefreshing = true
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
    if (data.user) useAuthStore.getState().setUser(data.user)
    processQueue(null, data.accessToken)
    return data.accessToken
  } catch (err) {
    processQueue(err, null)
    useAuthStore.getState().logout()
    throw err
  } finally {
    isRefreshing = false
  }
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
    try {
      const token = await refreshAccessToken()
      original.headers.Authorization = `Bearer ${token}`
      return api(original)
    } catch (err) {
      return Promise.reject(err)
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
  getMessages: (sessionId, config = {}) => api.get(`/chat/sessions/${sessionId}/messages`, config),
  updateSession: (sessionId, payload) => api.patch(`/chat/sessions/${sessionId}`, payload),
  deleteSession: (sessionId) => api.delete(`/chat/sessions/${sessionId}`),
  rateMessage: (messageId, rating, comment = '') =>
    api.patch(`/chat/messages/${messageId}/rating`, { rating, comment }),
  confirmReceipt: (messageId) => api.patch(`/chat/messages/${messageId}/receipt`),
}

export const paymentService = {
  getPlans: () => api.get('/payments/plans'),
  getSubscription: () => api.get('/payments/subscription'),
  createCheckoutSession: (payload) => api.post('/payments/checkout-sessions', payload),
  cancelSubscription: () => api.post('/payments/subscription/cancel'),
}

export const getApiBaseUrl = () => BASE_URL

export default api
