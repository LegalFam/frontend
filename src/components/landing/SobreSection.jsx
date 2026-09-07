import { useT } from '@/i18n/traducir'
import styles from './SobreSection.module.css'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    clave: 'rag',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    clave: 'xai',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    clave: 'todos',
  },
]

export default function SobreSection() {
  const t = useT()

  return (
    <section id="sobre" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.images}>
          <img
            className={styles.imgMain}
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80"
            alt={t('landing.sobre.imgPrincipal')}
            loading="lazy"
          />
          <img
            className={styles.imgAccent}
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
            alt={t('landing.sobre.imgSecundaria')}
            loading="lazy"
          />
          <div className={styles.badge}>
            <div className={styles.badgeNum}>UPC</div>
            <div className={styles.badgeLbl}>{t('landing.sobre.badge')}</div>
          </div>
        </div>

        <div className={styles.text}>
          <span className="section-eyebrow">{t('landing.sobre.eyebrow')}</span>
          <h2 className="section-title">{t('landing.sobre.titulo')}</h2>
          <p className={styles.intro}>{t('landing.sobre.intro')}</p>
          <div className={styles.features}>
            {features.map((f) => (
              <div key={f.clave} className={styles.featureItem}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <p>
                  <strong>{t(`landing.sobre.${f.clave}`)}:</strong> {t(`landing.sobre.${f.clave}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
