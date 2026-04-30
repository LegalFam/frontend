import { useRef } from 'react'
import styles from './ChatInput.module.css'

export default function ChatInput({ onSend, disabled }) {
  const ref = useRef(null)

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
      <p className={styles.note}>
        LegalFam brinda orientación informativa, no reemplaza el asesoramiento de un abogado titulado.
      </p>
    </div>
  )
}
