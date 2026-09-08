import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import ResendVerificationButton from '@/components/auth/ResendVerificationButton'
import { authService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'
import { useT } from '@/i18n/translate'
import styles from './AuthActionPage.module.css'

export default function VerifyEmailPage() {
  const t = useT()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  // The token is single-use and StrictMode runs effects twice in dev; without this
  // guard the second run would report "invalid link" for a link that just worked.
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current) return
    attempted.current = true

    if (!token) {
      setError(t('auth.verificar.sinToken'))
      setStatus('error')
      return
    }

    authService
      .verifyEmail({ token })
      .then(() => setStatus('success'))
      .catch((e) => {
        setError(normalizeApiError(e, t('auth.verificar.errorGenerico')).message)
        setStatus('error')
      })
  }, [token])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.topBar}>
          <img src={logoImg} alt="LegalFam" />
          <span className={styles.logo}>LEGALFAM</span>
        </div>

        {status === 'verifying' && (
          <>
            <div className={styles.spinner} />
            <h1 className={styles.title}>{t('auth.verificar.verificando')}</h1>
            <p className={styles.text}>{t('auth.verificar.espera')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.icon}>✅</div>
            <h1 className={styles.title}>{t('auth.verificar.exito')}</h1>
            <p className={styles.text}>{t('auth.verificar.exitoTexto')}</p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/?auth=login')}
            >
              {t('auth.login.titulo')}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.icon}>⚠️</div>
            <h1 className={styles.title}>{t('auth.verificar.error')}</h1>
            <p className={styles.text}>{error}</p>

            <div className={styles.form}>
              <div className={styles.fg}>
                <label htmlFor="ve-email">{t('auth.campos.correo')}</label>
                <input
                  id="ve-email" type="email"
                  placeholder={t('auth.campos.correoPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <ResendVerificationButton email={email} className={styles.ghostBtn} />
            </div>

            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => navigate('/?auth=login')}
            >
              {t('auth.recuperar.volverIniciar')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
