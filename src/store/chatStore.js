import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  sessions:        [],
  activeSessionId: null,
  messages:        {},   // { [sessionId]: Message[] }
  loading:         false,
  connectionState: 'idle',
  error:           null,

  setSessions: (sessions) => set({ sessions }),

  addSession: (session) =>
    set((state) => ({
      sessions: state.sessions.some((s) => s.id === session.id)
        ? state.sessions
        : [session, ...state.sessions],
    })),

  updateSessionName: (sessionId, name) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, name } : s
      ),
    })),

  removeSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      activeSessionId:
        state.activeSessionId === sessionId ? null : state.activeSessionId,
    })),

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  setMessages: (sessionId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [sessionId]: messages },
    })),

  moveMessages: (fromSessionId, toSessionId) =>
    set((state) => {
      const next = { ...state.messages }
      next[toSessionId] = next[fromSessionId] || []
      delete next[fromSessionId]
      return { messages: next }
    }),

  addMessage: (sessionId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: [...(state.messages[sessionId] || []), message],
      },
    })),

  upsertMessage: (sessionId, message) =>
    set((state) => {
      const current = state.messages[sessionId] || []
      const index = current.findIndex((m) => m.id === message.id)
      const next = index === -1
        ? [...current, message]
        : current.map((m, i) => (i === index ? { ...m, ...message } : m))
      return { messages: { ...state.messages, [sessionId]: next } }
    }),

  replaceMessage: (sessionId, oldId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: (state.messages[sessionId] || []).map((m) =>
          m.id === oldId ? { ...m, ...message } : m
        ),
      },
    })),

  updateMessageRating: (sessionId, messageId, rating) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: (state.messages[sessionId] || []).map((m) =>
          m.id === messageId ? { ...m, rating } : m
        ),
      },
    })),

  setLoading: (loading) => set({ loading }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setError: (error) => set({ error }),
}))
