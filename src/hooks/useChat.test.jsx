import { useEffect } from 'react'
import { act, cleanup, renderHook } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  chatService: {
    getProcessingStatus: vi.fn(),
    getMessages: vi.fn(),
    getSessions: vi.fn(),
    confirmReceipt: vi.fn(),
    createSession: vi.fn(),
    sendMessage: vi.fn(),
    updateSession: vi.fn(() => Promise.resolve({ data: {} })),
    deleteSession: vi.fn(() => Promise.resolve({})),
  },
  paymentService: {
    getSubscription: vi.fn(() => Promise.resolve({ data: null })),
    getPlans: vi.fn(() => Promise.resolve({ data: [] })),
  },
  getApiBaseUrl: () => 'http://api.test/api/v1',
  refreshAccessToken: vi.fn(),
}))

const { chatService, refreshAccessToken } = await import('@/services/api')
const { useChat } = await import('@/hooks/useChat')
const { useChatStore } = await import('@/store/chatStore')
const { useAuthStore } = await import('@/store/authStore')
const { usePaymentStore } = await import('@/store/paymentStore')

const SESSION_ID = 'session-1'

const encoder = new TextEncoder()

const openStream = (signal) => {
  let streamController
  const body = new ReadableStream({
    start(controller) {
      streamController = controller
      signal?.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')))
    },
  })
  return {
    response: { status: 200, ok: true, body },
    push: (event, data) => streamController.enqueue(encoder.encode(`event:${event}\ndata:${data}\n\n`)),
  }
}

