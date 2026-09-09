import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { userService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { usePaymentStore } from '@/store/paymentStore'
import { normalizeApiError, resolveApiError } from '@/utils/apiError'
import { TEMAS_PUBLICOS, aplicarTema, temaActual } from '@/theme'
import { STATIC_PLANS, formatPlanName, formatPlanTokens } from '@/utils/plans'
import BillingDialog from '@/components/billing/BillingDialog'
import CancelSubscriptionDialog from '@/components/billing/CancelSubscriptionDialog'
import LanguageSelector from '@/components/common/LanguageSelector'
import { useT } from '@/i18n/translate'
import styles from './SettingsPage.module.css'

// La fecha se formatea siempre en es-PE: Intl no tiene datos de quechua ni de aymara, y
// pedirle 'qu-PE' caería en el idioma por defecto del navegador, peor que el español. Lo que
// sí se traduce es el texto que la rodea.
const formatPeriodEnd = (iso, textoPorDefecto) => {
  if (!iso) return textoPorDefecto
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return textoPorDefecto
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
}

const splitName = (fullName) => {
  const trimmed = (fullName || '').trim()
  if (!trimmed) return { nombre: '', apellido: '' }
  const firstSpace = trimmed.indexOf(' ')
  if (firstSpace === -1) return { nombre: trimmed, apellido: '' }
  return {
    nombre: trimmed.slice(0, firstSpace),
    apellido: trimmed.slice(firstSpace + 1).trim(),
  }
}

export default function SettingsPage() {
  const t = useT()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const { plans, subscription, refreshBilling, cancelSubscription, loading: billingLoading } = usePaymentStore()

  const [profile, setProfile] = useState(() => splitName(user?.name))
  const [email, setEmail] = useState(user?.email || '')
  const [profileErrs, setProfileErrs] = useState({})
  const [profileError, setProfileError] = useState(null)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passwordErrs, setPasswordErrs] = useState({})
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [tema, setTema] = useState(() => temaActual())

  const [cancelOpen, setCancelOpen] = useState(false)
  const [plansOpen, setPlansOpen] = useState(false)
  const [billingError, setBillingError] = useState(null)
  const [billingDone, setBillingDone] = useState(false)

  useEffect(() => {
    let disposed = false

    userService.getProfile()
      .then(({ data }) => {
        if (disposed) return
        setProfile(splitName(data.name))
        setEmail(data.email || '')
        setUser({ ...(useAuthStore.getState().user || {}), ...data })
      })
      .catch((e) => {
        if (!disposed) setProfileError(normalizeApiError(e, 'config.errorPerfil'))
      })

    refreshBilling().catch(() => {})

    return () => { disposed = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const availablePlans = plans.length ? plans : STATIC_PLANS
  const currentPlan = availablePlans.find((plan) => plan.code === subscription?.planCode)
  const tokenLimit = subscription?.monthlyTokenLimit || currentPlan?.monthlyTokenLimit || 0
  const remainingTokens = subscription?.remainingTokens ?? 0
  const freeTokenLimit = availablePlans.find((plan) => plan.code === 'FREE')?.monthlyTokenLimit ?? 0

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/chat')
  }

  const submitProfile = async (ev) => {
    ev.preventDefault()
    setProfileSaved(false)
    setProfileError(null)

    const errs = {}
    if (!profile.nombre.trim()) errs.nombre = 'auth.validacion.requerido'
    if (!profile.apellido.trim()) errs.apellido = 'auth.validacion.requerido'
    setProfileErrs(errs)
    if (Object.keys(errs).length) return

    const name = `${profile.nombre.trim()} ${profile.apellido.trim()}`.trim()
    setProfileSaving(true)
    try {
      const { data } = await userService.updateProfile({ name })
      setProfile(splitName(data.name))
      setUser({ ...(useAuthStore.getState().user || {}), ...data })
      setProfileSaved(true)
    } catch (e) {
      setProfileError(normalizeApiError(e, 'config.datos.error'))
    } finally {
      setProfileSaving(false)
    }
  }

  const submitPassword = async (ev) => {
    ev.preventDefault()
    setPasswordSaved(false)
    setPasswordError(null)

    const errs = {}
    if (!passwords.current) errs.current = 'auth.validacion.requerido'
    if (!passwords.next || passwords.next.length < 8) errs.next = 'auth.validacion.contrasenaCorta'
    if (passwords.next !== passwords.confirm) errs.confirm = 'auth.validacion.contrasenaNoCoincide'
    setPasswordErrs(errs)
    if (Object.keys(errs).length) return

    setPasswordSaving(true)
    try {
      await userService.updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      })
      setPasswords({ current: '', next: '', confirm: '' })
      setPasswordSaved(true)
    } catch (e) {
      const normalized = normalizeApiError(e, 'config.contrasena.error')
      if (normalized.code === 'current_password_invalid') {
        setPasswordErrs({ current: 'config.contrasena.actualIncorrecta' })
      } else {
        setPasswordError(normalized)
      }
    } finally {
      setPasswordSaving(false)
    }
  }

  const cambiarTema = (id) => {
    setTema(aplicarTema(id))
  }

  const confirmCancelSubscription = async () => {
    setCancelOpen(false)
    setBillingError(null)
    setBillingDone(false)
    try {
      await cancelSubscription()
      setBillingDone(true)
    } catch (e) {
      setBillingError(normalizeApiError(e, 'config.suscripcion.errorBaja'))
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t('comun.volver')}
        </button>
        <Link to="/chat" className={styles.logo} aria-label={t('config.volverAlChat')}>
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </Link>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>{t('config.eyebrow')}</span>
          <h1>{t('config.titulo')}</h1>
          <p>{t('config.subtitulo')}</p>
        </section>

        <section className={styles.card}>
          <h2>{t('config.datos.titulo')}</h2>
          {profileError && <div className="api-err">{resolveApiError(profileError)}</div>}
          <form onSubmit={submitProfile} noValidate>
            <div className={styles.row}>
              <div className={styles.fg}>
                <label htmlFor="st-nombre">{t('auth.campos.nombre')}</label>
                <input
                  id="st-nombre"
                  type="text"
                  value={profile.nombre}
                  onChange={(e) => setProfile((p) => ({ ...p, nombre: e.target.value }))}
                  className={profileErrs.nombre ? styles.hasError : ''}
                  autoComplete="given-name"
                />
                {profileErrs.nombre && <span className="field-err">{t(profileErrs.nombre)}</span>}
              </div>
              <div className={styles.fg}>
                <label htmlFor="st-apellido">{t('auth.campos.apellido')}</label>
                <input
                  id="st-apellido"
                  type="text"
                  value={profile.apellido}
                  onChange={(e) => setProfile((p) => ({ ...p, apellido: e.target.value }))}
                  className={profileErrs.apellido ? styles.hasError : ''}
                  autoComplete="family-name"
                />
                {profileErrs.apellido && <span className="field-err">{t(profileErrs.apellido)}</span>}
              </div>
            </div>

            <div className={styles.fg}>
              <label htmlFor="st-email">{t('auth.campos.correo')}</label>
              <input id="st-email" type="email" value={email} disabled readOnly autoComplete="email" />
              <p className={styles.fieldNote}>{t('config.datos.correoNota')}</p>
            </div>

            <div className={styles.formFooter}>
              <button type="submit" className={styles.primaryBtn} disabled={profileSaving}>
                {profileSaving ? t('auth.restablecer.guardando') : t('config.datos.guardar')}
              </button>
              {profileSaved && <span className={styles.savedMsg}>{t('config.datos.guardado')}</span>}
            </div>
          </form>
        </section>

        <section className={styles.card}>
          <h2>{t('config.contrasena.titulo')}</h2>
          {passwordError && <div className="api-err">{resolveApiError(passwordError)}</div>}
          <form onSubmit={submitPassword} noValidate>
            <div className={styles.fg}>
              <label htmlFor="st-current">{t('config.contrasena.actual')}</label>
              <input
                id="st-current"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                className={passwordErrs.current ? styles.hasError : ''}
                autoComplete="current-password"
              />
              {passwordErrs.current && <span className="field-err">{t(passwordErrs.current)}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.fg}>
                <label htmlFor="st-next">{t('config.contrasena.nueva')}</label>
                <input
                  id="st-next"
                  type="password"
                  placeholder={t('auth.campos.minimoPlaceholder')}
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  className={passwordErrs.next ? styles.hasError : ''}
                  autoComplete="new-password"
                />
                {passwordErrs.next && <span className="field-err">{t(passwordErrs.next)}</span>}
              </div>
              <div className={styles.fg}>
                <label htmlFor="st-confirm">{t('auth.campos.confirmar')}</label>
                <input
                  id="st-confirm"
                  type="password"
                  placeholder={t('config.contrasena.confirmarPlaceholder')}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className={passwordErrs.confirm ? styles.hasError : ''}
                  autoComplete="new-password"
                />
                {passwordErrs.confirm && <span className="field-err">{t(passwordErrs.confirm)}</span>}
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="submit" className={styles.primaryBtn} disabled={passwordSaving}>
                {passwordSaving ? t('auth.restablecer.guardando') : t('config.contrasena.cambiar')}
              </button>
              {passwordSaved && <span className={styles.savedMsg}>{t('config.contrasena.guardado')}</span>}
            </div>
          </form>
        </section>

        <section className={styles.card}>
          <h2>{t('config.idioma.titulo')}</h2>
          <p className={styles.themeIntro}>{t('config.idioma.intro')}</p>
          <LanguageSelector className={styles.languagePicker} />
          <p className={styles.fieldNote}>{t('config.idioma.nota')}</p>
        </section>

        <section className={styles.card}>
          <h2>{t('config.apariencia.titulo')}</h2>
          <p className={styles.themeIntro}>{t('config.apariencia.intro')}</p>
          <div className={styles.themeGrid} role="radiogroup" aria-label={t('config.apariencia.titulo')}>
            {TEMAS_PUBLICOS.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                className={`${styles.themeOption} ${tema === id ? styles.themeActive : ''}`}
                onClick={() => cambiarTema(id)}
                aria-checked={tema === id}
              >
                <span className={styles.themeRadio} aria-hidden="true" />
                <span className={styles.themeText}>
                  <strong>{t(`config.apariencia.temas.${id}.nombre`)}</strong>
                  <small>{t(`config.apariencia.temas.${id}.descripcion`)}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2>{t('config.suscripcion.titulo')}</h2>
          {billingError && <div className="api-err">{resolveApiError(billingError)}</div>}
          {subscription ? (
            <>
              <div className={styles.summary}>
                <div>
                  <span>{t('config.suscripcion.planActual')}</span>
                  <strong>{formatPlanName(currentPlan) || subscription.planCode}</strong>
                </div>
                <div>
                  <span>{t('config.suscripcion.tokensDisponibles')}</span>
                  <strong>{remainingTokens}/{tokenLimit}</strong>
                </div>
              </div>
              {currentPlan && <p className={styles.fieldNote}>{formatPlanTokens(currentPlan)}</p>}
              {subscription.provider === 'MERCADO_PAGO' && subscription.cancelAtPeriodEnd ? (
                <>
                  {billingDone && (
                    <p className={styles.savedMsg}>{t('config.suscripcion.dadaDeBaja')}</p>
                  )}
                  <p className={styles.fieldNote}>
                    {t('config.suscripcion.noRenovara', {
                      fecha: formatPeriodEnd(subscription.currentPeriodEnd, t('config.suscripcion.finPeriodo')),
                    })}
                  </p>
                </>
              ) : subscription.provider === 'MERCADO_PAGO' ? (
                <>
                  <p className={styles.fieldNote}>
                    {t('config.suscripcion.alDarDeBaja', {
                      fecha: formatPeriodEnd(subscription.currentPeriodEnd, t('config.suscripcion.finPeriodo')),
                    })}
                  </p>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setCancelOpen(true)}
                    disabled={billingLoading}
                  >
                    {billingLoading ? t('config.suscripcion.dandoDeBaja') : t('config.suscripcion.darDeBaja')}
                  </button>
                </>
              ) : (
                <>
                  <p className={styles.fieldNote}>{t('config.suscripcion.esGratuito')}</p>
                  <button
                    type="button"
                    className={`${styles.primaryBtn} ${styles.plansBtn}`}
                    onClick={() => setPlansOpen(true)}
                  >
                    {t('config.suscripcion.verPlanes')}
                  </button>
                </>
              )}
            </>
          ) : (
            <p className={styles.fieldNote}>{t('config.suscripcion.cargando')}</p>
          )}
        </section>
      </main>

      {plansOpen && <BillingDialog onClose={() => setPlansOpen(false)} />}

      {cancelOpen && (
        <CancelSubscriptionDialog
          subscription={subscription}
          freeTokenLimit={freeTokenLimit}
          onClose={() => setCancelOpen(false)}
          onConfirm={confirmCancelSubscription}
        />
      )}
    </div>
  )
}
