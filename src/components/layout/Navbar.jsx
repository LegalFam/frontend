import { useState, useEffect } from 'react'
import logoImg from '@/assets/logo.png'
import styles from './Navbar.module.css'

export default function Navbar({
  isAuthenticated,
  onLoginClick,
  onRegisterClick,
  onChatClick,
  onSignoutClick,
}) {
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

  const links = [
    { id: 'sobre', label: 'Sobre nosotros' },
    { id: 'como', label: 'Como funciona' },
    { id: 'precios', label: 'Precios' },
    { id: 'seguridad', label: 'Seguridad' },
    { id: 'privacidad', label: 'Privacidad' },
  ]

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#" className={styles.logo} aria-label="LegalFam inicio">
          <img src={logoImg} alt="LegalFam" className={styles.logoImg} />
          <span className={styles.logoText}>LEGALFAM</span>
        </a>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(({ id, label }) => (
            <a
              key={id}
              className={`${styles.link} ${active === id ? styles.linkActive : ''}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </a>
          ))}
        </div>

        <div className={styles.btns}>
          {isAuthenticated ? (
            <>
              <button className="btn-gold" onClick={onChatClick}>Ir al chat</button>
              <button className={styles.signoutBtn} onClick={onSignoutClick}>Cerrar sesion</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={onLoginClick}>Iniciar sesion</button>
              <button className="btn-gold" onClick={onRegisterClick}>Registrarse</button>
            </>
          )}
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>
      {menuOpen && <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)} />}
    </>
  )
}
