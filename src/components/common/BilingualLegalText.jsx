import { useState } from 'react'
import { AVISO_TRADUCCION, avisoTraduccion, idiomaPorCodigo } from '@/i18n/languages'
import { tEn, useT } from '@/i18n/translate'
import styles from './BilingualLegalText.module.css'

// Tira de aviso + conmutador que acompana a todo texto traducido a maquina. Estaba escrita a
// mano dentro de ChatMessage; vive aqui para que la convencion tenga una sola implementacion,
// porque ahora la usan tambien los terminos, el glosario y los avisos legales de la interfaz.
// `above` invierte el margen para cuando la tira precede al texto que advierte en lugar de
// seguirlo, como pasa en el chat.
export function TranslationNotice({ idioma, mostrandoEspanol, onToggle, className = '', above = false }) {
  const t = useT()
  if (!idioma || idioma === 'es') return null

  const aviso = avisoTraduccion(idioma)
  const etiqueta = idiomaPorCodigo(idioma).etiqueta

  return (
    <div className={`${styles.aviso} ${above ? styles.avisoAbove : ''} ${className}`}>
      <div className={styles.avisoTexto}>
        {/* El aviso en la lengua del usuario primero: uno en espanol no cumple su funcion con
            quien eligio no leer en espanol. */}
        {aviso.propio && <span lang={idioma}>{aviso.propio}</span>}
        <span className={styles.avisoEspanol}>{AVISO_TRADUCCION}</span>
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={onToggle}
        aria-pressed={mostrandoEspanol}
      >
        {mostrandoEspanol ? t('comun.verEn', { idioma: etiqueta }) : t('comun.verEnEspanol')}
      </button>
    </div>
  )
}

// Envoltorio para el texto normativo de la interfaz: terminos, definiciones del glosario y
// avisos legales. Muestra la traduccion y deja el espanol a un clic, porque el espanol es la
// version que prevalece y quien lea la traduccion tiene que poder contrastarla.
//
// Uso: <BilingualLegalText>{(t) => <p>{t('terminos.uso.texto')}</p>}</BilingualLegalText>
// El `t` que recibe resuelve en espanol mientras el conmutador este activo; el resto de la
// interfaz alrededor sigue en el idioma elegido.
export default function BilingualLegalText({ children, className = '', avisoClassName = '' }) {
  const t = useT()
  const [mostrandoEspanol, setMostrandoEspanol] = useState(false)
  const esTraducido = t.idioma !== 'es'
  const idiomaTexto = esTraducido && !mostrandoEspanol ? t.idioma : 'es'
  const tLegal = (clave, vars) => tEn(idiomaTexto, clave, vars)

  return (
    <div className={className} lang={idiomaTexto}>
      {children(tLegal)}
      {esTraducido && (
        <TranslationNotice
          idioma={t.idioma}
          mostrandoEspanol={mostrandoEspanol}
          onToggle={() => setMostrandoEspanol((abierto) => !abierto)}
          className={avisoClassName}
        />
      )}
    </div>
  )
}
