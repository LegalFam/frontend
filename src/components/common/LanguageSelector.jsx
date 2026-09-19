import { useEffect, useRef, useState } from 'react'
import { LANGUAGES, languageByCode } from '@/i18n/languages'
import { useT } from '@/i18n/translate'
import { useLanguageStore } from '@/store/languageStore'
import styles from './LanguageSelector.module.css'

export default function LanguageSelector({ className = '', compact = false }) {
  const t = useT()
  const language = useLanguageStore((state) => state.language)
  const changeLanguage = useLanguageStore((state) => state.changeLanguage)
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    if (!compact || !open) return undefined

    const onPointerOutside = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false)
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onPointerOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [compact, open])

  const options = LANGUAGES.map((option) => (
    <button
      key={option.code}
      type="button"
      className={`${styles.btn} ${language === option.code ? styles.btnActive : ''}`}
      onClick={() => {
        changeLanguage(option.code)
        setOpen(false)
      }}
      aria-pressed={language === option.code}
      title={option.name}
      lang={option.code}
    >
      {option.label}
    </button>
  ))

  if (!compact) {
    return (
      <div className={`${styles.picker} ${className}`} role="group" aria-label={t('comun.idioma')}>
        {options}
      </div>
    )
  }

  const active = languageByCode(language)

  return (
    <div className={`${styles.compact} ${className}`} ref={boxRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        title={t('comun.idioma')}
        lang={active.code}
      >
        {active.label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles.menu} role="group" aria-label={t('comun.idioma')}>
          {options}
        </div>
      )}
    </div>
  )
}
