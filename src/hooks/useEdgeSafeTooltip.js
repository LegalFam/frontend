import { useCallback, useLayoutEffect, useRef } from 'react'

const DEFAULT_MARGIN = 12

/**
 * Mantiene un tooltip absoluto dentro de la pantalla.
 *
 * Los tooltips se anclan al elemento que los dispara, así que cuando ese
 * elemento queda cerca de un borde (algo habitual en móvil) el globo se corta.
 * Este hook mide la posición real del tooltip y publica el desplazamiento
 * horizontal necesario en la variable CSS `--tip-shift`, que el estilo suma a
 * su offset (`left` / `right`). Se usa el offset y no `transform` a propósito:
 * el transform está animado, así que medirlo daría valores intermedios.
 *
 * Devuelve la ref para el tooltip y un `recalc` para volver a medir cuando el
 * contenido o el ancho del contenedor pudieron cambiar (hover, focus, etc.).
 */
export function useEdgeSafeTooltip(margin = DEFAULT_MARGIN) {
  const ref = useRef(null)
  const shiftRef = useRef(0)

  const recalc = useCallback(() => {
    const el = ref.current
    if (!el) return

    const applied = shiftRef.current
    const rect = el.getBoundingClientRect()
    // Posición que tendría el tooltip sin el desplazamiento ya aplicado.
    const left = rect.left - applied
    const right = rect.right - applied
    const viewport = document.documentElement.clientWidth

    let shift = 0
    if (left < margin) {
      shift = margin - left
    } else if (right > viewport - margin) {
      // Si aun así no entra, se prioriza no cortar el inicio del texto.
      shift = Math.max(viewport - margin - right, margin - left)
    }

    if (Math.abs(shift - applied) < 0.5) return
    shiftRef.current = shift
    el.style.setProperty('--tip-shift', `${shift}px`)
  }, [margin])

  useLayoutEffect(() => {
    recalc()
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [recalc])

  return { ref, recalc }
}
