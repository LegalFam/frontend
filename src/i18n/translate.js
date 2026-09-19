// Nunca llamar a t() en el scope del módulo: quedaría fijado al idioma de arranque.

import { useLanguageStore } from '@/store/languageStore'
import catalogs from './locales'

const DEFAULT_CODE = 'es'
const warned = new Set()

function lookup(catalog, key) {
  let node = catalog
  for (const part of key.split('.')) {
    if (node == null || typeof node !== 'object') return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

function interpolate(text, vars) {
  if (!vars) return text
  return text.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    vars[name] === undefined || vars[name] === null ? match : String(vars[name])
  )
}

function raw(language, key) {
  return lookup(catalogs[language] || catalogs[DEFAULT_CODE], key)
}

export function tIn(language, key, vars) {
  const own = raw(language, key)
  if (own !== undefined) return interpolate(own, vars)

  const spanish = raw(DEFAULT_CODE, key)
  if (spanish !== undefined) {
    if (import.meta.env.DEV) {
      const mark = `${language}:${key}`
      if (!warned.has(mark)) {
        warned.add(mark)
        console.warn(`[i18n] falta la clave "${key}" en "${language}"; se muestra el espanol`)
      }
    }
    return interpolate(spanish, vars)
  }

  if (import.meta.env.DEV) {
    if (!warned.has(key)) {
      warned.add(key)
      console.warn(`[i18n] clave inexistente: "${key}"`)
    }
    return `⟦${key}⟧`
  }
  return ''
}

export function t(key, vars) {
  return tIn(useLanguageStore.getState().language, key, vars)
}

export function tOptional(key, vars) {
  const language = useLanguageStore.getState().language
  const text = raw(language, key) ?? raw(DEFAULT_CODE, key)
  return text === undefined ? undefined : interpolate(text, vars)
}

export function tPlural(base, n, vars) {
  const language = useLanguageStore.getState().language
  const suffix = n === 1 && language === DEFAULT_CODE ? '_one' : '_other'
  return tIn(language, `${base}${suffix}`, { n, ...vars })
}

export function useT() {
  const language = useLanguageStore((state) => state.language)
  const translate = (key, vars) => tIn(language, key, vars)
  translate.language = language
  translate.plural = (base, n, vars) =>
    tIn(language, `${base}${n === 1 && language === DEFAULT_CODE ? '_one' : '_other'}`, { n, ...vars })
  translate.in = tIn
  return translate
}
