import { Link, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import styles from './TermsPage.module.css'

const LAST_UPDATED = 'julio de 2026'

const sections = [
  {
    title: '1. Objeto del servicio',
    paragraphs: [
      'LegalFam es un asistente digital que brinda orientación informativa sobre Derecho de Familia peruano, en particular alimentos, tenencia, filiación y medidas de protección.',
      'El servicio no constituye asesoría legal ni patrocinio jurídico, y no reemplaza la consulta con un abogado titulado. Las respuestas son orientativas y no generan una relación abogado-cliente.',
      'Si existe riesgo actual para ti, un menor de edad u otra persona, acude directamente a los canales oficiales de emergencia.',
    ],
  },
  {
    title: '2. Cuenta de usuario',
    paragraphs: [
      'Para usar el chat debes crear una cuenta con un correo electrónico válido y un número de contacto. Eres responsable de la veracidad de esos datos y de mantener la confidencialidad de tu contraseña.',
      'La cuenta es personal e intransferible. No está permitido usar el servicio para fines comerciales, para revender las respuestas, ni para automatizar consultas masivas.',
      'Puedes solicitar la eliminación de tu cuenta y de tu historial de consultas en cualquier momento.',
    ],
  },
  {
    title: '3. Tokens y compras dentro de la aplicación',
    paragraphs: [
      'El uso de LegalFam es gratuito: toda cuenta recibe un balance mensual de tokens sin costo alguno. Cada consulta descuenta tokens cuando la respuesta queda lista: hasta 1 token para preguntas simples o no relacionadas con Derecho de Familia, y hasta 3 tokens cuando la respuesta se apoya en fuentes legales.',
      'La aplicación incluye compras opcionales: planes de suscripción mensual que amplían el balance de tokens. Ningún plan de pago es necesario para usar el servicio con el balance gratuito.',
      'Los pagos se procesan a través de Mercado Pago. LegalFam no almacena los datos de tu tarjeta. Puedes cancelar tu suscripción en cualquier momento desde la vista de configuración; el plan permanece activo hasta el final del periodo ya pagado y no se renueva.',
    ],
  },
  {
    title: '4. Tratamiento de datos personales',
    paragraphs: [
      'Tratamos tus datos conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su reglamento.',
      'No compartimos ni vendemos tu información personal a terceros con fines comerciales o publicitarios. Las consultas legales se procesan de forma anonimizada y ningún abogado externo tiene acceso a tu historial de conversaciones.',
      'Conservamos tu historial solo el tiempo necesario para prestarte el servicio. Te recomendamos no incluir datos personales innecesarios en tus consultas, como DNI, teléfono, correo o dirección.',
      'Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) escribiendo a privacidad@legalfam.pe.',
    ],
  },
  {
    title: '5. Limitación de responsabilidad',
    paragraphs: [
      'LegalFam no se responsabiliza por decisiones tomadas exclusivamente sobre la base de la orientación brindada por el asistente. La normativa peruana puede cambiar y cada caso concreto tiene particularidades que requieren evaluación profesional.',
      'El servicio se ofrece tal como está. No garantizamos disponibilidad ininterrumpida ni ausencia de errores en las respuestas generadas automáticamente.',
    ],
  },
  {
    title: '6. Cambios en los términos',
    paragraphs: [
      'Podemos actualizar estos términos para reflejar cambios en el servicio o en la normativa aplicable. Publicaremos la versión vigente en esta misma página, indicando la fecha de la última actualización.',
      'El uso continuado del servicio después de una actualización implica la aceptación de los términos vigentes.',
    ],
  },
]

export default function TermsPage() {
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/')
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
          <span className={styles.eyebrow}>Legal</span>
          <h1>Términos y Condiciones</h1>
          <p>
            Estas condiciones regulan el uso de LegalFam. Al crear una cuenta declaras haberlas leído y aceptado.
          </p>
          <p className={styles.updated}>Última actualización: {LAST_UPDATED}</p>
        </section>

        {sections.map((section) => (
          <section key={section.title} className={styles.card}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section className={styles.callout}>
          <h2>¿Necesitas ayuda urgente?</h2>
          <p>
            Si hay riesgo actual para ti o para un menor de edad, no esperes una respuesta del asistente.
          </p>
          <Link to="/contactos-emergencia" className={styles.calloutLink}>
            Ver contactos de emergencia
          </Link>
        </section>
      </main>
    </div>
  )
}
