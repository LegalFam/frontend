import styles from './PrivacidadSection.module.css'

const items = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'Datos bajo tu control',
    desc: 'Eres el titular de tu información. Puedes consultar, rectificar o eliminar tus datos personales en cualquier momento.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9"/>
        <path d="M5.6 5.6l12.8 12.8"/>
      </svg>
    ),
    title: 'Sin venta de datos',
    desc: 'Nunca compartimos ni vendemos tu información personal a terceros con fines comerciales o publicitarios.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    title: 'Retención limitada',
    desc: 'Conservamos tu historial de consultas solo el tiempo necesario para brindarte el servicio. Puedes solicitar la eliminación de tu cuenta en todo momento.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>
      </svg>
    ),
    title: 'Transparencia total',
    desc: 'Te informamos con claridad qué datos recopilamos, para qué los usamos y con quién los compartimos cuando sea necesario.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a9.12 9.12 0 0 0 5.39-1.61"/>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M1 1l22 22"/>
      </svg>
    ),
    title: 'Anonimización de consultas',
    desc: 'Las consultas legales se procesan de forma anonimizada. Ningún abogado externo tiene acceso a tu historial de conversaciones.',
  },
]

export default function PrivacidadSection() {
  return (
    <section id="privacidad" className={styles.section}>
      <div className="container">
        <div className={styles.split}>
          <div className={styles.intro}>
            <div className={styles.header}>
              <span className="section-eyebrow">Privacidad</span>
              <h2 className="section-title">Tu privacidad es nuestra prioridad</h2>
              <p className="section-sub">
                Tratamos tus datos conforme a la Ley N.° 29733 de Protección de Datos Personales
                y las mejores prácticas internacionales de privacidad.
              </p>
            </div>
            <div className={styles.contact}>
              <h3>Contacto de privacidad</h3>
              <p>
                Para ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación,
                Oposición) escríbenos a <a href="mailto:privacidad@legalfam.pe">privacidad@legalfam.pe</a>
              </p>
            </div>
          </div>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.title} className={styles.item}>
                <div className={styles.icon}>{item.icon}</div>
                <div className={styles.body}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
