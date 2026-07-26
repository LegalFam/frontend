import { useState } from 'react'
import logoImg from '@/assets/logo-transparent.png'
import { authService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'
import styles from './AuthModal.module.css'

export default function ForgotPasswordModal({ onClose, onSwitchToLogin, initialEmail = '' }) {
  const [email, setEmail] = useState(initialEmail)
  const [fieldErr, setFieldErr] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!email || !email.includes('@')) {
      setFieldErr('Ingresa un correo válido.')
      return
    }
    setFieldErr(null)
    setError(null)
    setLoading(true)
    try {
      await authService.forgotPassword({ email })
      // The response is identical for registered and unknown addresses.
      setSent(true)
    } catch (e) {
      setError(normalizeApiError(e, 'No se pudo enviar el correo.').message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        <div className={styles.topBar}>
          <img src={logoImg} alt="LegalFam" />
          <span className={styles.logo}>LEGALFAM</span>
        </div>

        {sent ? (
          <>
            <h2 className={styles.title}>Revisa tu correo</h2>
            <div className={styles.notice}>
              <div className={styles.noticeIcon}>✉️</div>
              <p className={styles.noticeText}>
                Si <strong>{email}</strong> está registrado, te enviamos un enlace para
                restablecer tu contraseña.
              </p>
              <p className={styles.noticeHint}>
                Revisa también la carpeta de spam. El enlace vence en 1 hora.
              </p>
            </div>
            <p className={styles.switchText}>
              <span onClick={onSwitchToLogin}>Volver a iniciar sesión</span>
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>¿Olvidaste tu contraseña?</h2>
            <p className={styles.subtitle}>
              Ingresa tu correo y te enviaremos un enlace para crear una nueva.
            </p>

            {error && <div className="api-err">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.fg}>
                <label htmlFor="fp-email">Correo electrónico</label>
                <input
                  id="fp-email" type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErr ? styles.hasError : ''}
                  autoComplete="email"
                />
                {fieldErr && <span className="field-err">{fieldErr}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            <p className={styles.switchText}>
              ¿Recordaste tu contraseña? <span onClick={onSwitchToLogin}>Inicia sesión</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
