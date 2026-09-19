const TEMAS = ['dorado', 'toga']
const KEY = 'legalfam-tema'

export function aplicarTema(tema) {
  const t = TEMAS.includes(tema) ? tema : 'dorado'
  const root = document.documentElement
  if (t === 'dorado') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', t)
  try { localStorage.setItem(KEY, t) } catch { /* modo privado */ }
  return t
}

export function initTema() {
  let inicial = 'dorado'
  try { inicial = localStorage.getItem(KEY) || 'dorado' } catch { /* ignore */ }

  const params = new URLSearchParams(window.location.search)
  const desdeUrl = params.get('tema')
  if (desdeUrl) inicial = desdeUrl

  if (typeof window !== 'undefined') window.setTema = aplicarTema

  return aplicarTema(inicial)
}

export const TEMAS_PUBLICOS = ['dorado', 'toga']

export function temaActual() {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr || 'dorado'
}
