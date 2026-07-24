import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import styles from './BannerSection.module.css'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export function BannerSection() {
  return (
    <section className={styles.banner}>
      <img
        src="https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1600&q=80"
        alt="" aria-hidden="true" loading="lazy"
      />
      <div className={styles.overlay}>
        <div className={styles.text}>
          <blockquote>
            "El acceso a la justicia no debería depender de cuánto dinero tienes en el bolsillo."
          </blockquote>
          <cite>— LegalFam, 2026</cite>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <img src={logoImg} alt="LegalFam" className={styles.footerLogo} />
          <div>
            <div className={styles.footerLogoText}>LEGALFAM</div>
            <p className={styles.footerTagline}>Justicia accesible para todos</p>
          </div>
        </div>
        <nav className={styles.footerLinks}>
          <button onClick={() => scrollTo('sobre')}>Sobre nosotros</button>
          <button onClick={() => scrollTo('precios')}>Precios</button>
          <button onClick={() => scrollTo('seguridad')}>Seguridad</button>
          <button onClick={() => scrollTo('privacidad')}>Privacidad</button>
          <Link to="/terminos">Términos y Condiciones</Link>
        </nav>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 LegalFam — Universidad Peruana de Ciencias Aplicadas. Todos los derechos reservados.</p>
        <p>Este sistema brinda orientación informativa y no reemplaza el asesoramiento de un abogado titulado.</p>
      </div>
    </footer>
  )
}
