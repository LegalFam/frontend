import { useT } from '@/i18n/traducir'
import styles from './PrivacidadSection.module.css'

const items = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    clave: 'control',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9"/>
        <path d="M5.6 5.6l12.8 12.8"/>
      </svg>
    ),
    clave: 'sinVenta',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    clave: 'retencion',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>
      </svg>
    ),
    clave: 'transparencia',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a9.12 9.12 0 0 0 5.39-1.61"/>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M1 1l22 22"/>
      </svg>
    ),
    clave: 'anonimizacion',
  },
]

export default function PrivacidadSection() {
  const t = useT()

  return (
    <section id="privacidad" className={styles.section}>
      <div className="container">
        <div className={styles.split}>
          <div className={styles.intro}>
            <div className={styles.header}>
              <span className="section-eyebrow">{t('landing.privacidad.eyebrow')}</span>
              <h2 className="section-title">{t('landing.privacidad.titulo')}</h2>
              <p className="section-sub">{t('landing.privacidad.sub')}</p>
            </div>
            <div className={styles.contact}>
              <h3>{t('landing.privacidad.contactoTitulo')}</h3>
              {/* El correo es un nodo hermano, no va a mitad de frase: así el orden de las
                  palabras puede cambiar en cada lengua sin romper el enlace. */}
              <p>
                {t('landing.privacidad.contactoTexto')}{' '}
                <a href="mailto:privacidad@legalfam.pe">privacidad@legalfam.pe</a>
              </p>
            </div>
          </div>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.clave} className={styles.item}>
                <div className={styles.icon}>{item.icon}</div>
                <div className={styles.body}>
                  <h3>{t(`landing.privacidad.${item.clave}`)}</h3>
                  <p>{t(`landing.privacidad.${item.clave}Desc`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
