import { useT } from '@/i18n/translate'
import styles from './CancelSubscriptionDialog.module.css'

// La fecha se formatea siempre en es-PE: Intl no tiene datos de quechua ni de aymara, y
// pedirle 'qu-PE' caería en el idioma por defecto del navegador, peor que el español. Lo que
// sí se traduce es el texto que la rodea.
const formatPeriodEnd = (iso, textoPorDefecto) => {
  if (!iso) return textoPorDefecto
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return textoPorDefecto
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Confirmación de la baja de suscripción. Vive aquí y no dentro de una pantalla porque la
// baja se pide desde dos sitios —Configuración y el diálogo de plan y tokens, donde bajar al
// plan gratuito es justamente esto— y en los dos hay que explicar lo mismo antes de hacerla:
// que los tokens y el plan se conservan hasta el fin del periodo y qué queda después.
export default function CancelSubscriptionDialog({ subscription, freeTokenLimit, error, onClose, onConfirm }) {
  const t = useT()

  return (
    // Se corta la propagación: cuando esta confirmación se abre desde el diálogo de plan y
    // tokens, es hija de su capa, y sin esto pulsar fuera cerraría los dos a la vez.
    <div
      className={styles.layer}
      role="presentation"
      onMouseDown={(e) => { e.stopPropagation(); onClose?.() }}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-subscription-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="cancel-subscription-title">{t('config.suscripcion.confirmarTitulo')}</h2>
        {error && <div className="api-err">{error}</div>}
        {/* Las cifras van interpoladas y no como <strong> intercalado: el orden de las
            palabras cambia entre lenguas y un trozo de JSX a mitad de frase no sobrevive. */}
        <p>
          {t('config.suscripcion.confirmarTexto1', {
            tokens: subscription?.remainingTokens ?? 0,
            fecha: formatPeriodEnd(subscription?.currentPeriodEnd, t('config.suscripcion.finPeriodo')),
          })}
        </p>
        <p>{t('config.suscripcion.confirmarTexto2', { tokens: freeTokenLimit })}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            {t('comun.volver')}
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            {t('config.suscripcion.confirmarBoton')}
          </button>
        </div>
      </section>
    </div>
  )
}
