import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/logo.png'
import styles from './PaymentPage.module.css'

const PLANS = {
  basico: {
    name: 'Plan Básico',
    price: 'S/ 14.99',
    period: '/ mes',
    tokens: '500 tokens de consulta mensual',
    features: [
      'Consultas ilimitadas dentro del límite',
      'Historial completo de conversaciones',
      'Fuentes legales citadas con XAI',
      'Todos los temas de Derecho de Familia',
      'Calificación de respuestas',
      'Soporte por correo electrónico',
    ],
  },
  premium: {
    name: 'Plan Premium',
    price: 'S/ 49.99',
    period: '/ mes',
    tokens: '2,500 tokens de consulta mensual',
    features: [
      'Todo lo del Plan Básico',
      'Respuestas más detalladas y extensas',
      'Acceso prioritario en horas pico',
      'Descarga de resumen en PDF',
      'Análisis de documentos adjuntos',
      'Soporte prioritario 24/7',
    ],
  },
}

const formatCard = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export default function PaymentPage() {
  const { plan } = useParams()
  const navigate = useNavigate()
  const planData = PLANS[plan]

  const [fields, setFields] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [errs,   setErrs]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!planData) {
    navigate('/')
    return null
  }

  const set = (k, v) => setFields((p) => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!fields.name.trim()) e.name = 'Campo requerido.'
    if (fields.number.replace(/\s/g, '').length !== 16) e.number = 'Ingresa los 16 dígitos.'
    if (!/^\d{2}\/\d{2}$/.test(fields.expiry)) e.expiry = 'Formato MM/AA.'
    if (!/^\d{3,4}$/.test(fields.cvv)) e.cvv = '3 o 4 dígitos.'
    setErrs(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // TODO: conectar con pasarela de pagos del backend
    await new Promise((r) => setTimeout(r, 1800))
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src={logoImg} alt="LegalFam" />
            <span>LEGALFAM</span>
          </div>
        </header>
        <div className={styles.successWrap}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="32" height="32">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2>¡Suscripción activada!</h2>
            <p>Tu <strong>{planData.name}</strong> ha sido activado correctamente.<br />Ya puedes disfrutar de todos los beneficios.</p>
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
        {/* Plan summary */}
        <aside className={styles.summary}>
          <p className={styles.summaryLabel}>Resumen del plan</p>
          <p className={styles.planName}>{planData.name}</p>
          <p className={styles.planPrice}>{planData.price} <span>{planData.period}</span></p>
          <p className={styles.planTokens}>{planData.tokens}</p>
          <ul className={styles.features}>
            {planData.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <div className={styles.securityNote}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Pago 100% seguro · SSL/TLS
          </div>
        </aside>

        {/* Payment form */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Datos de pago</h2>
          <p className={styles.formSub}>Ingresa la información de tu tarjeta para completar la suscripción.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fg}>
              <label htmlFor="py-name">Nombre en la tarjeta</label>
              <input
                id="py-name" type="text" placeholder="María García"
                value={fields.name} onChange={(e) => set('name', e.target.value)}
                className={errs.name ? styles.hasError : ''}
                autoComplete="cc-name"
              />
              {errs.name && <span className="field-err">{errs.name}</span>}
            </div>

            <div className={styles.fg}>
              <label htmlFor="py-number">Número de tarjeta</label>
              <div className={styles.cardRow}>
                <input
                  id="py-number" type="text" placeholder="0000 0000 0000 0000"
                  value={fields.number}
                  onChange={(e) => set('number', formatCard(e.target.value))}
                  className={errs.number ? styles.hasError : ''}
                  autoComplete="cc-number" inputMode="numeric"
                />
                <span className={styles.cardIcons}>
                  <svg viewBox="0 0 38 24" width="32" height="20" fill="none">
                    <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                    <circle cx="15" cy="12" r="7" fill="#EB001B" opacity=".9"/>
                    <circle cx="23" cy="12" r="7" fill="#F79E1B" opacity=".9"/>
                    <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00"/>
                  </svg>
                </span>
              </div>
              {errs.number && <span className="field-err">{errs.number}</span>}
            </div>

            <div className={styles.row2}>
              <div className={styles.fg}>
                <label htmlFor="py-expiry">Vencimiento</label>
                <input
                  id="py-expiry" type="text" placeholder="MM/AA"
                  value={fields.expiry}
                  onChange={(e) => set('expiry', formatExpiry(e.target.value))}
                  className={errs.expiry ? styles.hasError : ''}
                  autoComplete="cc-exp" inputMode="numeric"
                />
                {errs.expiry && <span className="field-err">{errs.expiry}</span>}
              </div>
              <div className={styles.fg}>
                <label htmlFor="py-cvv">CVV</label>
                <input
                  id="py-cvv" type="password" placeholder="•••"
                  value={fields.cvv}
                  onChange={(e) => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={errs.cvv ? styles.hasError : ''}
                  autoComplete="cc-csc" inputMode="numeric"
                />
                {errs.cvv && <span className="field-err">{errs.cvv}</span>}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.loadingText}>
                  <span className={styles.spinner} />
                  Procesando pago...
                </span>
              ) : (
                <>
                  Pagar {planData.price}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <rect x="1" y="4" width="22" height="16" rx="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
