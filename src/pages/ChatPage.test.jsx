import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const chat = {}

vi.mock('@/hooks/useChat', () => ({ useChat: () => chat }))
vi.mock('@/services/api', () => ({
  paymentService: {
    getPlans: vi.fn().mockResolvedValue({ data: [] }),
    getSubscription: vi.fn().mockResolvedValue({ data: null }),
    cancelSubscription: vi.fn(),
    createCheckoutSession: vi.fn(),
  },
}))

const { default: ChatPage } = await import('./ChatPage')
const { usePaymentStore } = await import('@/store/paymentStore')
const { useAuthStore } = await import('@/store/authStore')
const { useLanguageStore } = await import('@/store/languageStore')
const { tIn } = await import('@/i18n/translate')

const es = (key, vars) => tIn('es', key, vars)
const welcome = { id: 'welcome', role: 'ASSISTANT', messageKey: 'chat.consultaActual', citations: [] }

const resetChat = (overrides = {}) => {
  Object.keys(chat).forEach((key) => delete chat[key])
  Object.assign(chat, {
    sessions: [{ id: 's1', title: 'Pensión de alimentos' }],
    sessionsNextCursor: null,
    sessionsLoading: false,
    sessionsLoadingMore: false,
    activeSessionId: null,
    messages: { new: [welcome] },
    messagesNextCursors: {},
    messagesLoadingMore: {},
    loading: false,
    processingStatus: null,
    connectionState: 'connected',
    error: null,
    drafts: {},
    streamingReplies: {},
    loadSessions: vi.fn(),
    loadMoreSessions: vi.fn(),
    loadMoreMessages: vi.fn().mockResolvedValue(),
    selectSession: vi.fn(),
    startNewChat: vi.fn(),
    sendMessage: vi.fn(),
    retryMessage: vi.fn(),
    rateMessage: vi.fn(),
    deleteSession: vi.fn(),
    renameSession: vi.fn(),
    saveDraft: vi.fn(),
    ...overrides,
  })
}

const renderChat = (path = '/chat') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        <Route path="/" element={<p>portada</p>} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  resetChat()
  useLanguageStore.setState({ language: 'es' })
  useAuthStore.setState({ accessToken: 'a', refreshToken: 'r', user: { name: 'Ana Quispe', email: 'ana@x.pe' } })
  usePaymentStore.setState({ plans: [], subscription: null, loading: false, error: null, refreshBilling: vi.fn().mockResolvedValue() })
  window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(cleanup)

describe('ChatPage on a new conversation', () => {
  it('loads history and billing, starts a new chat and sends a preset question', () => {
    renderChat()

    expect(chat.loadSessions).toHaveBeenCalled()
    expect(usePaymentStore.getState().refreshBilling).toHaveBeenCalled()
    expect(chat.startNewChat).toHaveBeenCalledWith({ updateRoute: false, keepThread: true })
    expect(screen.getByText(es('chat.presetsLabel'))).toBeTruthy()

    fireEvent.click(screen.getByText(es('chat.presets.tenenciaPregunta')).closest('button'))
    expect(chat.sendMessage).toHaveBeenCalledWith(es('chat.presets.tenenciaPregunta'))
  })

  it('refreshes the token balance when the tab becomes visible again', () => {
    renderChat()
    const refresh = usePaymentStore.getState().refreshBilling
    refresh.mockClear()

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(refresh).toHaveBeenCalledTimes(1)
  })
})

describe('ChatPage on an existing conversation', () => {
  const sessionState = (overrides = {}) => resetChat({
    activeSessionId: 's1',
    messages: {
      s1: [
        { id: 'u1', role: 'USER', content: '¿Pensión?', contentLocalized: '¿Pensión? (qu)' },
        { id: 'e1', role: 'SYSTEM', errorCode: 'upstream_timeout', content: 'timeout', isError: true },
      ],
    },
    ...overrides,
  })

  it('selects the session from the URL and retries the last failed question', () => {
    sessionState()
    renderChat('/chat/s1')

    expect(chat.selectSession).toHaveBeenCalledWith('s1', { updateRoute: false })
    expect(screen.getAllByText('Pensión de alimentos').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: es('chat.mensaje.reintentar') }))
    expect(chat.retryMessage).toHaveBeenCalledWith('¿Pensión? (qu)', 'e1')
  })

  it('shows the streamed draft while the assistant writes and blocks the input', () => {
    sessionState({
      loading: true,
      streamingReplies: { s1: { userMessageId: 'u1', text: 'Respuesta **parcial**' } },
    })
    renderChat('/chat/s1')

    expect(screen.getByText('parcial').tagName).toBe('STRONG')
    expect(screen.getByRole('textbox').disabled).toBe(true)
  })

  it('shows loading, reconnect and error notices', () => {
    sessionState({ messages: {}, connectionState: 'reconnecting' })
    renderChat('/chat/s1')
    expect(screen.getByText(es('chat.cargandoConversacion'))).toBeTruthy()
    expect(screen.getByText(es('chat.reconectando'))).toBeTruthy()
    cleanup()

    sessionState({ error: { code: 'message_processing_pending' }, processingStatus: { processing: false } })
    renderChat('/chat/s1')
    expect(screen.queryByText(es('chat.reconectando'))).toBeNull()
    cleanup()

    sessionState({ error: { code: 'network_error', fallbackKey: 'errores.network_error' } })
    renderChat('/chat/s1')
    expect(screen.getByText(es('errores.network_error'))).toBeTruthy()
  })

  it('explains why the input is blocked by another conversation', () => {
    sessionState({ processingStatus: { processing: true, chatSessionId: 'otra' } })
    renderChat('/chat/s1')

    expect(screen.getByText(es('chat.otraEnProceso'))).toBeTruthy()
  })

  it('loads older messages when scrolled to the top', async () => {
    sessionState({ messagesNextCursors: { s1: 50 } })
    window.requestAnimationFrame = (callback) => callback()
    const { container } = renderChat('/chat/s1')

    const list = container.querySelector('[class*="messages"]')
    list.scrollTop = 0
    fireEvent.scroll(list)

    await vi.waitFor(() => expect(chat.loadMoreMessages).toHaveBeenCalledWith('s1'))
  })
})

describe('ChatPage chrome', () => {
  it('opens the plan dialog from the token badge', () => {
    usePaymentStore.setState({ subscription: { planCode: 'FREE', remainingTokens: 40, monthlyTokenLimit: 50 } })
    renderChat()

    const badge = screen.getByTitle(es('chat.verPlanYTokens'))
    fireEvent.pointerEnter(badge.parentElement)
    fireEvent.click(badge)

    expect(screen.getAllByRole('dialog').length).toBeGreaterThan(0)
  })

  it('opens a glossary entry and returns to the chat', () => {
    renderChat()

    fireEvent.click(screen.getByRole('button', { name: es('glosario.casacion.termino') }))
    expect(screen.getAllByText(es('glosario.casacion.termino')).length).toBeGreaterThan(1)
    expect(screen.queryByRole('textbox')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: es('chat.sidebar.nueva') }))
    expect(screen.getByRole('textbox')).toBeTruthy()
    expect(chat.startNewChat).toHaveBeenCalledWith()
  })

  it('asks before signing out and toggles the history panel', () => {
    renderChat()

    fireEvent.click(screen.getByRole('button', { name: es('chat.abrirHistorial') }))
    fireEvent.click(screen.getAllByTitle(es('chat.cerrarSesion'))[0])
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: es('chat.cerrarSesion') }))

    expect(screen.getByText('portada')).toBeTruthy()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
