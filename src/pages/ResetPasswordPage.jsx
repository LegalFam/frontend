import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import logoImg from '@/assets/logo-transparent.png'
import { authService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'
import { useT } from '@/i18n/translate'
import styles from './AuthActionPage.module.css'

export default function ResetPasswordPage() {
  const t = useT()
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
    if (!fields.newPassword || fields.newPassword.length < 8) e.newPassword = t('auth.validacion.contrasenaCorta')
    if (fields.newPassword !== fields.confirm) e.confirm = t('auth.validacion.contrasenaNoCoincide')
    setErrs(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!token) {
      setTokenExpired(true)
      setError(t('auth.restablecer.sinToken'))
      return
    }
    if (!validate()) return

    setError(null)
    setLoading(true)
    try {
      await authService.resetPassword({ token, newPassword: fields.newPassword })
      setDone(true)
    } catch (e) {
      const { code, message } = normalizeApiError(e, t('auth.restablecer.errorGenerico'))
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
            <h1 className={styles.title}>{t('auth.restablecer.listo')}</h1>
            <p className={styles.text}>{t('auth.restablecer.listoTexto')}</p>
            <p className={styles.hint}>{t('auth.restablecer.listoHint')}</p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/?auth=login')}
            >
              {t('auth.login.titulo')}
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>{t('auth.restablecer.titulo')}</h1>
            <p className={styles.text}>{t('auth.restablecer.subtitulo')}</p>

            {error && <div className="api-err" style={{ marginTop: '1.25rem' }}>{error}</div>}

            {tokenExpired ? (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => navigate('/?auth=forgot')}
              >
                {t('auth.restablecer.pedirNuevo')}
              </button>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.fg}>
                  <label htmlFor="rp-pass">{t('auth.campos.contrasenaNueva')}</label>
                  <input
                    id="rp-pass" type="password"
                    placeholder={t('auth.campos.minimoPlaceholder')}
                    value={fields.newPassword}
                    onChange={(e) => set('newPassword', e.target.value)}
                    className={errs.newPassword ? styles.hasError : ''}
                    autoComplete="new-password"
                  />
                  {errs.newPassword && <span className="field-err">{errs.newPassword}</span>}
                </div>

                <div className={styles.fg}>
                  <label htmlFor="rp-confirm">{t('auth.campos.confirmar')}</label>
                  <input
                    id="rp-confirm" type="password"
                    placeholder={t('auth.campos.confirmarPlaceholder')}
                    value={fields.confirm}
                    onChange={(e) => set('confirm', e.target.value)}
                    className={errs.confirm ? styles.hasError : ''}
                    autoComplete="new-password"
                  />
                  {errs.confirm && <span className="field-err">{errs.confirm}</span>}
                </div>

                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? t('auth.restablecer.guardando') : t('auth.restablecer.guardar')}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
