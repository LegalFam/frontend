import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { useT } from '@/i18n/translate'
import styles from './BannerSection.module.css'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export function BannerSection() {
  const t = useT()

  return (
    <section className={styles.banner}>
      <img
        src="https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1600&q=80"
        alt="" aria-hidden="true" loading="lazy"
      />
      <div className={styles.overlay}>
        <div className={styles.text}>
          <blockquote>{t('landing.banner.cita')}</blockquote>
          <cite>{t('landing.banner.firma')}</cite>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const t = useT()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <img src={logoImg} alt="LegalFam" className={styles.footerLogo} />
          <div>
            <div className={styles.footerLogoText}>LEGALFAM</div>
            <p className={styles.footerTagline}>{t('landing.footer.lema')}</p>
          </div>
        </div>
        <nav className={styles.footerLinks}>
          <button onClick={() => scrollTo('sobre')}>{t('nav.sobre')}</button>
          <button onClick={() => scrollTo('precios')}>{t('nav.precios')}</button>
          <button onClick={() => scrollTo('seguridad')}>{t('nav.seguridad')}</button>
          <button onClick={() => scrollTo('privacidad')}>{t('nav.privacidad')}</button>
          <Link to="/terminos">{t('landing.footer.terminos')}</Link>
        </nav>
      </div>
      <div className={styles.footerBottom}>
        <p>{t('landing.footer.derechos')}</p>
        <p>{t('landing.footer.aviso')}</p>
      </div>
    </footer>
  )
}
