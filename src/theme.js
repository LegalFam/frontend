// Selector de tema. DORADO es el de siempre (no lleva atributo); TOGA se activa
// con data-theme en <html>:
//   - toga : estética abogado — marino de sala de juntas, acento latón champagne
//
// Además de Configuración, se puede alternar con ?tema=toga (o ?tema=dorado para
// volver) o desde la consola con setTema('toga').
// La elección queda guardada en localStorage; un tema desconocido cae en dorado.

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

  // helper global para alternar el tema durante la evaluación
  if (typeof window !== 'undefined') window.setTema = aplicarTema

  return aplicarTema(inicial)
}

// Temas ofrecidos al usuario en Configuración: hoy son todos los que existen.
export const TEMAS_PUBLICOS = [
  {
    id: 'dorado',
    nombre: 'Clásico',
    descripcion: 'Negro profundo y acento dorado, la identidad original de LegalFam.',
  },
  {
    id: 'toga',
    nombre: 'Moderno',
    descripcion: 'Azul marino sereno y acento en latón champagne.',
  },
]

export function temaActual() {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr || 'dorado'
}
