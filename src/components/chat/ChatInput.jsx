import { useEffect, useRef, useState } from 'react'
import { IDIOMAS, guardarIdioma, leerIdioma } from '@/i18n/languages'
import styles from './ChatInput.module.css'

const personalDataPattern = /(\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b)|((?:\+?51\s*)?(?:9\d{2}|0?1|[2-8]\d)(?:[\s.-]*\d){6,8})|(\b\d{8}\b)|(\b(?:av\.?|avenida|jr\.?|jiron|calle|pasaje|mz\.?|manzana|lote)\b)/i

export default function ChatInput({ onSend, disabled, disabledReason, draft = null }) {
  const ref = useRef(null)
  const [privacyError, setPrivacyError] = useState(null)
  // El idioma se elige junto al cuadro de texto, que es donde se decide, y se recuerda entre
  // sesiones en localStorage igual que el tema. No se guarda en el servidor: lo que sí queda
  // en la base de datos es el idioma de cada mensaje ya enviado.
  const [idioma, setIdioma] = useState(leerIdioma)
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
      setPrivacyError('Evita enviar DNI, teléfono, correo o dirección. Describe la situación de forma general.')
      return
    }
    setPrivacyError(null)
    onSend(text, idioma)
    ref.current.value = ''
    ref.current.style.height = 'auto'
  }

  const cambiarIdioma = (codigo) => {
    setIdioma(guardarIdioma(codigo))
  }

  return (
    <div className={styles.area}>
      <div className={styles.wrap}>
        <textarea
          ref={ref}
          rows={1}
          placeholder={disabled ? 'Espera la respuesta anterior para enviar otra consulta...' : 'Escribe tu consulta legal...'}
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
            aria-label={disabled ? 'Respuesta en preparación' : 'Enviar'}
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
        <div className={styles.languagePicker} role="group" aria-label="Idioma de la orientación">
          {IDIOMAS.map((opcion) => (
            <button
              key={opcion.codigo}
              type="button"
              className={`${styles.languageBtn} ${idioma === opcion.codigo ? styles.languageBtnActive : ''}`}
              onClick={() => cambiarIdioma(opcion.codigo)}
              aria-pressed={idioma === opcion.codigo}
              // La etiqueta va en la propia lengua para que se reconozca sin saber español;
              // el nombre en español queda en el title para quien no reconozca la etiqueta.
              title={opcion.nombre}
              lang={opcion.codigo}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
        <p className={styles.note}>
          Los tokens se descuentan cuando la respuesta queda lista. No incluyas datos personales innecesarios.
        </p>
      </div>
    </div>
  )
}
