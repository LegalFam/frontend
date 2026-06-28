import { Link, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import styles from './SpecialistAssistancePage.module.css'

const helpResources = [
  {
    name: 'Policía Nacional del Perú',
    shortName: 'PNP',
    useFor: 'Peligro inmediato, agresión en curso, amenazas graves o necesidad de acudir a una comisaría.',
    availability: 'Emergencias policiales a nivel nacional.',
    actions: [
      { label: 'Llamar al 105', href: 'tel:105', primary: true },
      {
        label: 'Contactos de emergencia PNP',
        href: 'https://www.gob.pe/institucion/pnp/contacto-y-numeros-de-emergencias',
      },
      {
        label: 'Ubicar comisaria cercana',
        href: 'https://www.gob.pe/912-ubicar-la-comisaria-mas-cercana',
      },
    ],
  },
  {
    name: 'Centros Emergencia Mujer',
    shortName: 'CEM',
    useFor: 'Violencia contra mujeres, integrantes del grupo familiar o violencia sexual. Brindan orientación legal, psicológica y social.',
    availability: 'Línea 100 disponible para orientación nacional; Chat 100 atiende por canal digital según horario informado por Warmi Ñan.',
    actions: [
      { label: 'Llamar a Línea 100', href: 'tel:100', primary: true },
      { label: 'Abrir Chat 100', href: 'https://chat100.warminan.gob.pe/' },
      {
        label: 'Directorio de servicios CEM',
        href: 'https://www.gob.pe/institucion/warmi%C3%B1an/informes-publicaciones/3487068-directorio-de-servicios-del-programa-nacional-warmi-nan',
      },
    ],
  },
  {
    name: 'Defensoría Municipal del Niño y del Adolescente',
    shortName: 'DEMUNA',
    useFor: 'Riesgo o vulneración de derechos de niños, niñas y adolescentes, incluyendo maltrato, abandono, alimentos, tenencia o régimen de visitas.',
    availability: 'Servicio municipal gratuito. La atención depende de la municipalidad de tu distrito o provincia.',
    actions: [
      {
        label: 'Información oficial DEMUNA',
        href: 'https://www.gob.pe/30753-defensoria-municipal-del-nino-y-del-adolescente-demuna',
        primary: true,
      },
      {
        label: 'Buscar tu municipalidad',
        href: 'https://www.gob.pe/busquedas?contenido%5B%5D=instituciones&reason=sheet&sheet=1&term=municipalidad',
      },
    ],
  },
]

export default function SpecialistAssistancePage() {
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
          Volver
        </button>
        <Link to="/" className={styles.logo} aria-label="Ir al inicio">
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </Link>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Contactos de emergencia</span>
          <h1>Canales oficiales para situaciones de emergencia</h1>
          <p>
          Si hay riesgo actual para ti, un menor de edad u otra persona, usa los canales de emergencia directamente.
            LegalFam no contacta instituciones por ti.
          </p>
        </section>

        <section className={styles.emergencyBand} aria-labelledby="emergency-title">
          <div>
            <span className={styles.emergencyLabel}>Peligro inmediato</span>
            <h2 id="emergency-title">Llama a la PNP al 105</h2>
            <p>Si la agresión está ocurriendo o existe una amenaza grave, prioriza llamar a emergencias o acudir a la comisaría más cercana.</p>
          </div>
          <a className={styles.emergencyCall} href="tel:105">Llamar 105</a>
        </section>

        <section className={styles.resourceGrid} aria-label="Instituciones de apoyo especializado">
          {helpResources.map((resource) => (
            <article key={resource.shortName} className={styles.resourceCard}>
              <div className={styles.cardHeader}>
                <span>{resource.shortName}</span>
                <h2>{resource.name}</h2>
              </div>
              <p className={styles.useFor}>{resource.useFor}</p>
              <p className={styles.availability}>{resource.availability}</p>
              <div className={styles.actions}>
                {resource.actions.map((action) => (
                  <a
                    key={action.href}
                    className={action.primary ? styles.primaryAction : styles.secondaryAction}
                    href={action.href}
                    target={action.href.startsWith('http') ? '_blank' : undefined}
                    rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className={styles.safetyNote}>
          <strong>Antes de contactar</strong>
          <p>
            Si puedes hacerlo sin ponerte en riesgo, ten a la mano una descripción breve de lo ocurrido, ubicación general,
            edades aproximadas de las personas afectadas y cualquier evidencia relevante. Evita exponerte para reunir pruebas.
          </p>
        </section>
      </main>
    </div>
  )
}
