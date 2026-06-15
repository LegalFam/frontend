import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePaymentStore } from '@/store/paymentStore'
import logoImg from '@/assets/logo-transparent.png'
import styles from './PaymentPage.module.css'

export default function BillingReturnPage() {
  const { result } = useParams()
  const navigate = useNavigate()
  const { subscription, refreshBilling, loading, error } = usePaymentStore()
  const canceled = result === 'cancel'

  useEffect(() => {
    refreshBilling().catch(() => {})
  }, [refreshBilling])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/chat')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Chat
        </button>
        <div className={styles.logo}>
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="32" height="32">
              {canceled ? <path d="M18 6 6 18M6 6l12 12"/> : <polyline points="20 6 9 17 4 12"/>}
            </svg>
          </div>
          <h2>{canceled ? 'Checkout cancelado' : 'Estamos verificando tu suscripción'}</h2>
          <p>
            {loading
              ? 'Actualizando tu plan y tokens...'
              : error || (subscription
                ? `Plan actual: ${subscription.planCode}. Tokens disponibles: ${subscription.remainingTokens}/${subscription.monthlyTokenLimit}.`
                : 'Si el pago fue aprobado, el webhook puede tardar unos segundos en reflejar el cambio.')}
          </p>
          <button className={styles.btnGold} onClick={() => navigate('/chat')}>
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
