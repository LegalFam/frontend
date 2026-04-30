import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  sessions:        [],
  activeSessionId: null,
  messages:        {},   // { [sessionId]: Message[] }
  loading:         false,

  setSessions: (sessions) => set({ sessions }),

  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),

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

  addMessage: (sessionId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [sessionId]: [...(state.messages[sessionId] || []), message],
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
}))
