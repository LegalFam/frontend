import { useEffect, useRef, useState } from 'react'
import { useT } from '@/i18n/traducir'
import { useIdiomaStore } from '@/store/idiomaStore'
import styles from './ChatInput.module.css'

const personalDataPattern = /(\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b)|((?:\+?51\s*)?(?:9\d{2}|0?1|[2-8]\d)(?:[\s.-]*\d){6,8})|(\b\d{8}\b)|(\b(?:av\.?|avenida|jr\.?|jiron|calle|pasaje|mz\.?|manzana|lote)\b)/i

export default function ChatInput({ onSend, disabled, disabledReason, draft = null }) {
  const t = useT()
  const ref = useRef(null)
  const [privacyError, setPrivacyError] = useState(null)
  // El idioma vive en el store; el control para cambiarlo está en la barra superior y en
  // Configuración, no aquí. Lo que sí queda en la base de datos es el idioma de cada mensaje
  // ya enviado, que no cambia después aunque se cambie de lengua.
  const idioma = useIdiomaStore((estado) => estado.idioma)
  const appliedDraftTsRef = useRef(0)

  const autoResize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 150) + 'px'
  }

  // Recupera en el input un envío que no llegó a cursar (p. ej. sin tokens). Solo
  // rellena si el usuario no ha escrito ya otra cosa; el nonce `ts` permite
  // reaplicar el mismo texto tras un reintento que vuelve a fallar.
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
    ref.current.style.height = 'auto'
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
