import { resolveApiError } from '@/utils/apiError'
import { useT } from '@/i18n/translate'
import styles from './CancelSubscriptionDialog.module.css'

const formatPeriodEnd = (iso, textoPorDefecto) => {
  if (!iso) return textoPorDefecto
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return textoPorDefecto
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function CancelSubscriptionDialog({ subscription, freeTokenLimit, error, onClose, onConfirm }) {
  const t = useT()

  return (
    // Evita cerrar también el diálogo padre.
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
        {error && <div className="api-err">{resolveApiError(error)}</div>}
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
