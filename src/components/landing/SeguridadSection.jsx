import styles from './SeguridadSection.module.css'

const items = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'ISO/IEC 27001',
    desc: 'Gestión de seguridad de la información con estándares internacionales certificados para sistemas tecnológicos.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: 'Ley N. 29733',
    desc: 'Cumplimiento de la ley peruana de protección de datos personales en todo el tratamiento de tu información.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    title: 'Cifrado SSL/TLS',
    desc: 'Toda la comunicación entre tu dispositivo y nuestros servidores viaja cifrada de extremo a extremo.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    title: 'ISO/IEC 29100',
    desc: 'Marco de privacidad para el tratamiento adecuado de información personal de los usuarios del sistema.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Ley N. 31814',
    desc: 'Uso responsable de inteligencia artificial conforme a la normativa peruana vigente de innovación tecnológica.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    title: 'Autenticación JWT',
    desc: 'Tokens de acceso seguros con rotación automática y expiración configurable para proteger tu sesión.',
  },
]

export default function SeguridadSection() {
  return (
    <section id="seguridad" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Seguridad</span>
          <h2 className="section-title">Tu información está protegida</h2>
          <p className="section-sub">
            Cumplimos estándares internacionales y la normativa peruana vigente
            en protección de datos personales.
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
