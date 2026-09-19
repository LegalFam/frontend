import { useCallback, useLayoutEffect, useRef } from 'react'

const DEFAULT_MARGIN = 12

export function useEdgeSafeTooltip(margin = DEFAULT_MARGIN) {
  const ref = useRef(null)
  const shiftRef = useRef(0)

  const recalc = useCallback(() => {
    const el = ref.current
    if (!el) return

    const applied = shiftRef.current
    const rect = el.getBoundingClientRect()
    const left = rect.left - applied
    const right = rect.right - applied
    const viewport = document.documentElement.clientWidth

    let shift = 0
    if (left < margin) {
      shift = margin - left
    } else if (right > viewport - margin) {
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
