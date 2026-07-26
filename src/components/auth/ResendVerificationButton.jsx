import { useEffect, useRef, useState } from 'react'
import { authService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'
import styles from './AuthModal.module.css'

const COOLDOWN_SECONDS = 60

/**
 * Resends the verification email. The backend answers 204 for every address so it
 * cannot be used to probe who is registered; the confirmation copy is neutral to match.
 */
export default function ResendVerificationButton({ email, className }) {
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearInterval(timerRef.current), [])

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (!email || sending || cooldown > 0) return
    setSending(true)
    setFeedback(null)
    try {
      await authService.resendVerification({ email })
      setFeedback({ ok: true, message: 'Te reenviamos el enlace. Revisa tu bandeja de entrada y la carpeta de spam.' })
      startCooldown()
    } catch (e) {
      setFeedback({ ok: false, message: normalizeApiError(e, 'No se pudo reenviar el correo.').message })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={className || styles.ghostBtn}
        onClick={handleResend}
        disabled={sending || cooldown > 0 || !email}
      >
        {sending
          ? 'Reenviando...'
          : cooldown > 0
            ? `Reenviar en ${cooldown}s`
            : 'Reenviar correo de verificación'}
      </button>
      {feedback && (
        <p className={feedback.ok ? styles.noticeHint : 'field-err'}>{feedback.message}</p>
      )}
    </>
  )
}
