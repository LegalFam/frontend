import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '@/services/api'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'

export function useChat() {
  const navigate = useNavigate()
  const store    = useChatStore()
  const user     = useAuthStore((s) => s.user)

  const loadSessions = useCallback(async () => {
    // TODO: conectar con backend
    // try {
    //   const { data } = await chatService.getSessions()
    //   store.setSessions(data)
    // } catch (e) {
    //   console.warn('Could not load sessions', e)
    // }
    store.setSessions([])
  }, [])

  const loadMessages = useCallback(async (sessionId) => {
    if (store.messages[sessionId]) return // already cached
    // TODO: conectar con backend
    // try {
    //   const { data } = await chatService.getMessages(sessionId)
    //   store.setMessages(sessionId, data)
    // } catch (e) {
    //   console.warn('Could not load messages', e)
    // }
  }, [store.messages])

  const selectSession = useCallback(async (sessionId) => {
    store.setActiveSession(sessionId)
    await loadMessages(sessionId)
  }, [loadMessages])

  const startNewChat = useCallback(() => {
    store.setActiveSession(null)
    // Add welcome message under key 'new'
    const welcome = {
      id: 'welcome',
      role: 'ASSISTANT',
      content: `¡Hola, <strong>${user?.name?.split(' ')[0] || 'Usuario'}</strong>! Bienvenido/a a <strong>LegalFam</strong>.<br/><br/>Estoy aquí para orientarte en temas de <strong>Derecho de Familia</strong> peruano: alimentos, tenencia, filiación y medidas de protección.<br/><br/>¿Sobre qué situación legal deseas consultar hoy?`,
      citations: [],
      createdAt: new Date().toISOString(),
    }
    store.setMessages('new', [welcome])
  }, [user])

  const sendMessage = useCallback(async (text) => {
    const sessionId = store.activeSessionId
    const key = sessionId || 'new'

    // Optimistic user message
    const userMsg = {
      id: `tmp_${Date.now()}`,
      role: 'USER',
      content: text,
      citations: [],
      createdAt: new Date().toISOString(),
    }
    store.addMessage(key, userMsg)
    store.setLoading(true)

    try {
      // TODO: conectar con backend
      // const payload = { message: text }
      // if (sessionId) payload.sessionId = sessionId
      // const { data } = await chatService.sendMessage(payload)
      // if (!sessionId) {
      //   const newSession = {
      //     id: data.sessionId,
      //     name: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //   }
      //   store.addSession(newSession)
      //   store.setActiveSession(data.sessionId)
      //   const existing = useChatStore.getState().messages['new'] || []
      //   store.setMessages(data.sessionId, existing)
      // }
      // const botMsg = { id: data.messageId, role: 'ASSISTANT', content: data.message, citations: data.citations || [], createdAt: new Date().toISOString() }
      // store.addMessage(data.sessionId || sessionId, botMsg)

      // Respuesta simulada mientras no hay backend
      const mockSessionId = sessionId || `session_${Date.now()}`
      if (!sessionId) {
        const newSession = {
          id: mockSessionId,
          name: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        store.addSession(newSession)
        store.setActiveSession(mockSessionId)
        const existing = useChatStore.getState().messages['new'] || []
        store.setMessages(mockSessionId, existing)
      }
      const botMsg = {
        id: `mock_${Date.now()}`,
        role: 'ASSISTANT',
        content: 'Esta es una respuesta simulada. Cuando el backend esté disponible, aquí aparecerá la respuesta real.',
        citations: [],
        createdAt: new Date().toISOString(),
      }
      store.addMessage(mockSessionId, botMsg)
    } catch (e) {
      const errMsg = {
        id: `err_${Date.now()}`,
        role: 'ASSISTANT',
        content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor intenta de nuevo.',
        citations: [],
        createdAt: new Date().toISOString(),
        isError: true,
      }
      store.addMessage(key, errMsg)
    } finally {
      store.setLoading(false)
    }
  }, [store])

  const rateMessage = useCallback(async (messageId, rating) => {
    const sessionId = store.activeSessionId
    if (!sessionId || !messageId) return
    // TODO: conectar con backend
    // try {
    //   await chatService.rateMessage(messageId, rating)
    // } catch (e) {
    //   console.warn('Rating failed', e)
    // }
    store.updateMessageRating(sessionId, messageId, rating)
  }, [store.activeSessionId])

  const deleteSession = useCallback((sessionId) => {
    store.removeSession(sessionId)
    if (store.activeSessionId === sessionId) startNewChat()
  }, [store, startNewChat])

  const renameSession = useCallback((sessionId, name) => {
    store.updateSessionName(sessionId, name)
  }, [])

  return {
    sessions:        store.sessions,
    activeSessionId: store.activeSessionId,
    messages:        store.messages,
    loading:         store.loading,
    loadSessions,
    selectSession,
    startNewChat,
    sendMessage,
    rateMessage,
    deleteSession,
    renameSession,
  }
}
