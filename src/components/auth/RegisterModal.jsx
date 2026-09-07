import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { useAuth } from '@/hooks/useAuth'
import ResendVerificationButton from './ResendVerificationButton'
import { useT } from '@/i18n/traducir'
import styles from './AuthModal.module.css'

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const t = useT()
  const { signup, loading, error } = useAuth()
  const [fields, setFields] = useState({
    nombre: '', apellido: '', email: '', phone: '', password: '', confirm: '',
    acceptedTerms: false,
  })
  const [errs, setErrs] = useState({})
  const [registeredEmail, setRegisteredEmail] = useState(null)

  const set = (k, v) => setFields((p) => ({ ...p, [k]: v }))

  const handlePhone = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 9)
    set('phone', val)
  }

  const validate = () => {
    const e = {}
    if (!fields.nombre.trim())                            e.nombre   = t('auth.validacion.requerido')
    if (!fields.apellido.trim())                          e.apellido = t('auth.validacion.requerido')
    if (!fields.email || !fields.email.includes('@'))     e.email    = t('auth.validacion.correoInvalido')
    if (!fields.phone || fields.phone.length !== 9)       e.phone    = t('auth.validacion.celularDigitos')
    if (!fields.password || fields.password.length < 8)   e.password = t('auth.validacion.contrasenaCorta')
    if (fields.password !== fields.confirm)               e.confirm  = t('auth.validacion.contrasenaNoCoincide')
    if (!fields.acceptedTerms)                            e.acceptedTerms = t('auth.validacion.terminosRequeridos')
    setErrs(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const result = await signup({
      nombre: fields.nombre, apellido: fields.apellido,
      email: fields.email, phone: fields.phone, password: fields.password,
    })
    // No session is created on signup: the account is unlocked by the emailed link.
    if (result.success) setRegisteredEmail(result.email)
  }

  if (registeredEmail) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.close} onClick={onClose} aria-label={t('comun.cerrar')}>✕</button>

          <div className={styles.topBar}>
            <img src={logoImg} alt="LegalFam" />
            <span className={styles.logo}>LEGALFAM</span>
          </div>

          <h2 className={styles.title}>{t('auth.registro.revisaCorreo')}</h2>

          <div className={styles.notice}>
            <div className={styles.noticeIcon}>✉️</div>
            {/* El correo va interpolado dentro de la frase: en quechua y en aymara el orden
                de las palabras no es el del español, y así cada lengua lo coloca donde toca. */}
            <p className={styles.noticeText}>{t('auth.registro.enviamosEnlace', { correo: registeredEmail })}</p>
            <p className={styles.noticeHint}>{t('auth.registro.noLoVes')}</p>
          </div>

          <ResendVerificationButton email={registeredEmail} />

          <p className={styles.switchText}>
            <span onClick={onSwitchToLogin}>{t('auth.registro.irAIniciar')}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label={t('comun.cerrar')}>✕</button>

        <div className={styles.topBar}>
          <img src={logoImg} alt="LegalFam" />
          <span className={styles.logo}>LEGALFAM</span>
        </div>

        <h2 className={styles.title}>{t('auth.registro.titulo')}</h2>
        <p className={styles.subtitle}>{t('auth.registro.subtitulo')}</p>

        {error && <div className="api-err">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <div className={styles.fg}>
              <label htmlFor="rg-nombre">{t('auth.campos.nombre')}</label>
              <input id="rg-nombre" type="text" placeholder={t('auth.campos.nombrePlaceholder')}
                value={fields.nombre} onChange={(e) => set('nombre', e.target.value)}
                className={errs.nombre ? styles.hasError : ''} autoComplete="given-name" />
              {errs.nombre && <span className="field-err">{errs.nombre}</span>}
            </div>
            <div className={styles.fg}>
              <label htmlFor="rg-apellido">{t('auth.campos.apellido')}</label>
              <input id="rg-apellido" type="text" placeholder={t('auth.campos.apellidoPlaceholder')}
                value={fields.apellido} onChange={(e) => set('apellido', e.target.value)}
                className={errs.apellido ? styles.hasError : ''} autoComplete="family-name" />
              {errs.apellido && <span className="field-err">{errs.apellido}</span>}
            </div>
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-email">{t('auth.campos.correo')}</label>
            <input id="rg-email" type="email" placeholder={t('auth.campos.correoPlaceholder')}
              value={fields.email} onChange={(e) => set('email', e.target.value)}
              className={errs.email ? styles.hasError : ''} autoComplete="email" />
            {errs.email && <span className="field-err">{errs.email}</span>}
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-phone">{t('auth.campos.celular')}</label>
            <div className={styles.phoneRow}>
              <span className={styles.phonePfx}>
                <span className={styles.flag}>🇵🇪</span> +51
              </span>
              <div style={{ flex: 1 }}>
                <input id="rg-phone" type="tel" placeholder={t('auth.campos.celularPlaceholder')}
                  value={fields.phone} onChange={handlePhone} maxLength={9}
                  className={errs.phone ? styles.hasError : ''} style={{ width: '100%' }}
                  autoComplete="tel" />
                {errs.phone && <span className="field-err">{errs.phone}</span>}
              </div>
            </div>
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-pass">{t('auth.campos.contrasena')}</label>
            <input id="rg-pass" type="password" placeholder={t('auth.campos.minimoPlaceholder')}
              value={fields.password} onChange={(e) => set('password', e.target.value)}
              className={errs.password ? styles.hasError : ''} autoComplete="new-password" />
            {errs.password && <span className="field-err">{errs.password}</span>}
          </div>

          <div className={styles.fg}>
            <label htmlFor="rg-confirm">{t('auth.campos.confirmar')}</label>
            <input id="rg-confirm" type="password" placeholder={t('auth.campos.confirmarPlaceholder')}
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
                {t('auth.registro.aceptoAntes')}{' '}
                <Link to="/terminos" target="_blank" rel="noreferrer">{t('auth.registro.aceptoEnlace')}</Link>
                {' '}{t('auth.registro.aceptoDespues')}
              </span>
            </label>
            {errs.acceptedTerms && <span className="field-err">{errs.acceptedTerms}</span>}
            <p className={styles.consentNote}>{t('auth.registro.notaDatos')}</p>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? t('auth.registro.creando') : t('auth.registro.crear')}
          </button>
        </form>

        <p className={styles.switchText}>
          {t('auth.registro.yaTienes')} <span onClick={onSwitchToLogin}>{t('auth.registro.inicia')}</span>
        </p>
      </div>
    </div>
  )
}
