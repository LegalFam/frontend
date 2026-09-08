import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService, getApiBaseUrl, refreshAccessToken } from '@/services/api'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { usePaymentStore } from '@/store/paymentStore'
import { normalizeApiError, normalizeAssistantErrorMessage } from '@/utils/apiError'
import { t } from '@/i18n/translate'
import { useLanguageStore } from '@/store/languageStore'

const BACKOFF_MS = [1000, 2000, 5000, 10000, 30000]

const titleFromText = (text) =>
  text.slice(0, 40) + (text.length > 40 ? '...' : '')

// Guarda la clave y no el texto: así la bienvenida sigue al idioma que esté activo en cada
// momento, y no al que hubiera al abrir el chat. Lo mismo vale para los avisos de sistema de
// más abajo. El idioma de un mensaje ya enviado, en cambio, es inmutable: vive en el servidor.
const welcomeMessage = (name) => ({
  id: 'welcome',
  role: 'ASSISTANT',
  messageKey: 'chat.bienvenida',
  messageVars: { nombre: name || t('chat.usuario') },
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

const parseSseData = (data) => {
  if (!data || data === 'connected' || data === 'ping') return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

const sseEventToMessage = (event) => {
  const data = parseSseData(event.data)
  if (!data?.messageId) return null

  if (event.type === 'assistant_message') {
    return {
      id: data.messageId,
      role: 'ASSISTANT',
      // `content` es siempre el español canónico; `contentLocalized` es lo que el usuario
      // lee cuando su idioma no es el español. El español no se descarta: es la versión
      // que prevalece y la que el conmutador "Ver en español" muestra.
      content: data.message || '',
      language: data.language || 'es',
      contentLocalized: data.messageLocalized || null,
      citations: data.citations || [],
      createdAt: data.createdAt || new Date().toISOString(),
      confidenceStatus: data.confidenceStatus,
      confidenceReason: data.confidenceReason,
      nextSteps: data.nextSteps,
      nextStepsLocalized: data.nextStepsLocalized,
      specialistSupportRecommended: data.specialistSupportRecommended,
      citationSupportStatus: data.citationSupportStatus,
      receiptStatus: data.receiptStatus,
    }
  }

  if (event.type === 'assistant_error') {
    const errorCode = data.errorCode || data.code
    return {
      id: data.messageId,
      role: 'SYSTEM',
      content: normalizeAssistantErrorMessage(errorCode, data.errorMessage),
      errorCode,
      citations: [],
      createdAt: data.createdAt || new Date().toISOString(),
      isError: true,
    }
  }

  return null
}

const isCanceledRequest = (error) =>
  error?.name === 'CanceledError' ||
  error?.code === 'ERR_CANCELED' ||
  error?.name === 'AbortError'

const cursorContent = (data) => {
  if (Array.isArray(data)) return data.map(normalizeChatMessage)
  if (Array.isArray(data?.content)) return data.content.map(normalizeChatMessage)
  return []
}

const normalizeChatMessage = (message) => {
  if (!message || typeof message !== 'object') return message
  if (message.role !== 'SYSTEM' && !message.errorCode) return message

  return {
    ...message,
    content: normalizeAssistantErrorMessage(message.errorCode, message.content),
    isError: message.isError || message.role === 'SYSTEM',
  }
}

const cursorNext = (data) =>
  data && typeof data === 'object' && !Array.isArray(data) ? data.nextCursor || null : null

const preserveOptimisticMessages = (sessionId, serverMessages) => {
  const current = useChatStore.getState().messages[sessionId] || []
  const serverIds = new Set(serverMessages.map((message) => message.id).filter(Boolean))
  const optimistic = current.filter((message) =>
    message.id?.startsWith('tmp_') ||
    message.state === 'sending' ||
    message.state === 'processing' ||
    message.state === 'unknown_delivery'
  ).filter((message) => !serverIds.has(message.id))

  return optimistic.length ? [...serverMessages, ...optimistic] : serverMessages
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
  const messagesAbortRef = useRef(null)
  const receiptRequestRef = useRef(new Map())
  const reconcileRef = useRef(null)

  // Sesión cuyo emisor SSE está registrado en el servidor ahora mismo. El backend crea el
  // emisor y manda `connected` de forma síncrona al atender /chat/subscribe, así que haber
  // recibido la cabecera de esa respuesta garantiza que ya hay a quién despachar.
  const openStreamRef = useRef(null)

  // Un envío que se adelanta a la suscripción se queda sin red: si el agente falla al
  // instante, el backend despacha el error sin emisor y lo descarta sin reintento, a
  // diferencia de la respuesta del asistente, que sí pasa por el outbox. Esperar aquí unos
  // segundos cuesta nada en el caso normal (la suscripción tarda milisegundos) y evita el
  // agujero en el estreno de un chat nuevo, que es cuando la carrera se pierde siempre.
  const waitForOpenStream = useCallback(async (sessionId, timeoutMs = 5000) => {
    if (!sessionId) return
    const deadline = Date.now() + timeoutMs
    while (openStreamRef.current !== sessionId && Date.now() < deadline) {
      await new Promise((resolve) => window.setTimeout(resolve, 50))
    }
  }, [])

  const loadProcessingStatus = useCallback(async () => {
    try {
      const { data } = await chatService.getProcessingStatus()
      useChatStore.getState().setProcessingStatus(data)
      return data
    } catch (e) {
      if (e.response?.status === 401) return null
      throw e
    }
  }, [])

  const confirmUnreadAssistantReceipts = useCallback(async (sessionId, messages) => {
    const unreadAssistantMessages = messages.filter((message) =>
      message.role === 'ASSISTANT' &&
      message.id &&
      message.id !== 'welcome' &&
      message.receiptStatus &&
      message.receiptStatus !== 'READ'
    )

    if (!unreadAssistantMessages.length) return

    const results = await Promise.allSettled(unreadAssistantMessages.map((message) => {
      const existingRequest = receiptRequestRef.current.get(message.id)
      if (existingRequest) return existingRequest

      const request = chatService.confirmReceipt(message.id)
        .then(() => {
          useChatStore.getState().upsertMessage(sessionId, {
            ...message,
            receiptStatus: 'READ',
            readAt: new Date().toISOString(),
          })
        })
        .catch((e) => {
          receiptRequestRef.current.delete(message.id)
          throw e
        })

      receiptRequestRef.current.set(message.id, request)
      return request
    }))

    const failed = results.find((result) => result.status === 'rejected')
    if (failed) throw failed.reason
  }, [])

  const reconcileMessages = useCallback(async (sessionId, { signal } = {}) => {
    if (!sessionId) return []
    if (messagesRequestRef.current.has(sessionId)) {
      return messagesRequestRef.current.get(sessionId)
    }

    const request = chatService.getMessages(sessionId, { signal })
      .then(({ data }) => {
        const messages = cursorContent(data)
        if (signal?.aborted || useChatStore.getState().activeSessionId !== sessionId) {
          return messages
        }
        const nextMessages = preserveOptimisticMessages(sessionId, messages)
        const hasLoadedMessages = Boolean(useChatStore.getState().messages[sessionId]?.length)
        store.setMessagesPage(
          sessionId,
          nextMessages,
          cursorNext(data),
          hasLoadedMessages ? 'merge' : 'replace'
        )
        confirmUnreadAssistantReceipts(sessionId, nextMessages).catch(() => {})

        const lastUserIndex = nextMessages.map((message) => message.role).lastIndexOf('USER')
        const hasTerminalMessage = nextMessages
          .slice(lastUserIndex + 1)
          .some((message) => message.role === 'ASSISTANT' || message.role === 'SYSTEM')
        if (hasTerminalMessage) {
          store.clearPendingUserMessageStates(sessionId)
          store.setProcessingStatus({ processing: false })
          store.setLoading(false)
          usePaymentStore.getState().loadSubscription().catch(() => {})
        }
        return nextMessages
      })
      .finally(() => {
        messagesRequestRef.current.delete(sessionId)
      })

    messagesRequestRef.current.set(sessionId, request)
    return request
  }, [confirmUnreadAssistantReceipts, store])

  // El vigilante de abajo no puede depender de reconcileMessages: su identidad cambia con
  // cada actualización del store y reiniciaría el intervalo en bucle.
  reconcileRef.current = reconcileMessages

  const loadSessions = useCallback(async () => {
    store.setSessionsLoading(true)
    try {
      const { data } = await chatService.getSessions()
      store.setSessionsPage(cursorContent(data), cursorNext(data))
    } catch (e) {
      store.setError(normalizeApiError(e, t('chat.errorSesiones')).message)
      if (e.response?.status === 401) navigate('/')
    } finally {
      store.setSessionsLoading(false)
    }
  }, [navigate, store])

  const loadMoreSessions = useCallback(async () => {
    const cursor = useChatStore.getState().sessionsNextCursor
    if (!cursor || useChatStore.getState().sessionsLoadingMore) return

    store.setSessionsLoadingMore(true)
    try {
      const { data } = await chatService.getSessions({ params: { cursor } })
      store.setSessionsPage(cursorContent(data), cursorNext(data), true)
    } catch (e) {
      store.setError(normalizeApiError(e, t('chat.errorMasSesiones')).message)
    } finally {
      store.setSessionsLoadingMore(false)
    }
  }, [store])

  const loadMessages = useCallback(async (sessionId, { force = false } = {}) => {
    if (!sessionId) return
    if (!force && useChatStore.getState().messages[sessionId]) return
    if (messagesAbortRef.current) {
      messagesAbortRef.current.controller.abort()
      messagesRequestRef.current.delete(messagesAbortRef.current.sessionId)
    }

    const controller = new AbortController()
    messagesAbortRef.current = { sessionId, controller }

    try {
      await reconcileMessages(sessionId, { signal: controller.signal })
    } catch (e) {
      if (isCanceledRequest(e)) return
      if (e.response?.status === 403 || e.response?.status === 404) {
        store.setActiveSession(null)
        navigate('/chat', { replace: true })
        return
      }
      store.setError(normalizeApiError(e, t('chat.errorMensajes')).message)
    } finally {
      if (messagesAbortRef.current?.controller === controller) {
        messagesAbortRef.current = null
      }
    }
  }, [navigate, reconcileMessages, store])

  const loadMoreMessages = useCallback(async (sessionId = useChatStore.getState().activeSessionId) => {
    if (!sessionId) return
    const state = useChatStore.getState()
    const cursor = state.messagesNextCursors[sessionId]
    if (!cursor || state.messagesLoadingMore[sessionId]) return

    store.setMessagesLoadingMore(sessionId, true)
    try {
      const { data } = await chatService.getMessages(sessionId, { params: { cursor } })
      const messages = cursorContent(data)
      store.setMessagesPage(sessionId, messages, cursorNext(data), 'prepend')
      confirmUnreadAssistantReceipts(sessionId, messages).catch(() => {})
    } catch (e) {
      store.setError(normalizeApiError(e, t('chat.errorMasMensajes')).message)
    } finally {
      store.setMessagesLoadingMore(sessionId, false)
    }
  }, [confirmUnreadAssistantReceipts, store])

  const selectSession = useCallback(async (sessionId, { updateRoute = true } = {}) => {
    store.setError(null)
    store.setConnectionState('idle')
    store.setActiveSession(sessionId)
    if (updateRoute && sessionId) {
      navigate(`/chat/${sessionId}`)
    }
  }, [navigate, store])

  const startNewChat = useCallback(({ updateRoute = true } = {}) => {
    store.setActiveSession(null)
    store.setLoading(false)
    store.setError(null)
    store.setConnectionState('idle')
    store.setMessages('new', [welcomeMessage(user?.name?.split(' ')[0])])
    if (updateRoute) {
      navigate('/chat')
    }
  }, [navigate, store, user])

  const ensureSession = useCallback(async (initialText) => {
    const currentSessionId = useChatStore.getState().activeSessionId
    if (currentSessionId) return currentSessionId

    const { data } = await chatService.createSession()
      const session = {
        ...data,
        title: titleFromText(initialText),
      }
      store.addSession(session)
      store.setActiveSession(data.id)
      store.moveMessages('new', data.id)
      navigate(`/chat/${data.id}`, { replace: true })
      chatService.updateSession(data.id, { title: session.title })
        .then(({ data: updatedSession }) => store.upsertSession(updatedSession))
        .catch(() => {})
      return data.id
    }, [navigate, store])

  const sendMessage = useCallback(async (text, language = useLanguageStore.getState().idioma) => {
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
        // De forma optimista el texto ocupa las dos ranuras: es lo único que existe hasta
        // que el flujo devuelve su traducción al español, que es la que el backend guardará
        // como canónica.
        content: trimmed,
        language,
        contentLocalized: language === 'es' ? null : trimmed,
        citations: [],
        createdAt: new Date().toISOString(),
        state: 'sending',
      }
      store.addMessage(sessionId, userMsg)
      store.setLoading(true)
      await confirmUnreadAssistantReceipts(
        sessionId,
        useChatStore.getState().messages[sessionId] || []
      )
      await waitForOpenStream(sessionId)

      const { data } = await chatService.sendMessage({ message: trimmed, sessionId, language })
      store.clearDraft(sessionId)
      store.clearDraft('new')
      store.replaceMessage(sessionId, tempId, {
        id: data.userMessageId,
        state: 'processing',
      })
      store.setProcessingStatus({
        processing: true,
        chatSessionId: sessionId,
        userMessageId: data.userMessageId,
        status: data.status,
      })
    } catch (e) {
      const normalizedError = normalizeApiError(e, t('chat.errorEnviar'))
      const status = normalizedError.status

      if (!status) {
        store.replaceMessage(sessionId || 'new', tempId, { state: 'unknown_delivery' })
        store.setError(normalizedError.message)
        if (sessionId) await loadMessages(sessionId, { force: true })
        return
      }

      store.setLoading(false)

      if (status === 409) {
        store.removeMessage(sessionId || 'new', tempId)
        loadProcessingStatus().catch(() => {})
        store.setError(normalizedError.message)
        return
      }

      if (status === 403) {
        if (normalizedError.code === 'insufficient_tokens') {
          // El envío se rechazó por falta de tokens: conservamos el mensaje del
          // usuario (marcado como no enviado), devolvemos su texto al input como
          // borrador (sobrevive a la ida al checkout de pago) y dejamos un aviso
          // accionable en el hilo en lugar de descartarlo en silencio.
          store.setDraft(sessionId || 'new', trimmed)
          store.replaceMessage(sessionId || 'new', tempId, { state: 'failed' })
          store.addMessage(sessionId || 'new', {
            id: `err_${Date.now()}`,
            role: 'SYSTEM',
            messageKey: 'chat.sinTokens',
            errorCode: 'insufficient_tokens',
            citations: [],
            createdAt: new Date().toISOString(),
            isError: true,
            retryText: null,
            retryAttempted: false,
          })
          store.setError(normalizedError.message)
          usePaymentStore.getState().loadSubscription().catch(() => {})
          return
        }

        store.removeMessage(sessionId || 'new', tempId)
        store.setError(normalizedError.message)
        usePaymentStore.getState().loadSubscription().catch(() => {})
        return
      }

      store.addMessage(sessionId || 'new', {
        id: `err_${Date.now()}`,
        role: 'SYSTEM',
        // Se guarda también el código: cuando existe, ChatMessage lo vuelve a traducir al
        // renderizar. El texto queda como respaldo para los errores que sólo traen mensaje
        // del servidor, que no hay forma de traducir después.
        content: normalizedError.message,
        errorCode: normalizedError.code,
        citations: [],
        createdAt: new Date().toISOString(),
        isError: true,
        retryText: normalizedError.retryable ? trimmed : null,
        retryAttempted: false,
      })
    } finally {
      sendingTextRef.current = null
    }
  }, [confirmUnreadAssistantReceipts, ensureSession, loadMessages, loadProcessingStatus, store, waitForOpenStream])

  const rateMessage = useCallback(async (messageId, rating, comment = '') => {
    const sessionId = useChatStore.getState().activeSessionId
    if (!sessionId || !messageId) return
    store.updateMessageRating(sessionId, messageId, rating, comment)
    try {
      await chatService.rateMessage(messageId, rating, comment)
    } catch (e) {
      await loadMessages(sessionId, { force: true })
      store.setError(normalizeApiError(e, t('chat.errorCalificacion')).message)
      throw e
    }
  }, [loadMessages, store])

  const deleteSession = useCallback(async (sessionId) => {
    try {
      await chatService.deleteSession(sessionId)
      store.removeSession(sessionId)
      if (useChatStore.getState().activeSessionId === sessionId) startNewChat()
    } catch (e) {
      store.setError(normalizeApiError(e, t('chat.errorEliminar')).message)
    }
  }, [startNewChat, store])

  const renameSession = useCallback(async (sessionId, title) => {
    const previous = useChatStore.getState().sessions.find((s) => s.id === sessionId)
    store.updateSessionTitle(sessionId, title)
    try {
      const { data } = await chatService.updateSession(sessionId, { title })
      store.upsertSession(data)
    } catch (e) {
      if (previous) store.upsertSession(previous)
      store.setError(normalizeApiError(e, t('chat.errorRenombrar')).message)
    }
  }, [store])

  const retryMessage = useCallback(async (text, errorMessageId) => {
    const sessionId = useChatStore.getState().activeSessionId
    if (!sessionId || !text) return
    if (errorMessageId) {
      store.replaceMessage(sessionId, errorMessageId, { retryAttempted: true })
    }
    await sendMessage(text)
  }, [sendMessage, store])

  useEffect(() => {
    const sessionId = store.activeSessionId
    if (!sessionId || !accessToken) return undefined

    let disposed = false

    const stop = () => {
      if (openStreamRef.current === sessionId) openStreamRef.current = null
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
        // La suscripción va primero y la reconciliación después: entre que se pide el
        // historial y el emisor queda registrado en el servidor hay una ventana en la que
        // cualquier evento (respuesta o error) se despacha sin nadie escuchando y se pierde
        // sin reintento. Abriendo antes el stream, esos eventos quedan en el flujo y se leen
        // en cuanto arranca el bucle de lectura.
        let token = useAuthStore.getState().accessToken
        let response = await fetch(apiStreamUrl(`/chat/subscribe/${sessionId}`), {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })

        if (response.status === 401) {
          try {
            token = await refreshAccessToken()
            response = await fetch(apiStreamUrl(`/chat/subscribe/${sessionId}`), {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            })
          } catch (e) {
            logout()
            navigate('/')
            return
          }
          if (response.status === 401) {
            logout()
            navigate('/')
            return
          }
        }
        if (response.status === 403 || response.status === 404) {
          store.setActiveSession(null)
          navigate('/chat')
          return
        }
        if (!response.ok || !response.body) throw new Error('SSE connection failed')

        store.setConnectionState('connected')
        openStreamRef.current = sessionId
        retryRef.current = 0

        // Sin await: el historial se reconcilia mientras el bucle ya está leyendo. La mezcla
        // es por id, así que un mensaje que llegue por SSE en ese intervalo no se pisa.
        loadMessages(sessionId, { force: true }).catch(() => {})

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
              const message = sseEventToMessage(event)
              if (message) {
                store.upsertMessage(sessionId, message)
                store.clearPendingUserMessageStates(sessionId)
                store.setProcessingStatus({ processing: false })
                store.setLoading(false)
                if (message.role === 'ASSISTANT') {
                  confirmUnreadAssistantReceipts(sessionId, [message]).catch(() => {})
                  usePaymentStore.getState().loadSubscription().catch(() => {})
                }
              }
              if (event.type === 'assistant_error') {
                store.setProcessingStatus({ processing: false })
                store.setLoading(false)
                usePaymentStore.getState().loadSubscription().catch(() => {})
              }
            }
          }
        }

        throw new Error('SSE disconnected')
      } catch (e) {
        if (openStreamRef.current === sessionId) openStreamRef.current = null
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

  useEffect(() => {
    if (!accessToken) {
      useChatStore.getState().setProcessingStatus({ processing: false })
      return undefined
    }

    loadProcessingStatus().catch(() => {})
  }, [accessToken, loadProcessingStatus])

  useEffect(() => {
    if (!accessToken) return undefined

    const processing = store.processingStatus
    const processingSessionId = processing?.chatSessionId
    if (!processing?.processing || !processingSessionId) return undefined

    // La entrega por SSE es de un solo intento: si el emisor no está registrado en el
    // instante exacto del despacho (reconexión, cambio de sesión, la carrera del primer
    // mensaje de un chat nuevo), el evento se pierde y no se reintenta. El error es el caso
    // sensible, porque no pasa por el outbox como sí lo hace la respuesta del asistente.
    // Por eso se vigila el estado de procesamiento también en la sesión activa: cuando el
    // servidor deja de estar procesando y el hilo sigue en espera, se relee el historial,
    // que ya tiene persistido el mensaje de error o la respuesta.
    const isActiveSession = processingSessionId === store.activeSessionId
    const pollIntervalMs = isActiveSession ? 10000 : 5000

    let disposed = false

    const refreshProcessing = async () => {
      const nextStatus = await loadProcessingStatus().catch(() => null)
      if (disposed || !nextStatus || nextStatus.processing) return
      usePaymentStore.getState().loadSubscription().catch(() => {})
      if (isActiveSession) {
        await reconcileRef.current?.(processingSessionId).catch(() => {})
      }
    }

    refreshProcessing()
    const intervalId = window.setInterval(refreshProcessing, pollIntervalMs)

    return () => {
      disposed = true
      window.clearInterval(intervalId)
    }
  }, [
    accessToken,
    loadProcessingStatus,
    store.activeSessionId,
    store.processingStatus?.chatSessionId,
    store.processingStatus?.processing,
  ])

  return {
    sessions:        store.sessions,
    sessionsNextCursor: store.sessionsNextCursor,
    sessionsLoading: store.sessionsLoading,
    sessionsLoadingMore: store.sessionsLoadingMore,
    activeSessionId: store.activeSessionId,
    messages:        store.messages,
    messagesNextCursors: store.messagesNextCursors,
    messagesLoadingMore: store.messagesLoadingMore,
    loading:         store.loading,
    processingStatus: store.processingStatus,
    connectionState: store.connectionState,
    error:           store.error,
    drafts:          store.drafts,
    clearDraft:      store.clearDraft,
    loadSessions,
    loadMoreSessions,
    loadMoreMessages,
    loadProcessingStatus,
    selectSession,
    startNewChat,
    sendMessage,
    retryMessage,
    rateMessage,
    deleteSession,
    renameSession,
  }
}
