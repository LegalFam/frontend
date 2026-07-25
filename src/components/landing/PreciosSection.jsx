import { useNavigate } from 'react-router-dom'
import {
  SHARED_PLAN_FEATURES,
  STATIC_PLANS,
  formatPlanCapacity,
  formatPlanContextMessages,
  formatPlanHistoryWindow,
  formatPlanName,
  formatPlanPeriod,
  formatPlanPrice,
  planSlug,
} from '@/utils/plans'
import { setPendingAuthRedirect } from '@/hooks/useAuth'
import styles from './PreciosSection.module.css'

const Check = () => (
  <span className={styles.check} role="img" aria-label="Incluido">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
)

export default function PreciosSection({ isAuthenticated, currentPlanCode, onRegisterClick }) {
  const navigate = useNavigate()

  const handlePlanClick = (plan) => {
    if (!isAuthenticated) {
      if (plan.code !== 'FREE') {
        setPendingAuthRedirect(`/pago/${planSlug(plan)}`)
      }
      onRegisterClick()
      return
    }
    if (plan.code === 'FREE') {
      navigate('/chat')
      return
    }
    if (plan.code === currentPlanCode) return
    navigate(`/pago/${planSlug(plan)}`)
  }

  const buttonLabelFor = (plan, isCurrent) => {
    if (!isAuthenticated) return plan.buttonLabel
    if (isCurrent) return 'Plan actual'
    return plan.code === 'FREE' ? 'Ir al chat' : 'Cambiar plan'
  }

  return (
    <section id="precios" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Planes</span>
          <h2 className="section-title">Elige tu plan</h2>
          <p className="section-sub">
            El asistente es el mismo en todos los planes. Cambian la capacidad mensual,
            la memoria de la conversación y el historial disponible.
          </p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">
              Comparación de precios, capacidad mensual y funciones incluidas en cada plan
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Característica</span>
                </th>
                {STATIC_PLANS.map((plan) => (
                  <th
                    key={plan.code}
                    scope="col"
                    className={plan.featured ? styles.featuredCol : undefined}
                  >
                    {plan.featured && <span className={styles.tag}>Más popular</span>}
                    <span className={styles.planName}>{formatPlanName(plan)}</span>
                    <span className={styles.planPrice}>
                      {formatPlanPrice(plan)}
                      <span className={styles.period}>{formatPlanPeriod(plan)}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr className={styles.keyRow}>
                <th scope="row">
                  Capacidad
                  <span className={styles.rowHint}>respecto al plan gratuito</span>
                </th>
                {STATIC_PLANS.map((plan) => (
                  <td
                    key={plan.code}
                    className={`${styles.figure} ${plan.featured ? styles.featuredCol : ''}`}
                  >
                    {formatPlanCapacity(plan)}
                  </td>
                ))}
              </tr>

              <tr>
                <th scope="row">Tokens mensuales</th>
                {STATIC_PLANS.map((plan) => (
                  <td key={plan.code} className={plan.featured ? styles.featuredCol : undefined}>
                    {new Intl.NumberFormat('es-PE').format(plan.monthlyTokenLimit)}
                  </td>
                ))}
              </tr>

              <tr>
                <th scope="row">
                  Memoria de la conversación
                  <span className={styles.rowHint}>contexto que recuerda el asistente</span>
                </th>
                {STATIC_PLANS.map((plan) => (
                  <td key={plan.code} className={plan.featured ? styles.featuredCol : undefined}>
                    {formatPlanContextMessages(plan)}
                  </td>
                ))}
              </tr>

              <tr>
                <th scope="row">Historial disponible</th>
                {STATIC_PLANS.map((plan) => (
                  <td key={plan.code} className={plan.featured ? styles.featuredCol : undefined}>
                    {formatPlanHistoryWindow(plan)}
                  </td>
                ))}
              </tr>

              {SHARED_PLAN_FEATURES.map((feature) => (
                <tr key={feature}>
                  <th scope="row">{feature}</th>
                  {STATIC_PLANS.map((plan) => (
                    <td key={plan.code} className={plan.featured ? styles.featuredCol : undefined}>
                      <Check />
                    </td>
                  ))}
                </tr>
              ))}

              <tr className={styles.ctaRow}>
                <td />
                {STATIC_PLANS.map((plan) => {
                  const isCurrent = isAuthenticated && plan.code === currentPlanCode
                  return (
                    <td
                      key={plan.code}
                      className={plan.featured ? styles.featuredCol : undefined}
                    >
                      <button
                        className={plan.featured ? styles.btnGold : styles.btnGhost}
                        onClick={() => handlePlanClick(plan)}
                        disabled={isCurrent}
                      >
                        {buttonLabelFor(plan, isCurrent)}
                      </button>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <p className={styles.note}>
          Los precios incluyen IGV. Puedes cancelar tu suscripción en cualquier momento.
        </p>
      </div>
    </section>
  )
}
