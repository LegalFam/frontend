// Selector de tema. DORADO es el de siempre (no lleva atributo); el resto
// son variantes de evaluación que se activan con data-theme en <html>:
//   - dorado-lighter : mismo acento dorado, fondos más claros
//   - marino         : acento azul marino, fondos azul acero
//   - toga           : estética abogado — marino de sala de juntas, acento latón champagne
//
// Cómo probar durante la evaluación:
//   - abrir la app con ?tema=marino  (o ?tema=dorado para volver)
//   - o desde la consola:  setTema('marino')  /  setTema('dorado')
// La elección queda guardada en localStorage.

const TEMAS = ['dorado', 'dorado-lighter', 'marino', 'toga']
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
