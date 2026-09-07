import { useNavigate } from 'react-router-dom'
import {
  STATIC_PLANS,
  formatPlanName,
  formatPlanPrice,
  formatPlanPeriod,
  formatPlanTokens,
  planSlug,
} from '@/utils/plans'
import { usePaymentStore } from '@/store/paymentStore'
import { useT } from '@/i18n/traducir'
import styles from './BillingDialog.module.css'

// Fecha siempre en es-PE, como en SettingsPage: Intl no tiene datos de quechua ni de aymara.
const formatRenewDate = (iso) => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Diálogo compartido de plan y tokens. Lo usan el chat (badge de tokens / aviso
// de "sin tokens") y la página de configuración (usuarios del plan gratuito).
export default function BillingDialog({ onClose }) {
  const t = useT()
  const navigate = useNavigate()
  const { plans, subscription, cancelSubscription, loading: billingLoading } = usePaymentStore()

  if (!subscription) return null

  const availablePlans = plans.length ? plans : STATIC_PLANS
  const currentPlan = availablePlans.find((plan) => plan.code === subscription.planCode)
  const tokenLimit = subscription.monthlyTokenLimit || currentPlan?.monthlyTokenLimit || 0
  const remainingTokens = subscription.remainingTokens ?? 0
  const usedTokens = Math.max(tokenLimit - remainingTokens, 0)
  const tokenPercent = tokenLimit ? Math.max(0, Math.min(100, (remainingTokens / tokenLimit) * 100)) : 0
  const renewDate = formatRenewDate(subscription.currentPeriodEnd)

  const switchPlan = (plan) => {
    if (plan.code === subscription.planCode) return
    onClose?.()
    navigate(`/pago/${planSlug(plan)}`)
  }

  const handleCancelSubscription = async () => {
    await cancelSubscription().catch(() => {})
  }

  return (
    <div className={styles.modalLayer} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.billingDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="billing-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <div>
            <p className={styles.dialogEyebrow}>{t('facturacion.eyebrow')}</p>
            <h2 id="billing-title">{t('facturacion.titulo')}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label={t('comun.cerrar')}>
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.billingSummary}>
          <div>
            <span>{t('facturacion.planActual')}</span>
            <strong>{formatPlanName(currentPlan) || subscription.planCode}</strong>
          </div>
          <div>
            <span>{t('facturacion.tokensDisponibles')}</span>
            <strong>{remainingTokens}/{tokenLimit}</strong>
          </div>
        </div>

        <div className={styles.tokenMeterBlock}>
          <div className={styles.tokenMeterLabels}>
            <span>{t('facturacion.usados', { cantidad: usedTokens })}</span>
            <span>{t('facturacion.restantes', { cantidad: remainingTokens })}</span>
          </div>
          <div className={styles.tokenMeter} aria-hidden="true">
            <span style={{ width: `${tokenPercent}%` }} />
          </div>
          {renewDate && (
            <p className={styles.tokenRenew}>
              {subscription.cancelAtPeriodEnd
                ? t('facturacion.vencen', { fecha: renewDate })
                : t('facturacion.renuevan', { fecha: renewDate })}
            </p>
          )}
          <p className={styles.tokenHint}>{t('facturacion.costeTokens')}</p>
        </div>

        <div className={styles.planGrid}>
          {availablePlans.map((plan) => {
            const isCurrent = plan.code === subscription.planCode
            return (
              <button
                type="button"
                key={plan.code}
                className={`${styles.planOption} ${isCurrent ? styles.currentPlan : ''}`}
                onClick={() => switchPlan(plan)}
                disabled={isCurrent}
              >
                <span>{formatPlanName(plan)}</span>
                <strong>{formatPlanPrice(plan)} {formatPlanPeriod(plan)}</strong>
                <small>{formatPlanTokens(plan)}</small>
                <em>{isCurrent ? t('facturacion.planActivo') : t('facturacion.cambiarPlan')}</em>
              </button>
            )
          })}
        </div>
        {subscription.provider === 'MERCADO_PAGO' && (
          <button
            type="button"
            className={styles.cancelSubscriptionBtn}
            onClick={handleCancelSubscription}
            disabled={billingLoading}
          >
            {billingLoading ? t('facturacion.cancelando') : t('facturacion.cancelar')}
          </button>
        )}
      </section>
    </div>
  )
}
