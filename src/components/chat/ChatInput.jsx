import { useRef, useState } from 'react'
import styles from './ChatInput.module.css'

const personalDataPattern = /(\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b)|((?:\+?51\s*)?(?:9\d{2}|0?1|[2-8]\d)(?:[\s.-]*\d){6,8})|(\b\d{8}\b)|(\b(?:av\.?|avenida|jr\.?|jiron|calle|pasaje|mz\.?|manzana|lote)\b)/i

export default function ChatInput({ onSend, disabled }) {
  const ref = useRef(null)
  const [privacyError, setPrivacyError] = useState(null)

  const autoResize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

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
      setPrivacyError('Evita enviar DNI, telefono, correo o direccion. Describe la situacion de forma general.')
      return
    }
    setPrivacyError(null)
    onSend(text)
    ref.current.value = ''
    ref.current.style.height = 'auto'
  }

  return (
    <div className={styles.area}>
      <div className={styles.wrap}>
        <textarea
          ref={ref}
          rows={1}
          placeholder="Escribe tu consulta legal..."
          onKeyDown={handleKey}
          onInput={autoResize}
          disabled={disabled}
          className={styles.textarea}
        />
        <button
          className={styles.sendBtn}
          onClick={submit}
          disabled={disabled}
          aria-label="Enviar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      {privacyError && <p className={styles.privacyError}>{privacyError}</p>}
      <p className={styles.note}>
        LegalFam brinda orientacion informativa. No incluyas datos personales innecesarios.
      </p>
    </div>
  )
}
