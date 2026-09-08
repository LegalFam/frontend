import { Link, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { useT } from '@/i18n/translate'
import styles from './SpecialistAssistancePage.module.css'

// Sólo los datos que no se traducen nunca: la sigla con la que se conoce a la institución y
// los teléfonos y enlaces oficiales. El nombre completo, para qué sirve y el horario salen
// del catálogo (contactos.*), donde el nombre propio de la institución también se mantiene
// en español: es el que aparece en la puerta y el que hay que decir al llamar.
const RECURSOS = [
  {
    sigla: 'PNP',
    clave: 'pnp',
    acciones: [
      { clave: 'pnpLlamar', href: 'tel:105', primary: true },
      { clave: 'pnpContactos', href: 'https://www.gob.pe/institucion/pnp/contacto-y-numeros-de-emergencias' },
      { clave: 'pnpComisaria', href: 'https://www.gob.pe/912-ubicar-la-comisaria-mas-cercana' },
    ],
  },
  {
    sigla: 'CEM',
    clave: 'cem',
    acciones: [
      { clave: 'cemLlamar', href: 'tel:100', primary: true },
      { clave: 'cemChat', href: 'https://chat100.warminan.gob.pe/' },
      {
        clave: 'cemDirectorio',
        href: 'https://www.gob.pe/institucion/warmi%C3%B1an/informes-publicaciones/3487068-directorio-de-servicios-del-programa-nacional-warmi-nan',
      },
    ],
  },
  {
    sigla: 'DEMUNA',
    clave: 'demuna',
    acciones: [
      {
        clave: 'demunaInfo',
        href: 'https://www.gob.pe/30753-defensoria-municipal-del-nino-y-del-adolescente-demuna',
        primary: true,
      },
      {
        clave: 'demunaMunicipalidad',
        href: 'https://www.gob.pe/busquedas?contenido%5B%5D=instituciones&reason=sheet&sheet=1&term=municipalidad',
      },
    ],
  },
]

export default function SpecialistAssistancePage() {
  const t = useT()
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/chat')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t('comun.volver')}
        </button>
        <Link to="/" className={styles.logo} aria-label={t('pago.irAlInicio')}>
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </Link>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>{t('contactos.eyebrow')}</span>
          <h1>{t('contactos.titulo')}</h1>
          <p>{t('contactos.intro')}</p>
        </section>

        <section className={styles.emergencyBand} aria-labelledby="emergency-title">
          <div>
            <span className={styles.emergencyLabel}>{t('contactos.peligroLabel')}</span>
            <h2 id="emergency-title">{t('contactos.peligroTitulo')}</h2>
            <p>{t('contactos.peligroTexto')}</p>
          </div>
          <a className={styles.emergencyCall} href="tel:105">{t('contactos.llamar105')}</a>
        </section>

        <section className={styles.resourceGrid} aria-label={t('contactos.listaAria')}>
          {RECURSOS.map((recurso) => (
            <article key={recurso.sigla} className={styles.resourceCard}>
              <div className={styles.cardHeader}>
                <span>{recurso.sigla}</span>
                <h2>{t(`contactos.${recurso.clave}Nombre`)}</h2>
              </div>
              <p className={styles.useFor}>{t(`contactos.${recurso.clave}Uso`)}</p>
              <p className={styles.availability}>{t(`contactos.${recurso.clave}Disponibilidad`)}</p>
              <div className={styles.actions}>
                {recurso.acciones.map((accion) => (
                  <a
                    key={accion.href}
                    className={accion.primary ? styles.primaryAction : styles.secondaryAction}
                    href={accion.href}
                    target={accion.href.startsWith('http') ? '_blank' : undefined}
                    rel={accion.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {t(`contactos.${accion.clave}`)}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className={styles.safetyNote}>
          <strong>{t('contactos.antesTitulo')}</strong>
          <p>{t('contactos.antesTexto')}</p>
        </section>
      </main>
    </div>
  )
}
