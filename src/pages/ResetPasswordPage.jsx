import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { authService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'
import styles from './AuthActionPage.module.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [fields, setFields] = useState({ newPassword: '', confirm: '' })
  const [errs, setErrs] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)

  const set = (k, v) => setFields((p) => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!fields.newPassword || fields.newPassword.length < 8) e.newPassword = 'Mínimo 8 caracteres.'
    if (fields.newPassword !== fields.confirm) e.confirm = 'Las contraseñas no coinciden.'
    setErrs(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!token) {
      setTokenExpired(true)
      setError('El enlace no incluye un código válido. Solicita uno nuevo.')
      return
    }
    if (!validate()) return

    setError(null)
    setLoading(true)
    try {
      await authService.resetPassword({ token, newPassword: fields.newPassword })
      setDone(true)
    } catch (e) {
      const { code, message } = normalizeApiError(e, 'No se pudo actualizar tu contraseña.')
      setTokenExpired(code === 'reset_token_invalid' || code === 'token_required')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.topBar}>
          <img src={logoImg} alt="LegalFam" />
          <span className={styles.logo}>LEGALFAM</span>
        </div>

        {done ? (
          <>
            <div className={styles.icon}>✅</div>
            <h1 className={styles.title}>Contraseña actualizada</h1>
            <p className={styles.text}>
              Ya puedes iniciar sesión con tu contraseña nueva.
            </p>
            <p className={styles.hint}>
              Por seguridad cerramos todas las sesiones abiertas en otros dispositivos.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/?auth=login')}
            >
              Iniciar sesión
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Crea una contraseña nueva</h1>
            <p className={styles.text}>Elige una contraseña de al menos 8 caracteres.</p>

            {error && <div className="api-err" style={{ marginTop: '1.25rem' }}>{error}</div>}

            {tokenExpired ? (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => navigate('/?auth=forgot')}
              >
                Solicitar un enlace nuevo
              </button>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.fg}>
                  <label htmlFor="rp-pass">Contraseña nueva</label>
                  <input
                    id="rp-pass" type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={fields.newPassword}
                    onChange={(e) => set('newPassword', e.target.value)}
                    className={errs.newPassword ? styles.hasError : ''}
                    autoComplete="new-password"
                  />
                  {errs.newPassword && <span className="field-err">{errs.newPassword}</span>}
                </div>

                <div className={styles.fg}>
                  <label htmlFor="rp-confirm">Confirmar contraseña</label>
                  <input
                    id="rp-confirm" type="password"
                    placeholder="Repite tu contraseña"
                    value={fields.confirm}
                    onChange={(e) => set('confirm', e.target.value)}
                    className={errs.confirm ? styles.hasError : ''}
                    autoComplete="new-password"
                  />
                  {errs.confirm && <span className="field-err">{errs.confirm}</span>}
                </div>

                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar contraseña'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
