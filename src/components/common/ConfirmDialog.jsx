import { createPortal } from 'react-dom'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useT } from '@/i18n/translate'
import styles from './ConfirmDialog.module.css'

export default function ConfirmDialog({ title, text, confirmLabel, onConfirm, onClose }) {
  const t = useT()
  useEscapeKey(onClose)

  return createPortal(
    <div className={styles.layer} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{text}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            {t('comun.cancelar')}
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body
  )
}
