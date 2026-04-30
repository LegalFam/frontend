import { useNavigate } from 'react-router-dom'
import styles from './PreciosSection.module.css'

const plans = [
  {
    name: 'Prueba gratuita',
    price: 'S/ 0',
    period: '/ única vez',
    tokens: '50 tokens de consulta',
    featured: false,
    features: [
      '1 sesión de asesoría legal',
      'Respuestas en lenguaje simple',
      'Temas: alimentos, tenencia, filiación',
      'Sin tarjeta de crédito requerida',
    ],
  },
  {
    name: 'Plan Básico',
    price: 'S/ 14.99',
    period: '/ mes',
    tokens: '500 tokens de consulta mensual',
    featured: true,
    features: [
      'Consultas ilimitadas dentro del límite',
      'Historial completo de conversaciones',
      'Fuentes legales citadas con XAI',
      'Todos los temas de Derecho de Familia',
      'Calificación de respuestas',
      'Soporte por correo electrónico',
    ],
  },
  {
    name: 'Plan Premium',
    price: 'S/ 49.99',
    period: '/ mes',
    tokens: '2,500 tokens de consulta mensual',
    featured: false,
    features: [
      'Todo lo del Plan Básico',
      'Respuestas más detalladas y extensas',
      'Acceso prioritario en horas pico',
      'Descarga de resumen en PDF',
      'Análisis de documentos adjuntos',
      'Soporte prioritario 24/7',
    ],
  },
]

export default function PreciosSection({ onRegisterClick }) {
  const navigate = useNavigate()

  const handlePlanClick = (plan) => {
    if (plan.price === 'S/ 0') {
      onRegisterClick()
    } else {
      const slug = plan.name === 'Plan Básico' ? 'basico' : 'premium'
      navigate(`/pago/${slug}`)
    }
  }
  return (
    <section id="precios" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Planes</span>
          <h2 className="section-title">Elige tu plan</h2>
          <p className="section-sub">
            Comienza sin costo y escala según tus necesidades de orientación legal.
          </p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.card} ${plan.featured ? styles.featured : ''}`}
            >
              {plan.featured && (
                <span className={styles.featuredTag}>Más popular</span>
              )}
              <p className={styles.planName}>{plan.name}</p>
              <p className={styles.planPrice}>
                {plan.price} <span>{plan.period}</span>
              </p>
              <p className={styles.planTokens}>{plan.tokens}</p>
              <ul className={styles.features}>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                className={plan.featured ? styles.btnGold : styles.btnGhost}
                onClick={() => handlePlanClick(plan)}
              >
                {plan.price === 'S/ 0' ? 'Empezar gratis' : 'Suscribirse'}
              </button>
            </div>
          ))}
        </div>

        <p className={styles.note}>
          Los precios incluyen IGV. Puedes cancelar tu suscripción en cualquier momento.
        </p>
      </div>
    </section>
  )
}
