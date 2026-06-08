import { useState } from 'react'
import logoImg from '@/assets/logo-transparent.png'
import { useAuth } from '@/hooks/useAuth'
import styles from './AuthModal.module.css'

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { signin, loading, error } = useAuth()
  const [fields, setFields] = useState({ email: '', password: '' })
  const [errs,   setErrs]   = useState({})

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
            <input
              id="li-pass" type="password"
              placeholder="••••••••"
              value={fields.password}
              onChange={(e) => set('password', e.target.value)}
              className={errs.password ? styles.hasError : ''}
              autoComplete="current-password"
            />
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
