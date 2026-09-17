import { act, cleanup, renderHook } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  chatService: {
    getProcessingStatus: vi.fn(),
    getMessages: vi.fn(),
    getSessions: vi.fn(),
    confirmReceipt: vi.fn(),
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
  useChatStore.setState({ activeSessionId: SESSION_ID, messages: {}, processingStatus: { processing: false } })
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
})

// Fuera de act() React renderiza las actualizaciones del store en cuanto ocurren, como en el
// navegador; dentro de act() las difiere y esconde las carreras con la limpieza del efecto.
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
})
