import { Link, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import BilingualLegalText from '@/components/common/BilingualLegalText'
import { useT } from '@/i18n/translate'
import styles from './TermsPage.module.css'

// Sólo la estructura: cuántas secciones hay y cuántos párrafos tiene cada una. El texto vive
// en el catálogo (terminos.sNtitulo / terminos.sNpM) y se muestra a través de
// BilingualLegalText, que deja el español a un clic: es un documento normativo y la versión
// en español es la que prevalece.
const SECCIONES = [
  { clave: 's1', parrafos: 3 },
  { clave: 's2', parrafos: 3 },
  { clave: 's3', parrafos: 3 },
  { clave: 's4', parrafos: 4 },
  { clave: 's5', parrafos: 2 },
  { clave: 's6', parrafos: 2 },
]

export default function TermsPage() {
  const t = useT()
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
          {t('comun.volver')}
        </button>
        <Link to="/" className={styles.logo} aria-label={t('pago.irAlInicio')}>
          <img src={logoImg} alt="LegalFam" />
          <span>LEGALFAM</span>
        </Link>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.main}>
        <BilingualLegalText avisoClassName={styles.aviso}>
          {(tLegal) => (
            <>
              <section className={styles.hero}>
                <span className={styles.eyebrow}>{tLegal('terminos.eyebrow')}</span>
                <h1>{tLegal('terminos.titulo')}</h1>
                <p>{tLegal('terminos.intro')}</p>
                <p className={styles.updated}>{tLegal('terminos.actualizacion')}</p>
              </section>

              {SECCIONES.map(({ clave, parrafos }) => (
                <section key={clave} className={styles.card}>
                  <h2>{tLegal(`terminos.${clave}Titulo`)}</h2>
                  {Array.from({ length: parrafos }, (_, i) => (
                    <p key={i}>{tLegal(`terminos.${clave}p${i + 1}`)}</p>
                  ))}
                </section>
              ))}

              <section className={styles.callout}>
                <h2>{tLegal('terminos.ayudaTitulo')}</h2>
                <p>{tLegal('terminos.ayudaTexto')}</p>
                <Link to="/contactos-emergencia" className={styles.calloutLink}>
                  {tLegal('terminos.ayudaEnlace')}
                </Link>
              </section>
            </>
          )}
        </BilingualLegalText>
      </main>
    </div>
  )
}
