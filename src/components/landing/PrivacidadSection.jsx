import styles from './PrivacidadSection.module.css'

const items = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Datos bajo tu control',
    desc: 'Eres el titular de tu información. Puedes consultar, rectificar o eliminar tus datos personales en cualquier momento.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Sin venta de datos',
    desc: 'Nunca compartimos ni vendemos tu información personal a terceros con fines comerciales o publicitarios.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Retención limitada',
    desc: 'Conservamos tu historial de consultas solo el tiempo necesario para brindarte el servicio. Puedes solicitar la eliminación de tu cuenta en todo momento.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Transparencia total',
    desc: 'Te informamos con claridad qué datos recopilamos, para qué los usamos y con quién los compartimos cuando sea necesario.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Anonimización de consultas',
    desc: 'Las consultas legales se procesan de forma anonimizada. Ningún abogado externo tiene acceso a tu historial de conversaciones.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'Contacto de privacidad',
    desc: 'Para ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación, Oposición) escríbenos a privacidad@legalfam.pe',
  },
]

export default function PrivacidadSection() {
  return (
    <section id="privacidad" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Privacidad</span>
          <h2 className="section-title">Tu privacidad es nuestra prioridad</h2>
          <p className="section-sub">
            Tratamos tus datos conforme a la Ley N.° 29733 de Protección de Datos Personales
            y las mejores prácticas internacionales de privacidad.
          </p>
        </div>
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.title} className={styles.card}>
              <div className={styles.icon}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
