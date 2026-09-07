import { useState } from 'react'
import logoImg from '@/assets/logo-transparent.png'
import { authService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'
import { useT } from '@/i18n/traducir'
import styles from './AuthModal.module.css'

export default function ForgotPasswordModal({ onClose, onSwitchToLogin, initialEmail = '' }) {
  const t = useT()
  const [email, setEmail] = useState(initialEmail)
  const [fieldErr, setFieldErr] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!email || !email.includes('@')) {
      setFieldErr(t('auth.validacion.correoInvalido'))
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
      setError(normalizeApiError(e, t('auth.recuperar.errorEnvio')).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label={t('comun.cerrar')}>✕</button>

        <div className={styles.topBar}>
          <img src={logoImg} alt="LegalFam" />
          <span className={styles.logo}>LEGALFAM</span>
        </div>

        {sent ? (
          <>
            <h2 className={styles.title}>{t('auth.recuperar.revisaCorreo')}</h2>
            <div className={styles.notice}>
              <div className={styles.noticeIcon}>✉️</div>
              <p className={styles.noticeText}>{t('auth.recuperar.siRegistrado', { correo: email })}</p>
              <p className={styles.noticeHint}>{t('auth.recuperar.revisaSpam')}</p>
            </div>
            <p className={styles.switchText}>
              <span onClick={onSwitchToLogin}>{t('auth.recuperar.volverIniciar')}</span>
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>{t('auth.recuperar.titulo')}</h2>
            <p className={styles.subtitle}>{t('auth.recuperar.subtitulo')}</p>

            {error && <div className="api-err">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.fg}>
                <label htmlFor="fp-email">{t('auth.campos.correo')}</label>
                <input
                  id="fp-email" type="email"
                  placeholder={t('auth.campos.correoPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErr ? styles.hasError : ''}
                  autoComplete="email"
                />
                {fieldErr && <span className="field-err">{fieldErr}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? t('auth.recuperar.enviando') : t('auth.recuperar.enviar')}
              </button>
            </form>

            <p className={styles.switchText}>
              {t('auth.recuperar.recordaste')} <span onClick={onSwitchToLogin}>{t('auth.recuperar.inicia')}</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
