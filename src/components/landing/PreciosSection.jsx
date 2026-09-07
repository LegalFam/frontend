import { useNavigate } from 'react-router-dom'
import {
  SHARED_PLAN_FEATURE_KEYS,
  STATIC_PLANS,
  formatPlanButtonLabel,
  formatPlanCapacity,
  formatPlanContextMessages,
  formatPlanFeature,
  formatPlanHistoryWindow,
  formatPlanName,
  formatPlanPeriod,
  formatPlanPrice,
  planSlug,
} from '@/utils/plans'
import { setPendingAuthRedirect } from '@/hooks/useAuth'
import { useT } from '@/i18n/traducir'
import styles from './PreciosSection.module.css'

const Check = ({ etiqueta }) => (
  <span className={styles.check} role="img" aria-label={etiqueta}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
)

// Las filas comparativas se declaran una sola vez porque alimentan las dos
// vistas: la tabla de escritorio y las tarjetas apiladas de móvil.
const PLAN_SPECS = [
  {
    clave: 'capacidad',
    hint: 'capacidadHint',
    value: formatPlanCapacity,
    key: true,
  },
  {
    clave: 'tokens',
    value: (plan) => new Intl.NumberFormat('es-PE').format(plan.monthlyTokenLimit),
  },
  {
    clave: 'memoria',
    hint: 'memoriaHint',
    value: formatPlanContextMessages,
  },
  {
    clave: 'historial',
    value: formatPlanHistoryWindow,
  },
]

export default function PreciosSection({ isAuthenticated, currentPlanCode, onRegisterClick }) {
  const t = useT()
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
    if (!isAuthenticated) return formatPlanButtonLabel(plan)
    if (isCurrent) return t('planes.seccion.planActual')
    return plan.code === 'FREE' ? t('planes.seccion.irAlChat') : t('planes.seccion.cambiarPlan')
  }

  return (
    <section id="precios" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">{t('planes.seccion.eyebrow')}</span>
          <h2 className="section-title">{t('planes.seccion.titulo')}</h2>
          <p className="section-sub">{t('planes.seccion.sub')}</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">{t('planes.seccion.tablaResumen')}</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">{t('planes.seccion.caracteristica')}</span>
                </th>
                {STATIC_PLANS.map((plan) => (
                  <th
                    key={plan.code}
                    scope="col"
                    className={plan.featured ? styles.featuredCol : undefined}
                  >
                    {plan.featured && <span className={styles.tag}>{t('planes.seccion.masPopular')}</span>}
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
              {PLAN_SPECS.map((spec) => (
                <tr key={spec.clave} className={spec.key ? styles.keyRow : undefined}>
                  <th scope="row">
                    {t(`planes.seccion.${spec.clave}`)}
                    {spec.hint && (
                      <span className={styles.rowHint}>{t(`planes.seccion.${spec.hint}`)}</span>
                    )}
                  </th>
                  {STATIC_PLANS.map((plan) => (
                    <td
                      key={plan.code}
                      className={[
                        spec.key ? styles.figure : '',
                        plan.featured ? styles.featuredCol : '',
                      ].filter(Boolean).join(' ') || undefined}
                    >
                      {spec.value(plan)}
                    </td>
                  ))}
                </tr>
              ))}

              {SHARED_PLAN_FEATURE_KEYS.map((feature) => (
                <tr key={feature}>
                  <th scope="row">{formatPlanFeature(feature)}</th>
                  {STATIC_PLANS.map((plan) => (
                    <td key={plan.code} className={plan.featured ? styles.featuredCol : undefined}>
                      <Check etiqueta={t('planes.seccion.incluido')} />
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
                        className={plan.featured ? styles.btnAccent : styles.btnGhost}
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

        {/* En móvil la tabla no cabe: se muestra un plan por tarjeta para no
            depender del scroll horizontal. */}
        <div className={styles.cards}>
          {STATIC_PLANS.map((plan) => {
            const isCurrent = isAuthenticated && plan.code === currentPlanCode
            return (
              <article
                key={plan.code}
                className={`${styles.card} ${plan.featured ? styles.cardFeatured : ''}`}
              >
                {plan.featured && <span className={styles.tag}>{t('planes.seccion.masPopular')}</span>}
                <span className={styles.planName}>{formatPlanName(plan)}</span>
                <span className={styles.planPrice}>
                  {formatPlanPrice(plan)}
                  <span className={styles.period}>{formatPlanPeriod(plan)}</span>
                </span>

                <dl className={styles.cardSpecs}>
                  {PLAN_SPECS.map((spec) => (
                    <div key={spec.clave} className={styles.cardSpec}>
                      <dt>
                        {t(`planes.seccion.${spec.clave}`)}
                        {spec.hint && (
                          <span className={styles.rowHint}>{t(`planes.seccion.${spec.hint}`)}</span>
                        )}
                      </dt>
                      <dd className={spec.key ? styles.figure : undefined}>
                        {spec.value(plan)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className={styles.cardFeatures}>
                  {SHARED_PLAN_FEATURE_KEYS.map((feature) => (
                    <li key={feature}>
                      <Check etiqueta={t('planes.seccion.incluido')} />
                      {formatPlanFeature(feature)}
                    </li>
                  ))}
                </ul>

                <button
                  className={plan.featured ? styles.btnAccent : styles.btnGhost}
                  onClick={() => handlePlanClick(plan)}
                  disabled={isCurrent}
                >
                  {buttonLabelFor(plan, isCurrent)}
                </button>
              </article>
            )
          })}
        </div>

        <p className={styles.note}>{t('planes.seccion.nota')}</p>
      </div>
    </section>
  )
}
