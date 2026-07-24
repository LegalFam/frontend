import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { useAuth } from '@/hooks/useAuth'
import styles from './AuthModal.module.css'

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { signup, loading, error } = useAuth()
  const [fields, setFields] = useState({
    nombre: '', apellido: '', email: '', phone: '', password: '', confirm: '',
    acceptedTerms: false,
  })
  const [errs, setErrs] = useState({})

  const set = (k, v) => setFields((p) => ({ ...p, [k]: v }))

  const handlePhone = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 9)
    set('phone', val)
  }

  const validate = () => {
    const e = {}
    if (!fields.nombre.trim())                            e.nombre   = 'Campo requerido.'
    if (!fields.apellido.trim())                          e.apellido = 'Campo requerido.'
    if (!fields.email || !fields.email.includes('@'))     e.email    = 'Ingresa un correo válido.'
    if (!fields.phone || fields.phone.length !== 9)       e.phone    = 'Exactamente 9 dígitos.'
    if (!fields.password || fields.password.length < 8)   e.password = 'Mínimo 8 caracteres.'
    if (fields.password !== fields.confirm)               e.confirm  = 'Las contraseñas no coinciden.'
    if (!fields.acceptedTerms)                            e.acceptedTerms = 'Debes aceptar los términos para continuar.'
    setErrs(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await signup({
      nombre: fields.nombre, apellido: fields.apellido,
      email: fields.email, phone: fields.phone, password: fields.password,
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        <div className={styles.topBar}>
          <img src={logoImg} alt="LegalFam" />
          <span className={styles.logo}>LEGALFAM</span>
        </div>

        <h2 className={styles.title}>Crear cuenta</h2>
        <p className={styles.subtitle}>Regístrate gratis y empieza a consultar</p>

        {error && <div className="api-err">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <div className={styles.fg}>
              <label htmlFor="rg-nombre">Nombre</label>
              <input id="rg-nombre" type="text" placeholder="María"
                value={fields.nombre} onChange={(e) => set('nombre', e.target.value)}
                className={errs.nombre ? styles.hasError : ''} autoComplete="given-name" />
              {errs.nombre && <span className="field-err">{errs.nombre}</span>}
            </div>
            <div className={styles.fg}>
              <label htmlFor="rg-apellido">Apellido</label>
              <input id="rg-apellido" type="text" placeholder="García"
                value={fields.apellido} onChange={(e) => set('apellido', e.target.value)}
                className={errs.apellido ? styles.hasError : ''} autoComplete="family-name" />
              {errs.apellido && <span className="field-err">{errs.apellido}</span>}
            </div>
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-email">Correo electrónico</label>
            <input id="rg-email" type="email" placeholder="tucorreo@ejemplo.com"
              value={fields.email} onChange={(e) => set('email', e.target.value)}
              className={errs.email ? styles.hasError : ''} autoComplete="email" />
            {errs.email && <span className="field-err">{errs.email}</span>}
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-phone">Número de celular</label>
            <div className={styles.phoneRow}>
              <span className={styles.phonePfx}>
                <span className={styles.flag}>🇵🇪</span> +51
              </span>
              <div style={{ flex: 1 }}>
                <input id="rg-phone" type="tel" placeholder="987654321"
                  value={fields.phone} onChange={handlePhone} maxLength={9}
                  className={errs.phone ? styles.hasError : ''} style={{ width: '100%' }}
                  autoComplete="tel" />
                {errs.phone && <span className="field-err">{errs.phone}</span>}
              </div>
            </div>
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-pass">Contraseña</label>
            <input id="rg-pass" type="password" placeholder="Mínimo 8 caracteres"
              value={fields.password} onChange={(e) => set('password', e.target.value)}
              className={errs.password ? styles.hasError : ''} autoComplete="new-password" />
            {errs.password && <span className="field-err">{errs.password}</span>}
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-confirm">Confirmar contraseña</label>
            <input id="rg-confirm" type="password" placeholder="Repite tu contraseña"
              value={fields.confirm} onChange={(e) => set('confirm', e.target.value)}
              className={errs.confirm ? styles.hasError : ''} autoComplete="new-password" />
            {errs.confirm && <span className="field-err">{errs.confirm}</span>}
          </div>

          <div className={styles.consent}>
            <label className={styles.checkboxRow} htmlFor="rg-terms">
              <input
                id="rg-terms"
                type="checkbox"
                checked={fields.acceptedTerms}
                onChange={(e) => set('acceptedTerms', e.target.checked)}
              />
              <span>
                Acepto los{' '}
                <Link to="/terminos" target="_blank" rel="noreferrer">Términos y Condiciones</Link>
                {' '}y el tratamiento de mis datos personales.
              </span>
            </label>
            {errs.acceptedTerms && <span className="field-err">{errs.acceptedTerms}</span>}
            <p className={styles.consentNote}>
              Tus datos se tratan conforme a la Ley N.° 29733. No compartimos ni vendemos tu
              información personal a terceros, y tus consultas se procesan de forma anonimizada.
            </p>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className={styles.switchText}>
          ¿Ya tienes cuenta? <span onClick={onSwitchToLogin}>Inicia sesión</span>
        </p>
      </div>
    </div>
  )
}
