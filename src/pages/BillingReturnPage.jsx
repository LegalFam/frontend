import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePaymentStore } from '@/store/paymentStore'
import logoImg from '@/assets/logo-transparent.png'
import styles from './PaymentPage.module.css'

const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 45000

export default function BillingReturnPage() {
  const { result } = useParams()
  const navigate = useNavigate()
  const { subscription, refreshBilling, error } = usePaymentStore()
  const canceled = result === 'cancel'
  const [timedOut, setTimedOut] = useState(false)
  const timeoutRef = useRef(null)

  const upgraded = subscription && subscription.planCode !== 'FREE'

  useEffect(() => {
    if (canceled) return undefined

    const deadline = Date.now() + POLL_TIMEOUT_MS
    let stopped = false

    const tick = async () => {
      await refreshBilling().catch(() => {})
      if (stopped) return
      if (Date.now() >= deadline) {
        setTimedOut(true)
        return
      }
      timeoutRef.current = setTimeout(tick, POLL_INTERVAL_MS)
    }

    tick()
    return () => {
      stopped = true
      clearTimeout(timeoutRef.current)
    }
  }, [canceled, refreshBilling])

  useEffect(() => {
    if (upgraded) clearTimeout(timeoutRef.current)
  }, [upgraded])

  const waiting = !canceled && !upgraded && !timedOut

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/chat')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Chat
        </button>
        <Link to="/" className={styles.logo} aria-label="Ir al inicio">
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </Link>
        <div style={{ width: 100 }} />
      </header>

      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            {waiting ? (
              <span className={styles.spinner} />
            ) : canceled ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="32" height="32">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : upgraded ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="32" height="32">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="32" height="32">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 7v5l3 3"/>
              </svg>
            )}
          </div>
          <h2>
            {canceled
              ? 'Checkout cancelado'
              : waiting
                ? 'Confirmando tu pago...'
                : upgraded
                  ? '¡Listo! Tu plan está activo.'
                  : 'Estamos verificando tu suscripción'}
          </h2>
          <p>
            {canceled
              ? 'No se realizó ningún cobro.'
              : error || (subscription
                ? `Plan actual: ${subscription.planCode}. Tokens disponibles: ${subscription.remainingTokens}/${subscription.monthlyTokenLimit}.`
                : 'Confirmando con Mercado Pago...')}
          </p>
          {waiting && (
            <p className={styles.pollingHint}>
              Esto puede tardar hasta un minuto. No te preocupes, tu pago ya quedó registrado en Mercado Pago —
              solo estamos esperando la confirmación para activar tu plan.
            </p>
          )}
          {timedOut && !canceled && !upgraded && (
            <p className={styles.pollingHint}>
              La confirmación está tardando más de lo habitual. Tu pago no se pierde: en cuanto la recibamos,
              tu plan se activa solo. Si en unos minutos sigues viendo el plan anterior, contáctanos.
            </p>
          )}
          <button className={styles.btnAccent} onClick={() => navigate('/chat')}>
            Ir al chat
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
