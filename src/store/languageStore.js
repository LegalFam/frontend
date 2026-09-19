import { create } from 'zustand'
import { isSupportedLanguage, saveLanguage, readLanguage } from '@/i18n/languages'

export function applyDocumentLanguage(code) {
  const language = saveLanguage(code)
  if (typeof document !== 'undefined') document.documentElement.lang = language
  return language
}

export const useLanguageStore = create((set) => ({
  language: applyDocumentLanguage(readLanguage()),
  changeLanguage: (code) => {
    if (!isSupportedLanguage(code)) return
    set({ language: applyDocumentLanguage(code) })
  },
}))

export const currentLanguage = () => useLanguageStore.getState().language

export function initLanguage() {
  return useLanguageStore.getState().language
}
