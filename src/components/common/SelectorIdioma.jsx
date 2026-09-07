import { useEffect, useRef, useState } from 'react'
import { IDIOMAS, idiomaPorCodigo } from '@/i18n/languages'
import { useT } from '@/i18n/traducir'
import { useIdiomaStore } from '@/store/idiomaStore'
import styles from './SelectorIdioma.module.css'

// Control unico de idioma. Aparece en la barra de la portada, en la del chat y en
// Configuracion; todos escriben en el mismo store, asi que la eleccion es una sola venga de
// donde venga.
//
// Con `compacto` se dibuja como un solo boton que abre las tres opciones. Es para la barra del
// chat en movil, donde las tres etiquetas de corrido ocupan 220px y no caben junto al chip de
// tokens. Lo que no se hace nunca es abreviar las etiquetas a "ES / QU / AY": el nombre en la
// propia lengua es justo lo que hace reconocible el control para quien no lee espanol, asi que
// el boton muestra el idioma activo con su nombre completo.
export default function SelectorIdioma({ className = '', compacto = false }) {
  const t = useT()
  const idioma = useIdiomaStore((estado) => estado.idioma)
  const cambiarIdioma = useIdiomaStore((estado) => estado.cambiarIdioma)
  const [abierto, setAbierto] = useState(false)
  const cajaRef = useRef(null)

  // Cerrar al tocar fuera o al pulsar Escape. Sin esto el desplegable se queda abierto tapando
  // la conversacion.
  useEffect(() => {
    if (!compacto || !abierto) return undefined

    const fuera = (e) => {
      if (!cajaRef.current?.contains(e.target)) setAbierto(false)
    }
    const escape = (e) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', escape)
    }
  }, [compacto, abierto])

  const opciones = IDIOMAS.map((opcion) => (
    <button
      key={opcion.codigo}
      type="button"
      className={`${styles.btn} ${idioma === opcion.codigo ? styles.btnActive : ''}`}
      onClick={() => {
        cambiarIdioma(opcion.codigo)
        setAbierto(false)
      }}
      aria-pressed={idioma === opcion.codigo}
      // La etiqueta va en la propia lengua para que se reconozca sin saber español; el
      // nombre en español queda en el title para quien no reconozca la etiqueta.
      title={opcion.nombre}
      lang={opcion.codigo}
    >
      {opcion.etiqueta}
    </button>
  ))

  if (!compacto) {
    return (
      <div className={`${styles.picker} ${className}`} role="group" aria-label={t('comun.idioma')}>
        {opciones}
      </div>
    )
  }

  const activo = idiomaPorCodigo(idioma)

  return (
    <div className={`${styles.compacto} ${className}`} ref={cajaRef}>
      <button
        type="button"
        className={styles.disparador}
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="true"
        title={t('comun.idioma')}
        lang={activo.codigo}
      >
        {activo.etiqueta}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {abierto && (
        <div className={styles.menu} role="group" aria-label={t('comun.idioma')}>
          {opciones}
        </div>
      )}
    </div>
  )
}
