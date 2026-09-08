import { useT } from '@/i18n/translate'
import styles from './HowSection.module.css'

const steps = [
  {
    num: '01',
    clave: 'paso1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    num: '02',
    clave: 'paso2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    num: '03',
    clave: 'paso3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    num: '04',
    clave: 'paso4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

export default function HowSection() {
  const t = useT()

  return (
    <section id="como" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">{t('landing.como.eyebrow')}</span>
          <h2 className="section-title">{t('landing.como.titulo')}</h2>
          <p className="section-sub">{t('landing.como.sub')}</p>
        </div>

        <div className={styles.grid}>
          {steps.map((s) => (
            <div key={s.num} className={styles.card}>
              <span className={styles.stepNum}>{s.num}</span>
              <div className={styles.icon}>{s.icon}</div>
              <h3>{t(`landing.como.${s.clave}`)}</h3>
              <p>{t(`landing.como.${s.clave}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
