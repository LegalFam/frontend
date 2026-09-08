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
import catalogos from './locales'

const POR_DEFECTO = 'es'
const avisadas = new Set()

// Camina el objeto anidado con una clave con puntos: 'chat.input.enviar'.
function buscar(catalogo, clave) {
  let nodo = catalogo
  for (const parte of clave.split('.')) {
    if (nodo == null || typeof nodo !== 'object') return undefined
    nodo = nodo[parte]
  }
  return typeof nodo === 'string' ? nodo : undefined
}

function interpolar(texto, vars) {
  if (!vars) return texto
  // Un placeholder sin valor se queda visible tal cual ({{fecha}}): falla fuerte, no en silencio.
  return texto.replace(/\{\{(\w+)\}\}/g, (crudo, nombre) =>
    vars[nombre] === undefined || vars[nombre] === null ? crudo : String(vars[nombre])
  )
}

// Resuelve sin red de seguridad. Devuelve undefined si la clave no existe en ese idioma.
function crudo(idioma, clave) {
  return buscar(catalogos[idioma] || catalogos[POR_DEFECTO], clave)
}

// Traduce en un idioma explicito. Lo necesitan el texto legal bilingue (que pide el espanol
// aunque la interfaz este en otra lengua) y cualquier sitio donde el idioma no sea el ambiental.
export function tEn(idioma, clave, vars) {
  const propio = crudo(idioma, clave)
  if (propio !== undefined) return interpolar(propio, vars)

  const espanol = crudo(POR_DEFECTO, clave)
  if (espanol !== undefined) {
    // En produccion se cae al espanol, que es lo correcto en este producto: el espanol
    // prevalece. En desarrollo se marca para que no pase inadvertido.
    if (import.meta.env.DEV) {
      const marca = `${idioma}:${clave}`
      if (!avisadas.has(marca)) {
        avisadas.add(marca)
        console.warn(`[i18n] falta la clave "${clave}" en "${idioma}"; se muestra el espanol`)
      }
    }
    return interpolar(espanol, vars)
  }

  if (import.meta.env.DEV) {
    if (!avisadas.has(clave)) {
      avisadas.add(clave)
      console.warn(`[i18n] clave inexistente: "${clave}"`)
    }
    return `⟦${clave}⟧`
  }
  return ''
}

// Traduce en el idioma activo. Para usar fuera de React; dentro de componentes va useT(), que
// ademas suscribe al cambio de idioma.
export function t(clave, vars) {
  return tEn(useLanguageStore.getState().idioma, clave, vars)
}

// Variante que devuelve undefined cuando la clave no existe en ningun catalogo, en vez de una
// marca o un string vacio. La usa utils/apiError.js, donde el resultado alimenta la cadena
// `clientMessage || serverMessage || fallbackMessage`: si devolviera la clave, esa cadena se
// cortaria y el usuario veria "errores.algun_codigo" en pantalla.
export function tOpcional(clave, vars) {
  const idioma = useLanguageStore.getState().idioma
  const texto = crudo(idioma, clave) ?? crudo(POR_DEFECTO, clave)
  return texto === undefined ? undefined : interpolar(texto, vars)
}

// Plurales con par explicito de claves (`_one` / `_other`). No hace falta un motor de reglas:
// el espanol distingue una forma de otra y el quechua y el aymara aportan solo `_other`.
export function tPlural(base, n, vars) {
  const idioma = useLanguageStore.getState().idioma
  const sufijo = n === 1 && idioma === POR_DEFECTO ? '_one' : '_other'
  return tEn(idioma, `${base}${sufijo}`, { n, ...vars })
}

// Hook para componentes: devuelve un t() ligado al idioma suscrito, de modo que el componente
// se vuelve a renderizar al cambiar de idioma.
export function useT() {
  const idioma = useLanguageStore((estado) => estado.idioma)
  const traducir = (clave, vars) => tEn(idioma, clave, vars)
  traducir.idioma = idioma
  traducir.plural = (base, n, vars) =>
    tEn(idioma, `${base}${n === 1 && idioma === POR_DEFECTO ? '_one' : '_other'}`, { n, ...vars })
  traducir.en = tEn
  return traducir
}
