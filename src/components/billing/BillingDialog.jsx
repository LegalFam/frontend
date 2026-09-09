import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CancelSubscriptionDialog from '@/components/billing/CancelSubscriptionDialog'
import { normalizeApiError } from '@/utils/apiError'
import {
  STATIC_PLANS,
  formatPlanName,
  formatPlanPrice,
  formatPlanPeriod,
  formatPlanTokens,
  planSlug,
} from '@/utils/plans'
import { usePaymentStore } from '@/store/paymentStore'
import { useT } from '@/i18n/translate'
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
  const { plans, subscription, cancelSubscription } = usePaymentStore()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelError, setCancelError] = useState(null)

  if (!subscription) return null

  const availablePlans = plans.length ? plans : STATIC_PLANS
  const currentPlan = availablePlans.find((plan) => plan.code === subscription.planCode)
  const tokenLimit = subscription.monthlyTokenLimit || currentPlan?.monthlyTokenLimit || 0
  const remainingTokens = subscription.remainingTokens ?? 0
  const freeTokenLimit = availablePlans.find((plan) => plan.code === 'FREE')?.monthlyTokenLimit ?? 0
  // Sólo hay algo que dar de baja si la suscripción la cobra la pasarela y sigue viva.
  const canCancel = subscription.provider === 'MERCADO_PAGO' && !subscription.cancelAtPeriodEnd
  const usedTokens = Math.max(tokenLimit - remainingTokens, 0)
  const tokenPercent = tokenLimit ? Math.max(0, Math.min(100, (remainingTokens / tokenLimit) * 100)) : 0
  const renewDate = formatRenewDate(subscription.currentPeriodEnd)

  const switchPlan = (plan) => {
    if (plan.code === subscription.planCode) return
    onClose?.()
    navigate(`/pago/${planSlug(plan)}`)
  }

  const confirmCancelSubscription = async () => {
    setCancelError(null)
    try {
      await cancelSubscription()
      setCancelOpen(false)
    } catch (e) {
      setCancelError(normalizeApiError(e, 'config.suscripcion.errorBaja'))
    }
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
            // El gratuito no se compra: pulsarlo llevaba a /pago/gratis, un checkout cuyo
            // botón no hace nada porque no hay nada que cobrar. Lo que sí significa para
            // quien paga es volver al gratuito, y eso es exactamente dar de baja: la
            // tarjeta abre la misma confirmación que Configuración → Suscripción.
            const isDowngrade = plan.code === 'FREE' && !isCurrent && canCancel
            const isSelectable = !isCurrent && plan.code !== 'FREE'
            return (
              <button
                type="button"
                key={plan.code}
                className={`${styles.planOption} ${isCurrent ? styles.currentPlan : ''} ${isDowngrade ? styles.downgradePlan : ''}`}
                onClick={() => (isDowngrade ? setCancelOpen(true) : switchPlan(plan))}
                disabled={!isSelectable && !isDowngrade}
              >
                <span>{formatPlanName(plan)}</span>
                <strong>{formatPlanPrice(plan)} {formatPlanPeriod(plan)}</strong>
                <small>{formatPlanTokens(plan)}</small>
                {isCurrent && <em>{t('facturacion.planActivo')}</em>}
                {isSelectable && <em>{t('facturacion.cambiarPlan')}</em>}
                {isDowngrade && <em className={styles.downgradeLabel}>{t('config.suscripcion.darDeBaja')}</em>}
                {/* Ya dada de baja: la vuelta al gratuito está en marcha, no hay nada que pulsar. */}
                {plan.code === 'FREE' && !isCurrent && subscription.cancelAtPeriodEnd && (
                  <em>{t('config.suscripcion.dadaDeBaja')}</em>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {cancelOpen && (
        <CancelSubscriptionDialog
          subscription={subscription}
          freeTokenLimit={freeTokenLimit}
          error={cancelError}
          onClose={() => { setCancelOpen(false); setCancelError(null) }}
          onConfirm={confirmCancelSubscription}
        />
      )}
    </div>
  )
}
