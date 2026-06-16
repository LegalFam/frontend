import { create } from 'zustand'

const sortByCreatedAt = (messages) =>
  [...messages].sort((a, b) => {
    const left = Date.parse(a.createdAt || '') || 0
    const right = Date.parse(b.createdAt || '') || 0
    return left - right
  })

const mergeMessages = (current, incoming, mode = 'replace') => {
  const merged = mode === 'prepend'
    ? [...incoming, ...current]
    : mode === 'append' || mode === 'merge'
      ? [...current, ...incoming]
      : incoming

  const byId = new Map()
  merged.forEach((message) => {
    if (!message.id) return
    byId.set(message.id, { ...(byId.get(message.id) || {}), ...message })
  })

  return sortByCreatedAt(Array.from(byId.values()))
}

const mergeSessions = (current, incoming, append = false) => {
  const merged = append ? [...current, ...incoming] : incoming
  const byId = new Map()
  merged.forEach((session) => {
    if (!session.id) return
    byId.set(session.id, { ...(byId.get(session.id) || {}), ...session })
  })
  return Array.from(byId.values())
}

export const useChatStore = create((set) => ({
  sessions: [],
  sessionsNextCursor: null,
  sessionsLoading: false,
  sessionsLoadingMore: false,
  activeSessionId: null,
  messages: {},
  messagesNextCursors: {},
  messagesLoadingMore: {},
  loading: false,
  processingStatus: { processing: false },
  connectionState: 'idle',
  error: null,

  setSessions: (sessions) =>
    set({
      sessions: mergeSessions([], sessions),
      sessionsNextCursor: null,
    }),

  setSessionsPage: (sessions, nextCursor, append = false) =>
    set((state) => ({
      sessions: mergeSessions(state.sessions, sessions, append),
      sessionsNextCursor: nextCursor || null,
    })),

  setSessionsLoading: (sessionsLoading) => set({ sessionsLoading }),
  setSessionsLoadingMore: (sessionsLoadingMore) => set({ sessionsLoadingMore }),

  addSession: (session) =>
    set((state) => ({
      sessions: state.sessions.some((s) => s.id === session.id)
        ? state.sessions
        : [session, ...state.sessions],
    })),

  upsertSession: (session) =>
    set((state) => {
      const index = state.sessions.findIndex((s) => s.id === session.id)
      return {
        sessions: index === -1
          ? [session, ...state.sessions]
          : state.sessions.map((s, i) => (i === index ? { ...s, ...session } : s)),
      }
    }),

  updateSessionTitle: (sessionId, title) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, title } : s
      ),
    })),

  removeSession: (sessionId) =>
    set((state) => {
      const messages = { ...state.messages }
      const messagesNextCursors = { ...state.messagesNextCursors }
      const messagesLoadingMore = { ...state.messagesLoadingMore }
      delete messages[sessionId]
      delete messagesNextCursors[sessionId]
      delete messagesLoadingMore[sessionId]

      return {
        sessions: state.sessions.filter((s) => s.id !== sessionId),
        activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
        messages,
        messagesNextCursors,
        messagesLoadingMore,
      }
    }),

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  setMessages: (sessionId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: mergeMessages([], messages),
      },
      messagesNextCursors: {
        ...state.messagesNextCursors,
        [sessionId]: null,
      },
    })),

  setMessagesPage: (sessionId, messages, nextCursor, mode = 'replace') =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: mergeMessages(state.messages[sessionId] || [], messages, mode),
      },
      messagesNextCursors: {
        ...state.messagesNextCursors,
        [sessionId]: mode === 'merge'
          ? state.messagesNextCursors[sessionId] || nextCursor || null
          : nextCursor || null,
      },
    })),

  setMessagesLoadingMore: (sessionId, loadingMore) =>
    set((state) => ({
      messagesLoadingMore: {
        ...state.messagesLoadingMore,
        [sessionId]: loadingMore,
      },
    })),

  moveMessages: (fromSessionId, toSessionId) =>
    set((state) => {
      const messages = { ...state.messages }
      const messagesNextCursors = { ...state.messagesNextCursors }
      const messagesLoadingMore = { ...state.messagesLoadingMore }

      messages[toSessionId] = messages[fromSessionId] || []
      messagesNextCursors[toSessionId] = messagesNextCursors[fromSessionId] || null
      messagesLoadingMore[toSessionId] = messagesLoadingMore[fromSessionId] || false

      delete messages[fromSessionId]
      delete messagesNextCursors[fromSessionId]
      delete messagesLoadingMore[fromSessionId]

      return { messages, messagesNextCursors, messagesLoadingMore }
    }),

  addMessage: (sessionId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: mergeMessages(state.messages[sessionId] || [], [message], 'append'),
      },
    })),

  upsertMessage: (sessionId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: mergeMessages(state.messages[sessionId] || [], [message], 'merge'),
      },
    })),

  replaceMessage: (sessionId, oldId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: sortByCreatedAt((state.messages[sessionId] || []).map((m) =>
          m.id === oldId ? { ...m, ...message } : m
        )),
      },
    })),

  clearPendingUserMessageStates: (sessionId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: (state.messages[sessionId] || []).map((message) =>
          message.role === 'USER' &&
          ['sending', 'processing', 'unknown_delivery'].includes(message.state)
            ? { ...message, state: null }
            : message
        ),
      },
    })),

  updateMessageRating: (sessionId, messageId, rating, feedbackComment = '') =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: (state.messages[sessionId] || []).map((m) =>
          m.id === messageId ? { ...m, rating, feedbackComment, feedbackSubmittedAt: new Date().toISOString() } : m
        ),
      },
    })),

  setLoading: (loading) => set({ loading }),
  setProcessingStatus: (processingStatus) => set({
    processingStatus: processingStatus || { processing: false },
  }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setError: (error) => set({ error }),
}))
