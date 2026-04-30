import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const navigate = useNavigate()
  const { login, logout, user, accessToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const signup = async ({ nombre, apellido, email, phone, password }) => {
    setLoading(true)
    setError(null)
    try {
      // TODO: conectar con backend
      // const { data } = await authService.signup({
      //   email,
      //   password,
      //   name: `${nombre} ${apellido}`.trim(),
      //   phone,
      // })
      // login(data, { name: `${nombre} ${apellido}`.trim(), email })

      // Respuesta simulada mientras no hay backend
      const mockData = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }
      login(mockData, { name: `${nombre} ${apellido}`.trim(), email })
      navigate('/chat')
      return { success: true }
    } catch (e) {
      const status = e.response?.status
      const msg = status === 409
        ? 'Este correo ya está registrado.'
        : e.response?.data?.message || 'Error al crear cuenta.'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  const signin = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      // TODO: conectar con backend
      // const { data } = await authService.login({ email, password })
      // login(data, { name: email.split('@')[0], email })

      // Respuesta simulada mientras no hay backend
      const mockData = { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }
      login(mockData, { name: email.split('@')[0], email })
      navigate('/chat')
      return { success: true }
    } catch (e) {
      const msg = e.response?.status === 401
        ? 'Correo o contraseña incorrectos.'
        : e.response?.data?.message || 'Error al iniciar sesión.'
      setError(msg)
      return { success: false, message: msg }
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
