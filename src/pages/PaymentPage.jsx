import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentService } from '@/services/api'
import { usePaymentStore } from '@/store/paymentStore'
import {
  PLANS_BY_SLUG,
  formatPlanName,
  formatPlanPeriod,
  formatPlanPrice,
  formatPlanTokens,
} from '@/utils/plans'
import logoImg from '@/assets/logo-transparent.png'
import styles from './PaymentPage.module.css'

export default function PaymentPage() {
  const { plan } = useParams()
  const navigate = useNavigate()
  const { plans, loadPlans, refreshBilling } = usePaymentStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const planData = useMemo(() => {
    const fallback = PLANS_BY_SLUG[plan]
    if (!fallback || !plans.length) return fallback
    return plans.find((item) => item.code === fallback.code) || fallback
  }, [plan, plans])

  useEffect(() => {
    loadPlans().catch(() => {})
  }, [loadPlans])

  const handleCheckout = async () => {
    if (!planData || planData.code === 'FREE') return
    setLoading(true)
    setError(null)
    try {
      await refreshBilling().catch(() => {})
      const successUrl = `${window.location.origin}/billing/success`
      const cancelUrl = `${window.location.origin}/billing/cancel`
      const { data } = await paymentService.createCheckoutSession({
        planCode: planData.code,
        successUrl,
        cancelUrl,
      })
      window.location.assign(data.url)
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo iniciar el checkout. Intenta nuevamente.')
      setLoading(false)
    }
  }

  if (!planData) return null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Volver
        </button>
        <div className={styles.logo}>
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <div className={styles.body}>
        <aside className={styles.summary}>
          <p className={styles.summaryLabel}>Resumen del plan</p>
          <p className={styles.planName}>{formatPlanName(planData)}</p>
          <p className={styles.planPrice}>
            {formatPlanPrice(planData)} <span>{formatPlanPeriod(planData)}</span>
          </p>
          <p className={styles.planTokens}>{formatPlanTokens(planData)}</p>
          <ul className={styles.features}>
            {planData.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className={styles.securityNote}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Pago procesado por Mercado Pago
          </div>
        </aside>

        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Checkout externo</h2>
          <p className={styles.formSub}>
            LegalFam no captura datos de tarjeta. Te enviaremos a Mercado Pago para completar la suscripcion y volveras aqui al terminar.
          </p>

          {error && <div className="api-err">{error}</div>}

          <div className={styles.checkoutBox}>
            <p className={styles.checkoutTitle}>{formatPlanName(planData)}</p>
            <p className={styles.checkoutText}>
              Al continuar, Mercado Pago gestionara el pago recurrente. Al volver, actualizaremos tu plan y tokens.
            </p>
          </div>

          <button
            type="button"
            className={styles.submitBtn}
            disabled={loading || planData.code === 'FREE'}
            onClick={handleCheckout}
          >
            {loading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner} />
                Abriendo Mercado Pago...
              </span>
            ) : (
              <>
                Continuar a Mercado Pago
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => refreshBilling().finally(() => navigate('/chat'))}
          >
            Volver al chat
          </button>
        </div>
      </div>
    </div>
  )
}
