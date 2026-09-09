import { useEffect, useRef, useState } from 'react'
import { useT } from '@/i18n/translate'
import { useLanguageStore } from '@/store/languageStore'
import styles from './ChatInput.module.css'

// Bloqueo de datos identificables antes de que el texto salga del navegador. El backend
// aplica el mismo criterio en ChatPrivacyPolicy: los dos patrones tienen que ir a la par, o
// el usuario recibe un rechazo del servidor después de que el cliente le dejara pasar.
//
// Cada rama pide la forma completa del dato y no un fragmento suelto, porque el falso
// positivo aquí no molesta: impide consultar. Las fechas (12.05.2024), los números de
// expediente (00123-2024-0-1801-JP-FC-01) y la palabra "calle" o "manzana" en una frase
// corriente antes cortaban el envío sin que hubiera ningún dato personal.
const personalDataPattern = new RegExp([
  // correo
  '\\b[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}\\b',
  // celular peruano: nueve dígitos que empiezan por 9, con +51 y separadores opcionales
  '(?:\\+?51[\\s.-]?)?9\\d{2}[\\s.-]?\\d{3}[\\s.-]?\\d{3}(?!\\d)',
  // fijo peruano con prefijo: 01 4451234, 01 445 1234, (01) 445 1234, 084 123456
  '\\b0\\d{1,2}(?:[\\s.-]?\\d{6,7}|[\\s.\\-)]\\s?\\d{3}[\\s.-]?\\d{4})\\b',
  // DNI (y cualquier otro documento de ocho cifras seguidas)
  '\\b\\d{8}\\b',
  // dirección: la palabra sola no basta, tiene que traer un número cerca y sin guiones de
  // por medio, que es lo que distingue "Av. Arequipa 1234" de un código como JR-FC-05
  '\\b(?:av|avenida|jr|jiron|calle|pasaje|mz|manzana|lote)\\b\\.?[^\\n\\d-]{0,25}?\\d',
].join('|'), 'i')

export default function ChatInput({ onSend, disabled, disabledReason, draft = null }) {
  const t = useT()
  const ref = useRef(null)
  const [privacyError, setPrivacyError] = useState(null)
  // El idioma vive en el store; el control para cambiarlo está en la barra superior y en
  // Configuración, no aquí. Lo que sí queda en la base de datos es el idioma de cada mensaje
  // ya enviado, que no cambia después aunque se cambie de lengua.
  const idioma = useLanguageStore((state) => state.language)
  const appliedDraftTsRef = useRef(0)

  const autoResize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    // La caja es border-box y scrollHeight no cuenta los bordes: sin sumarlos el
    // contenido desborda por 1px y sale la barra de scroll con una sola línea.
    const bordes = el.offsetHeight - el.clientHeight
    const alto = el.scrollHeight + bordes
    el.style.height = Math.min(alto, 150) + 'px'
    el.style.overflowY = alto > 150 ? 'auto' : 'hidden'
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
