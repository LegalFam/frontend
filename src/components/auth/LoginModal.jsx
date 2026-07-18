import { useState } from 'react'
import logoImg from '@/assets/logo-transparent.png'
import { useAuth } from '@/hooks/useAuth'
import styles from './AuthModal.module.css'

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { signin, loading, error } = useAuth()
  const [fields, setFields] = useState({ email: '', password: '' })
  const [errs,   setErrs]   = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const set = (k, v) => setFields((p) => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!fields.email || !fields.email.includes('@')) e.email = 'Ingresa un correo válido.'
    if (!fields.password) e.password = 'La contraseña es requerida.'
    setErrs(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await signin({ email: fields.email, password: fields.password })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        <div className={styles.topBar}>
          <img src={logoImg} alt="LegalFam" />
          <span className={styles.logo}>LEGALFAM</span>
        </div>

        <h2 className={styles.title}>Iniciar sesión</h2>
        <p className={styles.subtitle}>Accede a tu cuenta para continuar</p>

        {error && <div className="api-err">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.fg}>
            <label htmlFor="li-email">Correo electrónico</label>
            <input
              id="li-email" type="email"
              placeholder="tucorreo@ejemplo.com"
              value={fields.email}
              onChange={(e) => set('email', e.target.value)}
              className={errs.email ? styles.hasError : ''}
              autoComplete="email"
            />
            {errs.email && <span className="field-err">{errs.email}</span>}
          </div>

          <div className={styles.fg}>
            <label htmlFor="li-pass">Contraseña</label>
            <div className={styles.passwordWrap}>
              <input
                id="li-pass" type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={fields.password}
                onChange={(e) => set('password', e.target.value)}
                className={errs.password ? styles.hasError : ''}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.4 18.4 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                    <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errs.password && <span className="field-err">{errs.password}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>Ingresando...</>
            ) : (
              <>
                Ingresar
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <span onClick={onSwitchToRegister}>Regístrate gratis</span>
        </p>
      </div>
    </div>
  )
}
