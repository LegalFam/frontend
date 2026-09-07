import { useT } from '@/i18n/traducir'
import styles from './SeguridadSection.module.css'

const items = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    clave: 'iso27001',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    clave: 'ley29733',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    clave: 'ssl',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    clave: 'iso29100',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    clave: 'ley31814',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    clave: 'jwt',
  },
]

export default function SeguridadSection() {
  const t = useT()

  return (
    <section id="seguridad" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">{t('landing.seguridad.eyebrow')}</span>
          <h2 className="section-title">{t('landing.seguridad.titulo')}</h2>
          <p className="section-sub">{t('landing.seguridad.sub')}</p>
        </div>
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.clave} className={styles.card}>
              <div className={styles.icon}>{item.icon}</div>
              <h3>{t(`landing.seguridad.${item.clave}`)}</h3>
              <p>{t(`landing.seguridad.${item.clave}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
