import { useEffect } from 'react'

export function useEscapeKey(onEscape, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onEscape?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onEscape, enabled])
}
