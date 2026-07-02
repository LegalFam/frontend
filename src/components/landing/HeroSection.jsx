import { useEffect, useState } from 'react'
import styles from './HeroSection.module.css'

const stats = [
  { num: '+90%', label: 'Precisión validada' },
  { num: '24/7', label: 'Disponibilidad'     },
  { num: '100%', label: 'Gratuito al inicio' },
]

export default function HeroSection({ isAuthenticated, onPrimaryClick, onScrollComo }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t) }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=80"
          alt="" aria-hidden="true" loading="eager" />
        <div className={styles.overlay} />
        <div className={styles.overlayBottom} />
      </div>

      <div className={`${styles.content} container`}>
        <div className={styles.contentLeft}>
          <div className={`${styles.pill} ${loaded ? 'anim-fade-up' : ''}`}>
            <span className={styles.pillDot} />
            Derecho de Familia en el Perú
          </div>

          <h1 className={`${styles.headline} ${loaded ? 'anim-fade-up delay-1' : ''}`}>
            Tu derecho a la<br />
            <em className={styles.italic}>justicia</em> no<br />
            tiene precio.
          </h1>

          <p className={`${styles.desc} ${loaded ? 'anim-fade-up delay-2' : ''}`}>
            Orientación jurídica automatizada, clara y accesible para alimentos,
            tenencia, filiación y medidas de protección — disponible las 24 horas.
          </p>

          <div className={`${styles.heroBtns} ${loaded ? 'anim-fade-up delay-3' : ''}`}>
            <button className={styles.btnPrimary} onClick={onPrimaryClick}>
              {isAuthenticated ? 'Ir al chat' : 'Comenzar gratis'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className={styles.btnSecondary} onClick={onScrollComo}>
              Ver cómo funciona
            </button>
          </div>

          <div className={`${styles.trustBar} ${loaded ? 'anim-fade-up delay-4' : ''}`}>
            {[
              { icon: 'shield', label: 'ISO/IEC 27001'    },
              { icon: 'lock',   label: 'Ley N. 29733'     },
              { icon: 'check',  label: 'Proyecto UPC 2026' },
            ].map((t, i) => (
              <span key={i} className={styles.trustItem}>
                {i > 0 && <span className={styles.trustDot} />}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
                  {t.icon === 'shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                  {t.icon === 'lock'   && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                  {t.icon === 'check'  && <polyline points="20 6 9 17 4 12"/>}
                </svg>
                {t.label}
              </span>
            ))}
          </div>
        </div>

        <div className={`${styles.contentRight} ${loaded ? 'anim-fade-in delay-2' : ''}`}>
          {stats.map((s) => (
            <div key={s.num} className={styles.statBox}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.scrollHint} onClick={onScrollComo} aria-label="Ver cómo funciona">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  )
}
