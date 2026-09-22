import { useState } from 'react'
import { translationNotice, languageByCode } from '@/i18n/languages'
import { tIn, useT } from '@/i18n/translate'
import styles from './BilingualLegalText.module.css'

export function TranslationNotice({ language, showingSpanish, onToggle, className = '', above = false }) {
  const t = useT()
  if (!language || language === 'es') return null

  const notice = translationNotice(language)
  const label = languageByCode(language).label

  return (
    <div className={`${styles.notice} ${above ? styles.noticeAbove : ''} ${className}`}>
      <div className={styles.noticeText}>
        {notice.own && <span lang={language}>{notice.own}</span>}
        <span className={styles.noticeSpanish}>{notice.spanish}</span>
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={onToggle}
        aria-pressed={showingSpanish}
      >
        {showingSpanish ? t('comun.verEn', { idioma: label }) : t('comun.verEnEspanol')}
      </button>
    </div>
  )
}

export default function BilingualLegalText({ children, className = '', noticeClassName = '' }) {
  const t = useT()
  const [showingSpanish, setShowingSpanish] = useState(false)
  const isTranslated = t.language !== 'es'
  const textLanguage = isTranslated && !showingSpanish ? t.language : 'es'
  const tLegal = (key, vars) => tIn(textLanguage, key, vars)

  return (
    <div className={className} lang={textLanguage}>
      {children(tLegal)}
      {isTranslated && (
        <TranslationNotice
          language={t.language}
          showingSpanish={showingSpanish}
          onToggle={() => setShowingSpanish((open) => !open)}
          className={noticeClassName}
        />
      )}
    </div>
  )
}
