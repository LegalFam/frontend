import { useNavigate } from 'react-router-dom'
import {
  STATIC_PLANS,
  formatPlanName,
  formatPlanPeriod,
  formatPlanPrice,
  formatPlanTokens,
  planSlug,
} from '@/utils/plans'
import styles from './PreciosSection.module.css'

export default function PreciosSection({ onRegisterClick }) {
  const navigate = useNavigate()

  const handlePlanClick = (plan) => {
    if (plan.code === 'FREE') {
      onRegisterClick()
      return
    }
    navigate(`/pago/${planSlug(plan)}`)
  }

  return (
    <section id="precios" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Planes</span>
          <h2 className="section-title">Elige tu plan</h2>
          <p className="section-sub">
            Comienza sin costo y escala segun tus necesidades de orientacion legal.
          </p>
        </div>

        <div className={styles.grid}>
          {STATIC_PLANS.map((plan) => {
            return (
              <div
                key={plan.code}
                className={`${styles.card} ${plan.featured ? styles.featured : ''}`}
              >
                {plan.featured && (
                  <span className={styles.featuredTag}>Mas popular</span>
                )}
                <p className={styles.planName}>{formatPlanName(plan)}</p>
                <p className={styles.planPrice}>
                  {formatPlanPrice(plan)} <span>{formatPlanPeriod(plan)}</span>
                </p>
                <p className={styles.planTokens}>{formatPlanTokens(plan)}</p>
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button
                  className={plan.featured ? styles.btnGold : styles.btnGhost}
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            )
          })}
        </div>

        <p className={styles.note}>
          Los precios incluyen IGV. Puedes cancelar tu suscripcion en cualquier momento.
        </p>
      </div>
    </section>
  )
}
