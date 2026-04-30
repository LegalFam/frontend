import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken:  null,
      refreshToken: null,
      user:         null,
      avatarUrl:    null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      setAvatar: (avatarUrl) => set({ avatarUrl }),

      login: (tokens, user) =>
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user }),

      logout: () =>
        set({ accessToken: null, refreshToken: null, user: null, avatarUrl: null }),
    }),
    {
      name: 'legalfam-auth',
      partialize: (state) => ({
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
        user:         state.user,
        avatarUrl:    state.avatarUrl,
      }),
    }
  )
)
