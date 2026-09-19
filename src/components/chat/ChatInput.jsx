import { useEffect, useRef, useState } from 'react'
import { useT } from '@/i18n/translate'
import { useLanguageStore } from '@/store/languageStore'
import styles from './ChatInput.module.css'

// Debe ir a la par con ChatPrivacyPolicy del backend.
const personalDataPattern = new RegExp([
  '\\b[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}\\b',
  '(?:\\+?51[\\s.-]?)?9\\d{2}[\\s.-]?\\d{3}[\\s.-]?\\d{3}(?!\\d)',
  '\\b0\\d{1,2}(?:[\\s.-]?\\d{6,7}|[\\s.\\-)]\\s?\\d{3}[\\s.-]?\\d{4})\\b',
  '\\b\\d{8}\\b',
  '\\b(?:av|avenida|jr|jiron|calle|pasaje|mz|manzana|lote)\\b\\.?[^\\n\\d-]{0,25}?\\d',
].join('|'), 'i')

export default function ChatInput({ onSend, disabled, disabledReason, draft = null }) {
  const t = useT()
  const ref = useRef(null)
  const [privacyError, setPrivacyError] = useState(null)
  const idioma = useLanguageStore((state) => state.language)
  const appliedDraftTsRef = useRef(0)

  const autoResize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    // scrollHeight no cuenta los bordes de una caja border-box.
    const bordes = el.offsetHeight - el.clientHeight
    const alto = el.scrollHeight + bordes
    el.style.height = Math.min(alto, 150) + 'px'
    el.style.overflowY = alto > 150 ? 'auto' : 'hidden'
  }

  useEffect(() => {
    const el = ref.current
    if (!el || !draft?.text) return
    if (appliedDraftTsRef.current === draft.ts) return
    appliedDraftTsRef.current = draft.ts
    if (el.value.trim()) return
    el.value = draft.text
    autoResize()
    if (!disabled) el.focus()
  }, [draft, disabled])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    const text = ref.current?.value.trim()
    if (!text || disabled) return
    if (personalDataPattern.test(text)) {
      setPrivacyError(t('chat.input.datosPersonales'))
      return
    }
    setPrivacyError(null)
    onSend(text, idioma)
    ref.current.value = ''
    autoResize()
  }

  return (
    <div className={styles.area}>
      <div className={styles.wrap}>
        <textarea
          ref={ref}
          rows={1}
          placeholder={disabled ? t('chat.input.placeholderEsperando') : t('chat.input.placeholder')}
          onKeyDown={handleKey}
          onInput={autoResize}
          disabled={disabled}
          className={styles.textarea}
        />
        <span
          className={styles.sendControl}
          data-tooltip={disabledReason || undefined}
        >
          <button
            className={styles.sendBtn}
            onClick={submit}
            disabled={disabled}
            aria-label={disabled ? t('chat.input.preparando') : t('chat.input.enviar')}
            aria-describedby={disabledReason ? 'chat-send-status' : undefined}
          >
            {disabled ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
          {disabledReason && (
            <span id="chat-send-status" className={styles.tooltip} role="status">
              {disabledReason}
            </span>
          )}
        </span>
      </div>
      {privacyError && <p className={styles.privacyError}>{privacyError}</p>}
      <div className={styles.footer}>
        <p className={styles.note}>{t('chat.input.nota')}</p>
      </div>
    </div>
  )
}
