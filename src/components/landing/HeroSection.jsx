import { useEffect, useState } from 'react'
import { useEdgeSafeTooltip } from '@/hooks/useEdgeSafeTooltip'
import { useT } from '@/i18n/traducir'
import styles from './HeroSection.module.css'

const stats = [
  { num: '+90%', clave: 'stat1' },
  { num: '24/7', clave: 'stat2' },
  { num: '100%', clave: 'stat3', info: 'landing.hero.stat3Info' },
]

const trustItems = [
  { icon: 'shield', clave: 'landing.hero.sello1' },
  { icon: 'lock',   clave: 'landing.hero.sello2' },
  { icon: 'check',  clave: 'landing.hero.sello3' },
]

function StatInfo({ text }) {
  const { ref, recalc } = useEdgeSafeTooltip()

  return (
    <span
      className={styles.infoWrap}
      tabIndex={0}
      role="note"
      aria-label={text}
      onPointerEnter={recalc}
      onFocus={recalc}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="11" x2="12" y2="16.5"/>
        <line x1="12" y1="7.5" x2="12" y2="7.5"/>
      </svg>
      <span className={styles.tooltip} ref={ref}>{text}</span>
    </span>
  )
}

export default function HeroSection({ isAuthenticated, onPrimaryClick, onScrollComo }) {
  const t = useT()
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
            {t('landing.hero.pill')}
          </div>

          <h1 className={`${styles.headline} ${loaded ? 'anim-fade-up delay-1' : ''}`}>
            {t('landing.hero.titulo1')}<br />
            <em className={styles.italic}>{t('landing.hero.tituloEnfasis')}</em> {t('landing.hero.titulo2')}<br />
            {t('landing.hero.titulo3')}
          </h1>

          <p className={`${styles.desc} ${loaded ? 'anim-fade-up delay-2' : ''}`}>
            {t('landing.hero.descripcion')}
          </p>

          <div className={`${styles.heroBtns} ${loaded ? 'anim-fade-up delay-3' : ''}`}>
            <button className={styles.btnPrimary} onClick={onPrimaryClick}>
              {isAuthenticated ? t('landing.hero.irAlChat') : t('landing.hero.comenzar')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className={styles.btnSecondary} onClick={onScrollComo}>
              {t('landing.hero.verComo')}
            </button>
          </div>

          <div className={`${styles.trustBar} ${loaded ? 'anim-fade-up delay-4' : ''}`}>
            {trustItems.map((item, i) => (
              <span key={i} className={styles.trustItem}>
                {i > 0 && <span className={styles.trustDot} />}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
                  {item.icon === 'shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                  {item.icon === 'lock'   && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                  {item.icon === 'check'  && <polyline points="20 6 9 17 4 12"/>}
                </svg>
                {t(item.clave)}
              </span>
            ))}
          </div>
        </div>

        <div className={`${styles.contentRight} ${loaded ? 'anim-fade-in delay-2' : ''}`}>
          {stats.map((s) => (
            <div key={s.num} className={styles.statBox}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>
                <span className={styles.statLabelText}>
                  {t(`landing.hero.${s.clave}`)}
                  {s.info && <StatInfo text={t(s.info)} />}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.scrollHint} onClick={onScrollComo} aria-label={t('landing.hero.verComo')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  )
}