const abortableFetch = (respond) =>
  vi.fn((url, { signal }) => {
    if (signal?.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'))
    return respond(url, signal)
  })

const renderChat = () =>
  renderHook(() => ({ chat: useChat(), location: useLocation() }), {
    wrapper: ({ children }) => <MemoryRouter initialEntries={[`/chat/${SESSION_ID}`]}>{children}</MemoryRouter>,
  })

const subscribeCalls = () => globalThis.fetch.mock.calls.filter(([url]) => url.includes('/chat/subscribe/'))

const flush = async () => {
  for (let i = 0; i < 5; i += 1) await Promise.resolve()
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(console, 'info').mockImplementation(() => {})
  chatService.getProcessingStatus.mockResolvedValue({ data: { processing: false } })
  chatService.getMessages.mockResolvedValue({ data: { content: [], nextCursor: null } })
  chatService.confirmReceipt.mockResolvedValue({ status: 204 })
  useAuthStore.setState({ accessToken: 'token-1', refreshToken: 'refresh-1', user: { name: 'Test' } })
  useChatStore.setState({
    activeSessionId: SESSION_ID,
    messages: {},
    processingStatus: { processing: false },
    streamingReplies: {},
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

describe('useChat SSE connection', () => {
  it('reconnects when the stream stays silent past the heartbeat window', async () => {
    const streams = []
    globalThis.fetch = abortableFetch((url, signal) => {
      const stream = openStream(signal)
      streams.push(stream)
      return Promise.resolve(stream.response)
    })

    renderChat()
    await act(flush)
    streams[0].push('connected', 'connected')
    await act(flush)
    expect(subscribeCalls()).toHaveLength(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(subscribeCalls().length).toBeGreaterThanOrEqual(2)
  })

  it('keeps the stream while heartbeats keep arriving', async () => {
    const streams = []
    globalThis.fetch = abortableFetch((url, signal) => {
      const stream = openStream(signal)
      streams.push(stream)
      return Promise.resolve(stream.response)
    })

    renderChat()
    await act(flush)
    streams[0].push('connected', 'connected')

    for (let i = 0; i < 8; i += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(15_000)
      })
      streams[0].push('heartbeat', 'ping')
      await act(flush)
    }

    expect(subscribeCalls()).toHaveLength(1)
  })

  it('shows a live answer after the question when the device clock runs ahead', async () => {
    const streams = []
    globalThis.fetch = abortableFetch((url, signal) => {
      const stream = openStream(signal)
      streams.push(stream)
      return Promise.resolve(stream.response)
    })
    useChatStore.setState({
      messages: {
        [SESSION_ID]: [{ id: 'tmp_1', role: 'USER', content: 'consulta', createdAt: '2026-01-01T00:00:09Z' }],
      },
    })

    renderChat()
    await act(flush)
    streams[0].push('assistant_message', JSON.stringify({
      messageId: 'answer-1',
      message: 'respuesta',
      createdAt: '2026-01-01T00:00:05Z',
    }))
    await act(flush)

    const thread = useChatStore.getState().messages[SESSION_ID]
    expect(thread.map((message) => message.id)).toEqual(['tmp_1', 'answer-1'])
  })

  it('confirms the receipt of an assistant error', async () => {
    const streams = []
    globalThis.fetch = abortableFetch((url, signal) => {
      const stream = openStream(signal)
      streams.push(stream)
      return Promise.resolve(stream.response)
    })

    renderChat()
    await act(flush)
    streams[0].push('connected', 'connected')
    streams[0].push('assistant_error', JSON.stringify({
      sessionId: SESSION_ID,
      messageId: 'error-1',
      errorCode: 'upstream_timeout',
      errorMessage: 'Assistant service timed out',
      receiptStatus: 'PENDING',
    }))
    await act(flush)

    expect(chatService.confirmReceipt).toHaveBeenCalledWith('error-1')
  })
})

describe('useChat live answer', () => {
  const draft = (text, sequence, userMessageId = 'user-1') =>
    JSON.stringify({ sessionId: SESSION_ID, userMessageId, text, sequence })

  it('shows the answer while it is written and replaces it with the final message', async () => {
    const streams = []
    globalThis.fetch = abortableFetch((url, signal) => {
      const stream = openStream(signal)
      streams.push(stream)
      return Promise.resolve(stream.response)
    })

    renderChat()
    await act(flush)
    streams[0].push('assistant_draft', draft('Con lo que', 1))
    streams[0].push('assistant_draft', draft('Con lo que cuentas', 2))
    await act(flush)

    expect(useChatStore.getState().streamingReplies[SESSION_ID]).toEqual({
      userMessageId: 'user-1',
      text: 'Con lo que cuentas',
      sequence: 2,
    })
    expect(useChatStore.getState().messages[SESSION_ID] || []).toEqual([])

    streams[0].push('assistant_message', JSON.stringify({ messageId: 'answer-1', message: 'Con lo que cuentas, final.' }))
    await act(flush)

    expect(useChatStore.getState().streamingReplies[SESSION_ID]).toBeUndefined()
    expect(useChatStore.getState().messages[SESSION_ID].map((message) => message.content)).toEqual([
      'Con lo que cuentas, final.',
    ])
  })

  it('ignores a draft that arrives after a newer one', async () => {
    const streams = []
    globalThis.fetch = abortableFetch((url, signal) => {
      const stream = openStream(signal)
      streams.push(stream)
      return Promise.resolve(stream.response)
    })

    renderChat()
    await act(flush)
    streams[0].push('assistant_draft', draft('texto mas largo', 3))
    streams[0].push('assistant_draft', draft('texto', 2))
    await act(flush)

    expect(useChatStore.getState().streamingReplies[SESSION_ID].text).toBe('texto mas largo')
  })

  it('clears the live answer when the turn ends in an error', async () => {
    const streams = []
    globalThis.fetch = abortableFetch((url, signal) => {
      const stream = openStream(signal)
      streams.push(stream)
      return Promise.resolve(stream.response)
    })

    renderChat()
    await act(flush)
    streams[0].push('assistant_draft', draft('Empezando', 1))
    await act(flush)
    streams[0].push('assistant_error', JSON.stringify({ messageId: 'error-1', errorCode: 'upstream_error' }))
    await act(flush)

    expect(useChatStore.getState().streamingReplies[SESSION_ID]).toBeUndefined()
  })

  it('drops a live answer left behind when processing ends without the final event', async () => {
    useChatStore.setState({
      processingStatus: { processing: true, chatSessionId: SESSION_ID },
      streamingReplies: { [SESSION_ID]: { userMessageId: 'user-1', text: 'a medias', sequence: 4 } },
    })
    globalThis.fetch = abortableFetch((url, signal) => Promise.resolve(openStream(signal).response))
    chatService.getProcessingStatus.mockResolvedValue({ data: { processing: false } })

    renderChat()
    await act(flush)

    expect(useChatStore.getState().streamingReplies[SESSION_ID]).toBeUndefined()
  })
})

// Sin act(): dentro de act() React difiere las actualizaciones y esconde las carreras.
describe('useChat with browser scheduling', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false
  })

  afterEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
  })

  it('does not log out when the token refresh restarts the stream', async () => {
    let subscribeAttempt = 0
    globalThis.fetch = abortableFetch((url, signal) => {
      subscribeAttempt += 1
      if (subscribeAttempt === 1) return Promise.resolve({ status: 401, ok: false, body: null })
      return Promise.resolve(openStream(signal).response)
    })
    refreshAccessToken.mockImplementation(async () => {
      useAuthStore.getState().setTokens('token-2', 'refresh-2')
      await new Promise((resolve) => setTimeout(resolve, 10))
      return 'token-2'
    })

    const { result } = renderChat()
    await vi.advanceTimersByTimeAsync(2_000)

    expect(useAuthStore.getState().accessToken).toBe('token-2')
    expect(result.current.location.pathname).toBe(`/chat/${SESSION_ID}`)
  })

  it('reloads the history when the server stops processing', async () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {}))
    useChatStore.setState({
      processingStatus: { processing: true, chatSessionId: SESSION_ID, userMessageId: 'user-1' },
    })

    renderChat()
    await vi.advanceTimersByTimeAsync(100)

    expect(chatService.getMessages).toHaveBeenCalledWith(SESSION_ID, expect.anything())
  })

  describe('messages whose send failed', () => {
    const TEXT = 'consulta'
    const userMessages = () => useChatStore.getState().messages[SESSION_ID].filter((message) => message.role === 'USER')

    beforeEach(() => {
      globalThis.fetch = abortableFetch((url, signal) => Promise.resolve(openStream(signal).response))
      useChatStore.setState({ messages: { [SESSION_ID]: [] }, drafts: {}, error: null, loading: false })
    })

    it('shows a new message after the last answer when the device clock runs behind', async () => {
      chatService.sendMessage.mockReturnValue(new Promise(() => {}))
      const answeredAt = new Date(Date.now() + 9_000).toISOString()
      useChatStore.setState({
        messages: { [SESSION_ID]: [{ id: 'answer-1', role: 'ASSISTANT', content: 'preguntas', createdAt: answeredAt }] },
      })
      const { result } = renderChat()
      await vi.advanceTimersByTimeAsync(50)

      result.current.chat.sendMessage('sigue igual', 'es')
      await vi.advanceTimersByTimeAsync(10)

      const thread = useChatStore.getState().messages[SESSION_ID]
      expect(thread[thread.length - 1].content).toBe('sigue igual')
    })

    it('does not duplicate a message the server received when the response was lost', async () => {
      chatService.sendMessage.mockRejectedValue(new Error('Network Error'))
      const { result } = renderChat()
      await vi.advanceTimersByTimeAsync(50)
      chatService.getMessages.mockResolvedValue({
        data: {
          content: [{ id: 'real', role: 'USER', content: TEXT, createdAt: new Date().toISOString() }],
          nextCursor: null,
        },
      })
      chatService.getProcessingStatus.mockResolvedValue({ data: { processing: true, chatSessionId: SESSION_ID } })

      await result.current.chat.sendMessage(TEXT, 'es')

      expect(userMessages().map((message) => message.id)).toEqual(['real'])
      expect(useChatStore.getState().loading).toBe(false)
    })

    it('marks as failed a message the server never received and keeps its text', async () => {
      chatService.sendMessage.mockRejectedValue(new Error('Network Error'))
      const { result } = renderChat()
      await vi.advanceTimersByTimeAsync(50)

      await result.current.chat.sendMessage(TEXT, 'es')

      expect(userMessages()[0].state).toBe('failed')
      expect(useChatStore.getState().drafts[SESSION_ID].text).toBe(TEXT)
      expect(useChatStore.getState().loading).toBe(false)
    })

    it('does not leave a rejected message sending, nor duplicate it on retry', async () => {
      chatService.sendMessage.mockRejectedValue({ response: { status: 500, data: {} } })
      const { result } = renderChat()
      await vi.advanceTimersByTimeAsync(50)

      await result.current.chat.sendMessage(TEXT, 'es')
      expect(userMessages()[0].state).toBe('failed')

      chatService.sendMessage.mockResolvedValue({ data: { userMessageId: 'real', status: 'PROCESSING' } })
      await result.current.chat.retryMessage(TEXT)

      expect(userMessages().map((message) => message.id)).toEqual(['real'])
    })

    it('retries from a new chat', async () => {
      useChatStore.setState({ activeSessionId: null, messages: { new: [] } })
      chatService.createSession.mockResolvedValue({ data: { id: SESSION_ID } })
      chatService.sendMessage.mockResolvedValue({ data: { userMessageId: 'real', status: 'PROCESSING' } })
      const { result } = renderHook(() => useChat(), {
        wrapper: ({ children }) => <MemoryRouter initialEntries={['/chat']}>{children}</MemoryRouter>,
      })

      const pending = result.current.retryMessage(TEXT)
      await vi.advanceTimersByTimeAsync(6_000)
      await pending

      expect(chatService.sendMessage).toHaveBeenCalledWith(expect.objectContaining({ message: TEXT, sessionId: SESSION_ID }))
    })
  })

  describe('switching sessions with a query in progress', () => {
    const OTHER_ID = 'session-2'
    const busy = { processing: true, chatSessionId: SESSION_ID, userMessageId: 'user-1' }

    beforeEach(() => {
      globalThis.fetch = abortableFetch((url, signal) => Promise.resolve(openStream(signal).response))
      chatService.getProcessingStatus.mockResolvedValue({ data: busy })
      chatService.getMessages.mockImplementation(async (id) => ({
        data: {
          content: id === OTHER_ID
            ? [
                { id: 'other-user', role: 'USER', content: 'hola', createdAt: '2026-01-01T00:00:00Z' },
                { id: 'other-answer', role: 'ASSISTANT', content: 'resp', createdAt: '2026-01-01T00:00:01Z' },
              ]
            : [{ id: 'user-1', role: 'USER', content: 'consulta', createdAt: '2026-01-02T00:00:00Z' }],
          nextCursor: null,
        },
      }))
      useChatStore.setState({ activeSessionId: SESSION_ID, messages: {}, processingStatus: busy, loading: false })
    })

    it('does not end the query when opening a session that is already answered', async () => {
      const { result } = renderChat()
      await vi.advanceTimersByTimeAsync(50)
      result.current.chat.selectSession(OTHER_ID, { updateRoute: false })
      await vi.advanceTimersByTimeAsync(50)

      expect(useChatStore.getState().processingStatus).toMatchObject(busy)
    })

    it('ends the query when its own session is answered', async () => {
      chatService.getMessages.mockResolvedValue({
        data: {
          content: [
            { id: 'user-1', role: 'USER', content: 'consulta', createdAt: '2026-01-02T00:00:00Z' },
            { id: 'answer-1', role: 'ASSISTANT', content: 'resp', createdAt: '2026-01-02T00:00:05Z' },
          ],
          nextCursor: null,
        },
      })

      renderChat()
      await vi.advanceTimersByTimeAsync(50)

      expect(useChatStore.getState().processingStatus.processing).toBe(false)
    })

    it('does not cancel the history of the open session when asked for another one', async () => {
      useChatStore.setState({ processingStatus: { processing: false } })
      chatService.getProcessingStatus.mockResolvedValue({ data: { processing: false } })
      let sendReject
      chatService.sendMessage.mockReturnValue(new Promise((resolve, reject) => { sendReject = reject }))

      const { result } = renderChat()
      await vi.advanceTimersByTimeAsync(50)
      result.current.chat.sendMessage('consulta', 'es')
      await vi.advanceTimersByTimeAsync(50)

      let historySignal
      chatService.getMessages.mockImplementation((id, { signal }) => {
        if (id === OTHER_ID) historySignal = signal
        return new Promise(() => {})
      })
      result.current.chat.selectSession(OTHER_ID, { updateRoute: false })
      await vi.advanceTimersByTimeAsync(50)
      sendReject(new Error('Network Error'))
      await vi.advanceTimersByTimeAsync(50)

      expect(historySignal.aborted).toBe(false)
    })

    it('leaves the input free once the send is accepted, whichever session is open', async () => {
      chatService.sendMessage.mockResolvedValue({ data: { userMessageId: 'user-2', status: 'PROCESSING' } })
      useChatStore.setState({ processingStatus: { processing: false } })
      chatService.getProcessingStatus.mockResolvedValue({ data: { processing: false } })

      const { result } = renderChat()
      await vi.advanceTimersByTimeAsync(50)
      await result.current.chat.sendMessage('otra consulta', 'es')

      expect(useChatStore.getState().loading).toBe(false)
      expect(useChatStore.getState().processingStatus.chatSessionId).toBe(SESSION_ID)
    })
  })

  describe('sending from a new chat', () => {
    const TEXT = '¿qué es la patria potestad?'
    const welcome = { id: 'welcome', role: 'ASSISTANT', citations: [], createdAt: '2026-01-01T00:00:00Z' }
    const newThread = () => useChatStore.getState().messages.new || []

    // Reproduce el efecto de ChatPage que corre cada vez que la ruta vuelve a /chat.
    const renderNewChat = () =>
      renderHook(() => {
        const chat = useChat()
        const location = useLocation()
        useEffect(() => {
          if (location.pathname === '/chat') chat.startNewChat({ updateRoute: false, keepThread: true })
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [location.pathname])
        return { chat, location }
      }, {
        wrapper: ({ children }) => <MemoryRouter initialEntries={['/chat']}>{children}</MemoryRouter>,
      })

    beforeEach(() => {
      globalThis.fetch = abortableFetch((url, signal) => Promise.resolve(openStream(signal).response))
      useChatStore.setState({
        activeSessionId: null,
        messages: { new: [welcome] },
        drafts: {},
        error: null,
        loading: false,
      })
    })

    it('shows the message while the session is still being created', async () => {
      chatService.createSession.mockReturnValue(new Promise(() => {}))

      const { result } = renderNewChat()
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.sendMessage(TEXT, 'es')
      await vi.advanceTimersByTimeAsync(10)

      expect(newThread().find((message) => message.role === 'USER')).toMatchObject({ content: TEXT, state: 'sending' })
      expect(useChatStore.getState().loading).toBe(true)
    })

    it('keeps the message when a new chat is opened while the session is being created', async () => {
      let resolveSession
      chatService.createSession.mockReturnValue(new Promise((resolve) => { resolveSession = resolve }))
      chatService.sendMessage.mockReturnValue(new Promise(() => {}))

      const { result } = renderNewChat()
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.sendMessage(TEXT, 'es')
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.startNewChat()
      resolveSession({ data: { id: SESSION_ID } })
      await vi.advanceTimersByTimeAsync(10)

      const thread = useChatStore.getState().messages[SESSION_ID]
      expect(thread.some((message) => message.content === TEXT)).toBe(true)
    })

    it('stays on the session opened while the new one was being created', async () => {
      let resolveSession
      chatService.createSession.mockReturnValue(new Promise((resolve) => { resolveSession = resolve }))
      chatService.sendMessage.mockResolvedValue({ data: { userMessageId: 'real', status: 'PROCESSING' } })

      const { result } = renderNewChat()
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.sendMessage(TEXT, 'es')
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.selectSession('session-2')
      await vi.advanceTimersByTimeAsync(10)
      resolveSession({ data: { id: SESSION_ID } })
      await vi.advanceTimersByTimeAsync(10)

      const state = useChatStore.getState()
      expect(state.activeSessionId).toBe('session-2')
      expect(result.current.location.pathname).toBe('/chat/session-2')
      expect(state.messages[SESSION_ID].some((message) => message.content === TEXT)).toBe(true)
      expect(newThread().some((message) => message.content === TEXT)).toBe(false)
      expect(chatService.sendMessage).toHaveBeenCalledWith(expect.objectContaining({ sessionId: SESSION_ID }))
    })

    it('stays on the opened session when the background send is rejected', async () => {
      let resolveSession
      chatService.createSession.mockReturnValue(new Promise((resolve) => { resolveSession = resolve }))
      chatService.sendMessage.mockRejectedValue({
        response: { status: 409, data: { code: 'message_processing_pending' } },
      })

      const { result } = renderNewChat()
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.sendMessage(TEXT, 'es')
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.selectSession('session-2')
      await vi.advanceTimersByTimeAsync(10)
      resolveSession({ data: { id: SESSION_ID } })
      await vi.advanceTimersByTimeAsync(10)

      expect(useChatStore.getState().activeSessionId).toBe('session-2')
      expect(result.current.location.pathname).toBe('/chat/session-2')
    })

    it('keeps the text and the notice when another query is in progress', async () => {
      chatService.createSession.mockResolvedValue({ data: { id: SESSION_ID } })
      chatService.sendMessage.mockRejectedValue({
        response: { status: 409, data: { code: 'message_processing_pending' } },
      })

      const { result } = renderNewChat()
      await vi.advanceTimersByTimeAsync(10)
      result.current.chat.sendMessage(TEXT, 'es')
      await vi.advanceTimersByTimeAsync(6_000)

      const state = useChatStore.getState()
      expect(newThread().some((message) => message.role === 'USER')).toBe(false)
      expect(state.drafts.new.text).toBe(TEXT)
      expect(state.error.code).toBe('message_processing_pending')
      expect(state.loading).toBe(false)
      expect(chatService.deleteSession).toHaveBeenCalledWith(SESSION_ID)
    })

    it('does not get stuck when the session cannot be created', async () => {
      chatService.createSession.mockRejectedValue(new Error('Network Error'))

      const { result } = renderNewChat()
      await vi.advanceTimersByTimeAsync(10)
      await result.current.chat.sendMessage(TEXT, 'es')

      const state = useChatStore.getState()
      expect(newThread().some((message) => message.role === 'USER')).toBe(false)
      expect(state.drafts.new.text).toBe(TEXT)
      expect(state.loading).toBe(false)
    })

    it('removes the pending message when creating the session is rejected', async () => {
      chatService.createSession.mockRejectedValue({ response: { status: 500, data: {} } })

      const { result } = renderNewChat()
      await vi.advanceTimersByTimeAsync(10)
      await result.current.chat.sendMessage(TEXT, 'es')

      const state = useChatStore.getState()
      expect(newThread().some((message) => message.role === 'USER')).toBe(false)
      expect(newThread().some((message) => message.role === 'SYSTEM')).toBe(true)
      expect(state.loading).toBe(false)
    })
  })
})

