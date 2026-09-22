import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService, getApiBaseUrl, refreshAccessToken } from '@/services/api'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { usePaymentStore } from '@/store/paymentStore'
import { normalizeApiError, normalizeAssistantErrorMessage, resolveApiError } from '@/utils/apiError'
import { t } from '@/i18n/translate'
import { useLanguageStore } from '@/store/languageStore'

const BACKOFF_MS = [1000, 2000, 5000, 10000, 30000]
const SSE_IDLE_TIMEOUT_MS = 45000
const SSE_WATCHDOG_INTERVAL_MS = 5000

const titleFromText = (text) =>
  text.slice(0, 40) + (text.length > 40 ? '...' : '')

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
      content: data.message || '',
      language: data.language || 'es',
      languageRequested: data.languageRequested || null,
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
      receiptStatus: data.receiptStatus,
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

  const openStreamRef = useRef(null)

  // Un envío anterior a la suscripción SSE se queda sin emisor.
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
      (message.role === 'ASSISTANT' || message.role === 'SYSTEM') &&
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

  reconcileRef.current = reconcileMessages

  const loadSessions = useCallback(async () => {
    store.setSessionsLoading(true)
    try {
      const { data } = await chatService.getSessions()
      store.setSessionsPage(cursorContent(data), cursorNext(data))
    } catch (e) {
      store.setError(normalizeApiError(e, 'chat.errorSesiones'))
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
      store.setError(normalizeApiError(e, 'chat.errorMasSesiones'))
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
      store.setError(normalizeApiError(e, 'chat.errorMensajes'))
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
      store.setError(normalizeApiError(e, 'chat.errorMasMensajes'))
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

  const startNewChat = useCallback(({ updateRoute = true, keepThread = false } = {}) => {
    store.setActiveSession(null)
    store.setLoading(false)
    store.setError(null)
    store.setConnectionState('idle')
    if (!keepThread || !useChatStore.getState().messages.new?.length) {
      store.setMessages('new', [welcomeMessage(user?.name?.split(' ')[0])])
    }
    if (updateRoute) {
      navigate('/chat')
    }
  }, [navigate, store, user])

  const discardSession = useCallback(async (sessionId) => {
    await chatService.deleteSession(sessionId).catch(() => {})
    store.removeSession(sessionId)
    startNewChat()
  }, [startNewChat, store])

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

  const sendMessage = useCallback(async (text, language = useLanguageStore.getState().language) => {
    const trimmed = text.trim()
    if (!trimmed || sendingTextRef.current === trimmed) return

    sendingTextRef.current = trimmed
    store.setError(null)

    const tempId = `tmp_${Date.now()}`
    let sessionId = useChatStore.getState().activeSessionId
    const hadSession = Boolean(sessionId)

    try {
      sessionId = await ensureSession(trimmed)
      const userMsg = {
        id: tempId,
        role: 'USER',
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
      const normalizedError = normalizeApiError(e, 'chat.errorEnviar')
      const status = normalizedError.status

      if (!status) {
        store.replaceMessage(sessionId || 'new', tempId, { state: 'unknown_delivery' })
        store.setError(normalizedError)
        if (sessionId) await loadMessages(sessionId, { force: true })
        return
      }

      store.setLoading(false)

      if (!hadSession && sessionId) {
        await discardSession(sessionId)
        sessionId = null
      }
      const threadKey = sessionId || 'new'

      if (status === 409) {
        store.removeMessage(threadKey, tempId)
        loadProcessingStatus().catch(() => {})
        store.setError(normalizedError)
        return
      }

      if (status === 403) {
        if (normalizedError.code === 'insufficient_tokens') {
          store.setDraft(threadKey, trimmed)
          store.replaceMessage(threadKey, tempId, { state: 'failed' })
          store.addMessage(threadKey, {
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
          store.setError(normalizedError)
          usePaymentStore.getState().loadSubscription().catch(() => {})
          return
        }

        store.removeMessage(threadKey, tempId)
        store.setError(normalizedError)
        usePaymentStore.getState().loadSubscription().catch(() => {})
        return
      }

      store.addMessage(threadKey, {
        id: `err_${Date.now()}`,
        role: 'SYSTEM',
        content: resolveApiError(normalizedError),
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
  }, [confirmUnreadAssistantReceipts, discardSession, ensureSession, loadMessages, loadProcessingStatus, store, waitForOpenStream])

  const rateMessage = useCallback(async (messageId, rating, comment = '') => {
    const sessionId = useChatStore.getState().activeSessionId
    if (!sessionId || !messageId) return
    store.updateMessageRating(sessionId, messageId, rating, comment)
    try {
      await chatService.rateMessage(messageId, rating, comment)
    } catch (e) {
      await loadMessages(sessionId, { force: true })
      store.setError(normalizeApiError(e, 'chat.errorCalificacion'))
      throw e
    }
  }, [loadMessages, store])

  const deleteSession = useCallback(async (sessionId) => {
    try {
      await chatService.deleteSession(sessionId)
      const wasActive = useChatStore.getState().activeSessionId === sessionId
      store.removeSession(sessionId)
      if (wasActive) startNewChat()
    } catch (e) {
      store.setError(normalizeApiError(e, 'chat.errorEliminar'))
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
      store.setError(normalizeApiError(e, 'chat.errorRenombrar'))
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

      // Heartbeat cada 15 s: tres intervalos sin bytes = conexión muerta.
      let lastActivityAt = Date.now()
      let stale = false
      const watchdogId = window.setInterval(() => {
        if (Date.now() - lastActivityAt < SSE_IDLE_TIMEOUT_MS) return
        stale = true
        controller.abort()
      }, SSE_WATCHDOG_INTERVAL_MS)

      try {
        // Suscribirse antes de reconciliar: los eventos despachados sin emisor se pierden.
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
            if (controller.signal.aborted) throw e
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

        loadMessages(sessionId, { force: true }).catch(() => {})

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!disposed) {
          const { value, done } = await reader.read()
          if (done) break
          lastActivityAt = Date.now()
          buffer += decoder.decode(value, { stream: true })
          const chunks = buffer.split(/\r?\n\r?\n/)
          buffer = chunks.pop() || ''

          for (const chunk of chunks) {
            const event = parseSseChunk(chunk)
            if (event.type === 'assistant_message' || event.type === 'assistant_error') {
              const message = sseEventToMessage(event)
              if (message) {
                store.upsertMessage(sessionId, message)
                store.clearPendingUserMessageStates(
                  sessionId,
                  message.role === 'ASSISTANT' ? message.language : null
                )
                store.setProcessingStatus({ processing: false })
                store.setLoading(false)
                confirmUnreadAssistantReceipts(sessionId, [message]).catch(() => {})
                if (message.role === 'ASSISTANT') {
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
        if (disposed || (controller.signal.aborted && !stale)) return
        store.setConnectionState('reconnecting')
        const delay = BACKOFF_MS[Math.min(retryRef.current, BACKOFF_MS.length - 1)]
        retryRef.current += 1
        timerRef.current = window.setTimeout(connect, delay)
      } finally {
        window.clearInterval(watchdogId)
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

    // SSE es de un solo intento: si el servidor terminó y el hilo sigue esperando, se relee el historial.
    const isActiveSession = processingSessionId === store.activeSessionId
    const pollIntervalMs = isActiveSession ? 10000 : 5000

    let disposed = false

    const refreshProcessing = async () => {
      if (disposed) return
      const nextStatus = await loadProcessingStatus().catch(() => null)
      // Sin comprobar `disposed`: guardar el estado desmonta este efecto.
      if (!nextStatus || nextStatus.processing) return
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
