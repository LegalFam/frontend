// Traduccion de la interfaz. No usa i18next a proposito:
//
//   - Lo que i18next aporta sobre un lookup es su motor de plurales CLDR, y aqui no trabaja:
//     el quechua tiene una sola categoria CLDR ('other') y el aymara no tiene locale CLDR.
//   - i18next trata al espanol como *fallback* ("lo que sale si falta el quechua"). Aqui el
//     espanol es la version canonica que prevalece y que se muestra AL LADO de la traduccion,
//     que es lo contrario de un fallback.
//   - Las funciones planas (utils/apiError.js, utils/plans.js) necesitan traducir sin ser
//     componentes; con el store eso es una linea.
//
// Regla de oro: las claves guardan TEXTO PLANO. La estructura JSX (enlaces, <strong>, listas)
// se queda en el componente y se parte en varias claves. Nunca un enlace a mitad de frase: el
// orden de palabras del quechua rompe cualquier interpolacion de JSX inline.
//
// Otra regla: nunca llamar a t() en el scope de un modulo. Se evaluaria una vez al importar y
// se quedaria congelado en el idioma de arranque. Las constantes de modulo guardan claves y se
// resuelven con t() dentro del render.

import { useLanguageStore } from '@/store/languageStore'
import catalogs from './locales'

const DEFAULT_CODE = 'es'
const warned = new Set()

// Camina el objeto anidado con una clave con puntos: 'chat.input.enviar'.
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
  // Un placeholder sin valor se queda visible tal cual ({{fecha}}): falla fuerte, no en silencio.
  return text.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    vars[name] === undefined || vars[name] === null ? match : String(vars[name])
  )
}

// Resuelve sin red de seguridad. Devuelve undefined si la clave no existe en ese idioma.
function raw(language, key) {
  return lookup(catalogs[language] || catalogs[DEFAULT_CODE], key)
}

// Traduce en un idioma explicito. Lo necesitan el texto legal bilingue (que pide el espanol
// aunque la interfaz este en otra lengua) y cualquier sitio donde el idioma no sea el ambiental.
export function tIn(language, key, vars) {
  const own = raw(language, key)
  if (own !== undefined) return interpolate(own, vars)

  const spanish = raw(DEFAULT_CODE, key)
  if (spanish !== undefined) {
    // En produccion se cae al espanol, que es lo correcto en este producto: el espanol
    // prevalece. En desarrollo se marca para que no pase inadvertido.
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

// Traduce en el idioma activo. Para usar fuera de React; dentro de componentes va useT(), que
// ademas suscribe al cambio de idioma.
export function t(key, vars) {
  return tIn(useLanguageStore.getState().language, key, vars)
}

// Variante que devuelve undefined cuando la clave no existe en ningun catalogo, en vez de una
// marca o un string vacio. La usa utils/apiError.js, donde el resultado alimenta la cadena
// `clientMessage || serverMessage || fallbackMessage`: si devolviera la clave, esa cadena se
// cortaria y el usuario veria "errores.algun_codigo" en pantalla.
export function tOptional(key, vars) {
  const language = useLanguageStore.getState().language
  const text = raw(language, key) ?? raw(DEFAULT_CODE, key)
  return text === undefined ? undefined : interpolate(text, vars)
}

// Plurales con par explicito de claves (`_one` / `_other`). No hace falta un motor de reglas:
// el espanol distingue una forma de otra y el quechua y el aymara aportan solo `_other`.
export function tPlural(base, n, vars) {
  const language = useLanguageStore.getState().language
  const suffix = n === 1 && language === DEFAULT_CODE ? '_one' : '_other'
  return tIn(language, `${base}${suffix}`, { n, ...vars })
}

// Hook para componentes: devuelve un t() ligado al idioma suscrito, de modo que el componente
// se vuelve a renderizar al cambiar de idioma.
export function useT() {
  const language = useLanguageStore((state) => state.language)
  const translate = (key, vars) => tIn(language, key, vars)
  translate.language = language
  translate.plural = (base, n, vars) =>
    tIn(language, `${base}${n === 1 && language === DEFAULT_CODE ? '_one' : '_other'}`, { n, ...vars })
  translate.in = tIn
  return translate
}