describe('saving drafts', () => {
  it('keeps the text while signed in and drops it after signing out', () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {}))
    useChatStore.setState({ drafts: {} })
    const { result } = renderChat()

    result.current.chat.saveDraft(SESSION_ID, 'a medio escribir')
    expect(useChatStore.getState().drafts[SESSION_ID].text).toBe('a medio escribir')

    useAuthStore.getState().logout()
    result.current.chat.saveDraft(SESSION_ID, 'a medio escribir')
    expect(useChatStore.getState().drafts).toEqual({})
  })
})

describe('signing out', () => {
  it('clears what the previous account left in the chat and billing stores', () => {
    useChatStore.setState({
      sessions: [{ id: SESSION_ID }],
      messages: { new: [{ id: 'welcome', role: 'ASSISTANT' }] },
      drafts: { new: { text: 'borrador', ts: 1 } },
    })
    usePaymentStore.setState({ subscription: { planCode: 'FREE' } })

    useAuthStore.getState().logout()

    const chat = useChatStore.getState()
    expect(chat.sessions).toEqual([])
    expect(chat.messages).toEqual({})
    expect(chat.activeSessionId).toBeNull()
    expect(chat.drafts).toEqual({})
    expect(sessionStorage.getItem('legalfam.chat.drafts')).toBe('{}')
    expect(usePaymentStore.getState().subscription).toBeNull()
  })
})
