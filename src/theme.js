// Selector de tema. El tema DORADO es el de siempre (no lleva atributo);
// MARINO es una variante de evaluación con azul marino en vez del dorado.
//
// Cómo probar durante la evaluación:
//   - abrir la app con ?tema=marino  (o ?tema=dorado para volver)
//   - o desde la consola:  setTema('marino')  /  setTema('dorado')
// La elección queda guardada en localStorage.

const TEMAS = ['dorado', 'marino']
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

  // helper global para alternar el tema durante la evaluación
  if (typeof window !== 'undefined') window.setTema = aplicarTema

  return aplicarTema(inicial)
}
