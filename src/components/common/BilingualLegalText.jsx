import { useState } from 'react'
import { TRANSLATION_NOTICE, translationNotice, languageByCode } from '@/i18n/languages'
import { tIn, useT } from '@/i18n/translate'
import styles from './BilingualLegalText.module.css'

// Tira de aviso + conmutador que acompana a todo texto traducido a maquina. Estaba escrita a
// mano dentro de ChatMessage; vive aqui para que la convencion tenga una sola implementacion,
// porque ahora la usan tambien los terminos, el glosario y los avisos legales de la interfaz.
// `above` invierte el margen para cuando la tira precede al texto que advierte en lugar de
// seguirlo, como pasa en el chat.
export function TranslationNotice({ language, showingSpanish, onToggle, className = '', above = false }) {
  const t = useT()
  if (!language || language === 'es') return null

  const notice = translationNotice(language)
  const label = languageByCode(language).label

  return (
    <div className={`${styles.notice} ${above ? styles.noticeAbove : ''} ${className}`}>
      <div className={styles.noticeText}>
        {/* El aviso en la lengua del usuario primero: uno en espanol no cumple su funcion con
            quien eligio no leer en espanol. */}
        {notice.own && <span lang={language}>{notice.own}</span>}
        <span className={styles.noticeSpanish}>{TRANSLATION_NOTICE}</span>
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

// Envoltorio para el texto normativo de la interfaz: terminos, definiciones del glosario y
// avisos legales. Muestra la traduccion y deja el espanol a un clic, porque el espanol es la
// version que prevalece y quien lea la traduccion tiene que poder contrastarla.
//
// Uso: <BilingualLegalText>{(t) => <p>{t('terminos.uso.texto')}</p>}</BilingualLegalText>
// El `t` que recibe resuelve en espanol mientras el conmutador este activo; el resto de la
// interfaz alrededor sigue en el idioma elegido.
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
