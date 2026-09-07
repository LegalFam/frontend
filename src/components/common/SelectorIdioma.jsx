import { IDIOMAS } from '@/i18n/languages'
import { useT } from '@/i18n/traducir'
import { useIdiomaStore } from '@/store/idiomaStore'
import styles from './SelectorIdioma.module.css'

// Control unico de idioma. Aparece en la barra de la portada, en el pie del cuadro de texto del
// chat y en Configuracion; los tres escriben en el mismo store, asi que la eleccion es una sola
// venga de donde venga.
export default function SelectorIdioma({ className = '' }) {
  const t = useT()
  const idioma = useIdiomaStore((estado) => estado.idioma)
  const cambiarIdioma = useIdiomaStore((estado) => estado.cambiarIdioma)

  return (
    <div className={`${styles.picker} ${className}`} role="group" aria-label={t('comun.idioma')}>
      {IDIOMAS.map((opcion) => (
        <button
          key={opcion.codigo}
          type="button"
          className={`${styles.btn} ${idioma === opcion.codigo ? styles.btnActive : ''}`}
          onClick={() => cambiarIdioma(opcion.codigo)}
          aria-pressed={idioma === opcion.codigo}
          // La etiqueta va en la propia lengua para que se reconozca sin saber español; el
          // nombre en español queda en el title para quien no reconozca la etiqueta.
          title={opcion.nombre}
          lang={opcion.codigo}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  )
}
