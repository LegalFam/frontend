import styles from './ComoSection.module.css'

const steps = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: 'Regístrate gratis',
    desc: 'Crea tu cuenta con correo, nombre y número de celular peruano. Sin tarjeta de crédito requerida.',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Describe tu situación',
    desc: 'Escribe tu consulta en lenguaje natural. El sistema entiende el contexto de tu caso familiar.',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    title: 'Recibe orientación',
    desc: 'Respuesta clara con fuentes legales citadas: artículos del Código Civil y normativa peruana vigente.',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Evalúa la respuesta',
    desc: 'Califica la orientación recibida para ayudarnos a mejorar continuamente la precisión del sistema.',
  },
]

export default function ComoSection() {
  return (
    <section id="como" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Proceso</span>
          <h2 className="section-title">Cómo funciona</h2>
          <p className="section-sub">
            En cuatro pasos simples obtienes orientación jurídica fundamentada
            en la normativa peruana vigente.
          </p>
        </div>

        <div className={styles.grid}>
          {steps.map((s) => (
            <div key={s.num} className={styles.card}>
              <span className={styles.stepNum}>{s.num}</span>
              <div className={styles.icon}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
