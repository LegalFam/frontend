import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { normalizeApiError } from '@/utils/apiError'

const PENDING_AUTH_REDIRECT_KEY = 'legalfam-pending-auth-redirect'

export const setPendingAuthRedirect = (path) => {
  if (typeof window === 'undefined' || !path?.startsWith('/')) return
  window.sessionStorage.setItem(PENDING_AUTH_REDIRECT_KEY, path)
}

const consumePendingAuthRedirect = () => {
  if (typeof window === 'undefined') return null
  const path = window.sessionStorage.getItem(PENDING_AUTH_REDIRECT_KEY)
  window.sessionStorage.removeItem(PENDING_AUTH_REDIRECT_KEY)
  return path?.startsWith('/') ? path : null
}

export function useAuth() {
  const navigate = useNavigate()
  const { login, logout, user, accessToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Signup no longer establishes a session: the account stays unverified until the
  // emailed link is opened, so the caller shows a "check your inbox" state instead.
  const signup = async ({ nombre, apellido, email, phone, password }) => {
    setLoading(true)
    setError(null)
    try {
      const name = `${nombre} ${apellido}`.trim()
      await authService.signup({ email, password, name, phone })
      return { success: true, email }
    } catch (e) {
      const { code, message } = normalizeApiError(e, 'Error al crear cuenta.')
      setError(message)
      return { success: false, code, message }
    } finally {
      setLoading(false)
    }
  }

  const signin = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authService.login({ email, password })
      login(data, data.user || { name: email.split('@')[0], email })
      navigate(consumePendingAuthRedirect() || '/chat')
      return { success: true }
    } catch (e) {
      const { code, message } = normalizeApiError(e, 'Error al iniciar sesión.')
      setError(message)
      return { success: false, code, message }
    } finally {
      setLoading(false)
    }
  }

  const signout = () => {
    logout()
    navigate('/')
  }

  return { signup, signin, signout, loading, error, user, isAuthenticated: !!accessToken }
}
