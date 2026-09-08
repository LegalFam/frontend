// Idioma activo de la aplicacion: decide tanto en que lengua se lee la interfaz como en que
// lengua se pide la orientacion legal. Es una sola preferencia porque el espanol sigue siendo
// la version que prevalece en ambos casos (ver i18n/languages.js), asi que separar "UI en
// espanol / respuestas en quechua" no aportaria nada y obligaria a explicar dos conceptos.
//
// La persistencia vive entera en i18n/languages.js (readLanguage/saveLanguage, clave
// 'legalfam-idioma'); este store no toca localStorage. Quien ya tenia elegido un idioma de
// respuesta se encuentra la interfaz en esa misma lengua, sin migracion.
//
// Ojo: el idioma de la interfaz NO es el idioma de un mensaje. Cada mensaje guarda su propio
// `language` en el servidor y se renderiza segun ese campo para siempre; cambiar el idioma de
// la interfaz no reescribe conversaciones pasadas.

import { create } from 'zustand'
import { isSupportedLanguage, saveLanguage, readLanguage } from '@/i18n/languages'

// Misma forma que aplicarTema() en theme.js: validar, mutar <html>, persistir, devolver.
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

// Lectura fuera de React (utils/apiError.js, utils/plans.js, hooks/useChat.js): son funciones
// planas que se llaman desde bloques catch, no componentes, y necesitan el idioma del momento.
export const currentLanguage = () => useLanguageStore.getState().language

// Se llama desde main.jsx junto a initTema(): fuerza la creacion del store antes del primer
// render para que <html lang> ya sea correcto cuando se pinta la pagina.
export function initLanguage() {
  return useLanguageStore.getState().language
}
