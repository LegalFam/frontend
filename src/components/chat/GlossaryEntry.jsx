import BilingualLegalText from '@/components/common/BilingualLegalText'
import { useT } from '@/i18n/translate'
import styles from './GlossaryEntry.module.css'

export default function GlossaryEntry({ clave, onBack }) {
  const t = useT()

  return (
    <div className={styles.view}>
      <article className={styles.card}>
        <span className={styles.eyebrow}>{t('chat.glosario.titulo')}</span>
        <h1>{t(`glosario.${clave}.termino`)}</h1>
        <BilingualLegalText>
          {(tLegal) => (
            <>
              <p>{tLegal(`glosario.${clave}.definicion`)}</p>
              <p className={styles.note}>{tLegal('chat.glosario.nombresEnEspanol')}</p>
            </>
          )}
        </BilingualLegalText>
        <div className={styles.actions}>
          <button type="button" className={styles.backBtn} onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {t('chat.glosario.volver')}
          </button>
        </div>
      </article>
    </div>
  )
}
