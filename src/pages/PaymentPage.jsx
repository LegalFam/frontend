import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { paymentService } from '@/services/api'
import { usePaymentStore } from '@/store/paymentStore'
import {
  PLANS_BY_SLUG,
  formatPlanFeature,
  formatPlanName,
  formatPlanPeriod,
  formatPlanPrice,
  formatPlanTokens,
  mergePlanWithStatic,
} from '@/utils/plans'
import { normalizeApiError } from '@/utils/apiError'
import { useT } from '@/i18n/traducir'
import logoImg from '@/assets/logo-transparent.png'
import styles from './PaymentPage.module.css'

export default function PaymentPage() {
  const t = useT()
  const { plan } = useParams()
  const navigate = useNavigate()
  const { plans, loadPlans, refreshBilling } = usePaymentStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const planData = useMemo(() => {
    const fallback = PLANS_BY_SLUG[plan]
    if (!fallback || !plans.length) return fallback
    return mergePlanWithStatic(plans.find((item) => item.code === fallback.code) || fallback)
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
      setError(normalizeApiError(err, t('pago.errorCheckout')).message)
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
          {t('comun.volver')}
        </button>
        <Link to="/" className={styles.logo} aria-label={t('pago.irAlInicio')}>
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </Link>
        <div style={{ width: 100 }} />
      </header>

      <div className={styles.body}>
        <aside className={styles.summary}>
          <p className={styles.summaryLabel}>{t('pago.resumen')}</p>
          <p className={styles.planName}>{formatPlanName(planData)}</p>
          <p className={styles.planPrice}>
            {formatPlanPrice(planData)} <span>{formatPlanPeriod(planData)}</span>
          </p>
          <p className={styles.planTokens}>{formatPlanTokens(planData)}</p>
          <ul className={styles.features}>
            {(planData.features || []).map((feature) => (
              <li key={feature}>{formatPlanFeature(feature)}</li>
            ))}
          </ul>
          <div className={styles.securityNote}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {t('pago.procesadoPor')}
          </div>
        </aside>

        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{t('pago.checkoutTitulo')}</h2>
          <p className={styles.formSub}>{t('pago.checkoutSub')}</p>

          {error && <div className="api-err">{error}</div>}

          <div className={styles.checkoutBox}>
            <p className={styles.checkoutTitle}>{formatPlanName(planData)}</p>
            <p className={styles.checkoutText}>{t('pago.checkoutTexto')}</p>
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
                {t('pago.abriendo')}
              </span>
            ) : (
              <>
                {t('pago.continuar')}
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
            {t('pago.volverAlChat')}
          </button>
        </div>
      </div>
    </div>
  )
}
