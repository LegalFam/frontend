import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import LanguageSelector from '@/components/common/LanguageSelector'
import { useT } from '@/i18n/translate'
import styles from './Navbar.module.css'

export default function Navbar({
  isAuthenticated,
  onLoginClick,
  onRegisterClick,
  onChatClick,
  onSignoutClick,
}) {
  const t = useT()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
    setActive(id)
  }

  // Solo los identificadores de sección: el rótulo sale del catálogo en el render, para que
  // cambie al cambiar de idioma.
  const links = ['sobre', 'como', 'precios', 'seguridad', 'privacidad']

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <Link to="/" className={styles.logo} aria-label={t('nav.inicio')}>
          <img src={logoImg} alt="LegalFam" className={styles.logoImg} />
          <span className={styles.logoText}>LEGALFAM</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map((id) => (
            <a
              key={id}
              className={`${styles.link} ${active === id ? styles.linkActive : ''}`}
              onClick={() => scrollTo(id)}
            >
              {t(`nav.${id}`)}
            </a>
          ))}

          <div className={styles.mobileBtns}>
            <LanguageSelector className={styles.mobileLanguage} />
            {isAuthenticated ? (
              <>
                <button className={`btn-accent ${styles.mobileAuthBtn}`} onClick={() => { setMenuOpen(false); onChatClick() }}>{t('nav.irAlChat')}</button>
                <button className={`${styles.signoutBtn} ${styles.mobileAuthBtn}`} onClick={() => { setMenuOpen(false); onSignoutClick() }}>{t('nav.cerrarSesion')}</button>
              </>
            ) : (
              <>
                <button className={`btn-ghost ${styles.mobileAuthBtn}`} onClick={() => { setMenuOpen(false); onLoginClick() }}>{t('nav.iniciarSesion')}</button>
                <button className={`btn-accent ${styles.mobileAuthBtn}`} onClick={() => { setMenuOpen(false); onRegisterClick() }}>{t('nav.registrarse')}</button>
              </>
            )}
          </div>
        </div>

        <div className={styles.btns}>
          {/* El selector va antes que los botones de sesión: quien no lee español tiene que
              poder cambiar de lengua antes de decidir si entra. */}
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <button className="btn-accent" onClick={onChatClick}>{t('nav.irAlChat')}</button>
              <button className={styles.signoutBtn} onClick={onSignoutClick}>{t('nav.cerrarSesion')}</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={onLoginClick}>{t('nav.iniciarSesion')}</button>
              <button className="btn-accent" onClick={onRegisterClick}>{t('nav.registrarse')}</button>
            </>
          )}
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={t('nav.menu')}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>
      {menuOpen && <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)} />}
    </>
  )
}
