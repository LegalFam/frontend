import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { userService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { usePaymentStore } from '@/store/paymentStore'
import { normalizeApiError } from '@/utils/apiError'
import { STATIC_PLANS, formatPlanName, formatPlanTokens } from '@/utils/plans'
import styles from './SettingsPage.module.css'

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

  const [cancelOpen, setCancelOpen] = useState(false)
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
        if (!disposed) setProfileError(normalizeApiError(e, 'No se pudo cargar tu perfil.').message)
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
    if (!profile.nombre.trim()) errs.nombre = 'Campo requerido.'
    if (!profile.apellido.trim()) errs.apellido = 'Campo requerido.'
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
      setProfileError(normalizeApiError(e, 'No se pudieron guardar tus datos.').message)
    } finally {
      setProfileSaving(false)
    }
  }

  const submitPassword = async (ev) => {
    ev.preventDefault()
    setPasswordSaved(false)
    setPasswordError(null)

    const errs = {}
    if (!passwords.current) errs.current = 'Campo requerido.'
    if (!passwords.next || passwords.next.length < 8) errs.next = 'Mínimo 8 caracteres.'
    if (passwords.next !== passwords.confirm) errs.confirm = 'Las contraseñas no coinciden.'
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
      const normalized = normalizeApiError(e, 'No se pudo cambiar la contraseña.')
      if (normalized.code === 'current_password_invalid') {
        setPasswordErrs({ current: 'La contraseña actual es incorrecta.' })
      } else {
        setPasswordError(normalized.message)
      }
    } finally {
      setPasswordSaving(false)
    }
  }

  const confirmCancelSubscription = async () => {
    setCancelOpen(false)
    setBillingError(null)
    setBillingDone(false)
    try {
      await cancelSubscription()
      setBillingDone(true)
    } catch (e) {
      setBillingError(normalizeApiError(e, 'No se pudo dar de baja la suscripción.').message)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Volver
        </button>
        <Link to="/chat" className={styles.logo} aria-label="Ir al chat">
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </Link>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Cuenta</span>
          <h1>Configuración</h1>
          <p>Actualiza tus datos personales, tu contraseña y tu suscripción.</p>
        </section>

        <section className={styles.card}>
          <h2>Datos personales</h2>
          {profileError && <div className="api-err">{profileError}</div>}
          <form onSubmit={submitProfile} noValidate>
            <div className={styles.row}>
              <div className={styles.fg}>
                <label htmlFor="st-nombre">Nombre</label>
                <input
                  id="st-nombre"
                  type="text"
                  value={profile.nombre}
                  onChange={(e) => setProfile((p) => ({ ...p, nombre: e.target.value }))}
                  className={profileErrs.nombre ? styles.hasError : ''}
                  autoComplete="given-name"
                />
                {profileErrs.nombre && <span className="field-err">{profileErrs.nombre}</span>}
              </div>
              <div className={styles.fg}>
                <label htmlFor="st-apellido">Apellido</label>
                <input
                  id="st-apellido"
                  type="text"
                  value={profile.apellido}
                  onChange={(e) => setProfile((p) => ({ ...p, apellido: e.target.value }))}
                  className={profileErrs.apellido ? styles.hasError : ''}
                  autoComplete="family-name"
                />
                {profileErrs.apellido && <span className="field-err">{profileErrs.apellido}</span>}
              </div>
            </div>

            <div className={styles.fg}>
              <label htmlFor="st-email">Correo electrónico</label>
              <input id="st-email" type="email" value={email} disabled readOnly autoComplete="email" />
              <p className={styles.fieldNote}>
                Para cambiar tu correo necesitamos verificar la nueva dirección. Esta opción estará
                disponible pronto.
              </p>
            </div>

            <div className={styles.formFooter}>
              <button type="submit" className={styles.primaryBtn} disabled={profileSaving}>
                {profileSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              {profileSaved && <span className={styles.savedMsg}>Datos actualizados.</span>}
            </div>
          </form>
        </section>

        <section className={styles.card}>
          <h2>Contraseña</h2>
          {passwordError && <div className="api-err">{passwordError}</div>}
          <form onSubmit={submitPassword} noValidate>
            <div className={styles.fg}>
              <label htmlFor="st-current">Contraseña actual</label>
              <input
                id="st-current"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                className={passwordErrs.current ? styles.hasError : ''}
                autoComplete="current-password"
              />
              {passwordErrs.current && <span className="field-err">{passwordErrs.current}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.fg}>
                <label htmlFor="st-next">Nueva contraseña</label>
                <input
                  id="st-next"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  className={passwordErrs.next ? styles.hasError : ''}
                  autoComplete="new-password"
                />
                {passwordErrs.next && <span className="field-err">{passwordErrs.next}</span>}
              </div>
              <div className={styles.fg}>
                <label htmlFor="st-confirm">Confirmar contraseña</label>
                <input
                  id="st-confirm"
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className={passwordErrs.confirm ? styles.hasError : ''}
                  autoComplete="new-password"
                />
                {passwordErrs.confirm && <span className="field-err">{passwordErrs.confirm}</span>}
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="submit" className={styles.primaryBtn} disabled={passwordSaving}>
                {passwordSaving ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
              {passwordSaved && <span className={styles.savedMsg}>Contraseña actualizada.</span>}
            </div>
          </form>
        </section>

        <section className={styles.card}>
          <h2>Suscripción</h2>
          {billingError && <div className="api-err">{billingError}</div>}
          {subscription ? (
            <>
              <div className={styles.summary}>
                <div>
                  <span>Plan actual</span>
                  <strong>{formatPlanName(currentPlan) || subscription.planCode}</strong>
                </div>
                <div>
                  <span>Tokens disponibles</span>
                  <strong>{remainingTokens}/{tokenLimit}</strong>
                </div>
              </div>
              {currentPlan && <p className={styles.fieldNote}>{formatPlanTokens(currentPlan)}</p>}
              {subscription.provider === 'MERCADO_PAGO' ? (
                <>
                  <p className={styles.fieldNote}>
                    Al dar de baja pasarás al plan gratuito de inmediato, sin conservar el tiempo
                    restante del periodo ya pagado.
                  </p>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setCancelOpen(true)}
                    disabled={billingLoading}
                  >
                    {billingLoading ? 'Dando de baja...' : 'Dar de baja la suscripción'}
                  </button>
                </>
              ) : (
                <p className={styles.fieldNote}>
                  {billingDone
                    ? 'Suscripción dada de baja. Ahora estás en el plan gratuito.'
                    : 'Tu plan actual es gratuito, no hay ninguna suscripción que dar de baja.'}
                </p>
              )}
            </>
          ) : (
            <p className={styles.fieldNote}>Cargando información de tu suscripción...</p>
          )}
        </section>
      </main>

      {cancelOpen && (
        <div className={styles.confirmLayer} role="presentation" onMouseDown={() => setCancelOpen(false)}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-subscription-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="cancel-subscription-title">Dar de baja la suscripción</h2>
            <p>
              La baja es <strong>inmediata</strong>: pasarás al plan gratuito ahora mismo y no se
              conserva el tiempo restante del periodo que ya pagaste.
            </p>
            <p>
              Tu saldo pasará de <strong>{remainingTokens}</strong> a{' '}
              <strong>{freeTokenLimit}</strong> tokens. Esta acción no se puede deshacer.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setCancelOpen(false)}>
                Volver
              </button>
              <button type="button" className={styles.deleteBtn} onClick={confirmCancelSubscription}>
                Dar de baja
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
