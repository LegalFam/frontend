import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService, getApiBaseUrl, paymentService } from '@/services/api'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'

const BACKOFF_MS = [1000, 2000, 5000, 10000, 30000]

const titleFromText = (text) =>
  text.slice(0, 40) + (text.length > 40 ? '...' : '')

const welcomeMessage = (name) => ({
  id: 'welcome',
  role: 'ASSISTANT',
  content: `Hola, <strong>${name || 'Usuario'}</strong>. Bienvenido/a a <strong>LegalFam</strong>.<br/><br/>Estoy aqui para orientarte en temas de <strong>Derecho de Familia</strong> peruano: alimentos, tenencia, filiacion y medidas de proteccion.<br/><br/>Sobre que situacion legal deseas consultar hoy?`,
  citations: [],
  createdAt: new Date().toISOString(),
})

const apiStreamUrl = (path) => {
  const base = getApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (/^https?:\/\//i.test(base)) return `${base}${normalizedPath}`
  return `${base}${normalizedPath}`
}

const parseSseChunk = (chunk) => {
  const event = { type: 'message', data: '' }
  chunk.split(/\r?\n/).forEach((line) => {
    if (line.startsWith('event:')) event.type = line.slice(6).trim()
    if (line.startsWith('data:')) event.data += line.slice(5).trim()
  })
  return event
}

export function useChat() {
  const navigate = useNavigate()
  const store = useChatStore()
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const logout = useAuthStore((s) => s.logout)
  const abortRef = useRef(null)
  const retryRef = useRef(0)
  const timerRef = useRef(null)
  const sendingTextRef = useRef(null)
  const messagesRequestRef = useRef(new Map())

  const reconcileMessages = useCallback(async (sessionId) => {
    if (!sessionId) return []
    if (messagesRequestRef.current.has(sessionId)) {
      return messagesRequestRef.current.get(sessionId)
    }

    const request = chatService.getMessages(sessionId)
      .then(({ data }) => {
        const messages = Array.isArray(data) ? data : []
        store.setMessages(sessionId, messages)

        const lastUserIndex = messages.map((message) => message.role).lastIndexOf('USER')
        const hasTerminalMessage = messages
          .slice(lastUserIndex + 1)
          .some((message) => message.role === 'ASSISTANT' || message.role === 'SYSTEM')
        if (hasTerminalMessage) store.setLoading(false)
        return messages
      })
      .finally(() => {
        messagesRequestRef.current.delete(sessionId)
      })

    messagesRequestRef.current.set(sessionId, request)
    return request
  }, [store])

  const loadSessions = useCallback(async () => {
    try {
      const { data } = await chatService.getSessions()
      store.setSessions(Array.isArray(data) ? data : [])
    } catch (e) {
      store.setError(e.response?.data?.message || 'No se pudieron cargar las sesiones.')
      if (e.response?.status === 401) navigate('/')
    }
  }, [navigate, store])

  const loadMessages = useCallback(async (sessionId, { force = false } = {}) => {
    if (!sessionId) return
    if (!force && useChatStore.getState().messages[sessionId]) return
    try {
      await reconcileMessages(sessionId)
    } catch (e) {
      if (e.response?.status === 403 || e.response?.status === 404) {
        store.setActiveSession(null)
        navigate('/chat')
        return
      }
      store.setError(e.response?.data?.message || 'No se pudieron cargar los mensajes.')
    }
  }, [navigate, reconcileMessages, store])

  const selectSession = useCallback(async (sessionId) => {
    store.setActiveSession(sessionId)
  }, [store])

  const startNewChat = useCallback(() => {
    store.setActiveSession(null)
    store.setLoading(false)
    store.setError(null)
    store.setMessages('new', [welcomeMessage(user?.name?.split(' ')[0])])
  }, [store, user])

  const ensureSession = useCallback(async (initialText) => {
    const currentSessionId = useChatStore.getState().activeSessionId
    if (currentSessionId) return currentSessionId

    const { data } = await chatService.createSession()
    const session = {
      ...data,
      name: titleFromText(initialText),
    }
    store.addSession(session)
    store.setActiveSession(data.id)
    store.moveMessages('new', data.id)
    return data.id
  }, [store])

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || sendingTextRef.current === trimmed) return

    sendingTextRef.current = trimmed
    store.setError(null)

    const tempId = `tmp_${Date.now()}`
    let sessionId = useChatStore.getState().activeSessionId

    try {
      sessionId = await ensureSession(trimmed)
      const userMsg = {
        id: tempId,
        role: 'USER',
        content: trimmed,
        citations: [],
        createdAt: new Date().toISOString(),
        state: 'sending',
      }
      store.addMessage(sessionId, userMsg)
      store.setLoading(true)

      const { data } = await chatService.sendMessage({ message: trimmed, sessionId })
      store.replaceMessage(sessionId, tempId, {
        id: data.userMessageId,
        state: 'processing',
      })
      paymentService.getSubscription().catch(() => {})
    } catch (e) {
      const status = e.response?.status

      if (!status) {
        store.replaceMessage(sessionId || 'new', tempId, { state: 'unknown_delivery' })
        store.setError('Conexion interrumpida. Estamos verificando el estado de la conversacion.')
        if (sessionId) await loadMessages(sessionId, { force: true })
        return
      }

      store.setLoading(false)

      if (status === 403) {
        store.setError(e.response?.data?.message || 'No tienes tokens disponibles o la sesion no esta activa.')
        paymentService.getSubscription().catch(() => {})
        return
      }

      store.addMessage(sessionId || 'new', {
        id: `err_${Date.now()}`,
        role: 'SYSTEM',
        content: e.response?.data?.message || 'No se pudo enviar tu consulta. Intenta nuevamente.',
        citations: [],
        createdAt: new Date().toISOString(),
        isError: true,
      })
    } finally {
      sendingTextRef.current = null
    }
  }, [ensureSession, loadMessages, store])

  const rateMessage = useCallback(async (messageId, rating) => {
    const sessionId = useChatStore.getState().activeSessionId
    if (!sessionId || !messageId) return
    store.updateMessageRating(sessionId, messageId, rating)
    try {
      await chatService.rateMessage(messageId, rating)
    } catch (e) {
      await loadMessages(sessionId, { force: true })
      store.setError(e.response?.data?.message || 'No se pudo guardar la calificacion.')
    }
  }, [loadMessages, store])

  const deleteSession = useCallback((sessionId) => {
    store.removeSession(sessionId)
    if (useChatStore.getState().activeSessionId === sessionId) startNewChat()
  }, [startNewChat, store])

  const renameSession = useCallback((sessionId, name) => {
    store.updateSessionName(sessionId, name)
  }, [store])

  useEffect(() => {
    const sessionId = store.activeSessionId
    if (!sessionId || !accessToken) return undefined

    let disposed = false

    const stop = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      abortRef.current?.abort()
      timerRef.current = null
      abortRef.current = null
    }

    const connect = async () => {
      stop()
      const controller = new AbortController()
      abortRef.current = controller
      store.setConnectionState('reconnecting')

      try {
        await loadMessages(sessionId, { force: true })
        const response = await fetch(apiStreamUrl(`/chat/subscribe/${sessionId}`), {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        })

        if (response.status === 401) {
          logout()
          navigate('/')
          return
        }
        if (response.status === 403 || response.status === 404) {
          store.setActiveSession(null)
          navigate('/chat')
          return
        }
        if (!response.ok || !response.body) throw new Error('SSE connection failed')

        store.setConnectionState('connected')
        retryRef.current = 0

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!disposed) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const chunks = buffer.split(/\r?\n\r?\n/)
          buffer = chunks.pop() || ''

          for (const chunk of chunks) {
            const event = parseSseChunk(chunk)
            if (event.type === 'assistant_message' || event.type === 'assistant_error') {
              await loadMessages(sessionId, { force: true })
              if (event.type === 'assistant_error') {
                store.setLoading(false)
                paymentService.getSubscription().catch(() => {})
              }
            }
          }
        }

        throw new Error('SSE disconnected')
      } catch (e) {
        if (disposed || controller.signal.aborted) return
        store.setConnectionState('reconnecting')
        const delay = BACKOFF_MS[Math.min(retryRef.current, BACKOFF_MS.length - 1)]
        retryRef.current += 1
        timerRef.current = window.setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      disposed = true
      stop()
    }
    // The SSE lifecycle must only restart when the active session or token changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, store.activeSessionId])

  return {
    sessions:        store.sessions,
    activeSessionId: store.activeSessionId,
    messages:        store.messages,
    loading:         store.loading,
    connectionState: store.connectionState,
    error:           store.error,
    loadSessions,
    selectSession,
    startNewChat,
    sendMessage,
    rateMessage,
    deleteSession,
    renameSession,
  }
}
