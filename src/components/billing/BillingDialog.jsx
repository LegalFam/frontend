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
import styles from './BillingDialog.module.css'

const TOKEN_COST_HINT = 'Cada consulta descuenta tokens cuando la respuesta queda lista: 1 token para consultas simples y hasta 3 tokens cuando la respuesta se apoya en fuentes legales.'

const formatRenewDate = (iso) => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Diálogo compartido de plan y tokens. Lo usan el chat (badge de tokens / aviso
// de "sin tokens") y la página de configuración (usuarios del plan gratuito).
export default function BillingDialog({ onClose }) {
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
            <p className={styles.dialogEyebrow}>Suscripción</p>
            <h2 id="billing-title">Plan y tokens</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.billingSummary}>
          <div>
            <span>Plan actual</span>
            <strong>{formatPlanName(currentPlan) || subscription.planCode}</strong>
          </div>
          <div>
            <span>Tokens disponibles</span>
            <strong>{remainingTokens}/{tokenLimit}</strong>
          </div>
        </div>

        <div className={styles.tokenMeterBlock}>
          <div className={styles.tokenMeterLabels}>
            <span>{usedTokens} usados</span>
            <span>{remainingTokens} restantes</span>
          </div>
          <div className={styles.tokenMeter} aria-hidden="true">
            <span style={{ width: `${tokenPercent}%` }} />
          </div>
          {renewDate && (
            <p className={styles.tokenRenew}>
              {subscription.cancelAtPeriodEnd
                ? `Tu plan y tus tokens vencen el ${renewDate}; después pasarás al plan gratuito.`
                : `Tus tokens se renuevan el ${renewDate}.`}
            </p>
          )}
          <p className={styles.tokenHint}>{TOKEN_COST_HINT}</p>
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
                <em>{isCurrent ? 'Plan activo' : 'Cambiar plan'}</em>
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
            {billingLoading ? 'Cancelando...' : 'Cancelar suscripción'}
          </button>
        )}
      </section>
    </div>
  )
}
