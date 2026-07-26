import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import ResendVerificationButton from '@/components/auth/ResendVerificationButton'
import { authService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'
import styles from './AuthActionPage.module.css'

export default function VerifyEmailPage() {
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
      setError('El enlace no incluye un código de verificación. Solicita uno nuevo.')
      setStatus('error')
      return
    }

    authService
      .verifyEmail({ token })
      .then(() => setStatus('success'))
      .catch((e) => {
        setError(normalizeApiError(e, 'No se pudo verificar tu correo.').message)
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
            <h1 className={styles.title}>Verificando tu correo</h1>
            <p className={styles.text}>Esto toma solo unos segundos.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.icon}>✅</div>
            <h1 className={styles.title}>¡Correo verificado!</h1>
            <p className={styles.text}>
              Tu cuenta está activa. Ya puedes iniciar sesión y empezar a consultar.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/?auth=login')}
            >
              Iniciar sesión
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.icon}>⚠️</div>
            <h1 className={styles.title}>No pudimos verificar tu correo</h1>
            <p className={styles.text}>{error}</p>

            <div className={styles.form}>
              <div className={styles.fg}>
                <label htmlFor="ve-email">Correo electrónico</label>
                <input
                  id="ve-email" type="email"
                  placeholder="tucorreo@ejemplo.com"
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
              Volver a iniciar sesión
            </button>
          </>
        )}
      </div>
    </div>
  )
}
