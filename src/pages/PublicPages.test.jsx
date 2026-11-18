import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn(),
    signup: vi.fn(),
    verifyEmail: vi.fn(),
    resetPassword: vi.fn(),
    forgotPassword: vi.fn(),
    resendVerification: vi.fn(),
  },
  paymentService: {
    getPlans: vi.fn(),
    getSubscription: vi.fn(),
    cancelSubscription: vi.fn(),
  },
}))

const { authService, paymentService } = await import('@/services/api')
const { default: LandingPage } = await import('./LandingPage')
const { default: ResetPasswordPage } = await import('./ResetPasswordPage')
const { default: VerifyEmailPage } = await import('./VerifyEmailPage')
const { default: TermsPage } = await import('./TermsPage')
const { useAuthStore } = await import('@/store/authStore')
const { useLanguageStore } = await import('@/store/languageStore')
const { tIn } = await import('@/i18n/translate')

const es = (key, vars) => tIn('es', key, vars)

const renderAt = (path, element) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path.split('?')[0]} element={element} />
        <Route path="/chat" element={<p>chat abierto</p>} />
        <Route path="/" element={<p>portada</p>} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  vi.resetAllMocks()
  useLanguageStore.setState({ language: 'es' })
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null })
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(cleanup)

describe('LandingPage', () => {
  it('opens the login modal from the navbar and switches to register', () => {
    renderAt('/landing', <LandingPage />)

    fireEvent.click(screen.getAllByRole('button', { name: es('nav.iniciarSesion') })[0])
    expect(screen.getByRole('heading', { name: es('auth.login.titulo') })).toBeTruthy()

    fireEvent.click(screen.getAllByText(es('auth.login.registrate')).at(-1))
    expect(screen.getByRole('button', { name: es('auth.registro.crear') })).toBeTruthy()
  })

  it('opens the modal requested in the URL', () => {
    renderAt('/landing?auth=forgot', <LandingPage />)

    expect(screen.getByRole('button', { name: es('auth.recuperar.enviar') })).toBeTruthy()
  })

  it('loads billing and offers the chat to a signed-in user', async () => {
    paymentService.getPlans.mockResolvedValue({ data: [] })
    paymentService.getSubscription.mockResolvedValue({ data: { planCode: 'FREE' } })
    useAuthStore.setState({ accessToken: 'a', refreshToken: 'r', user: { name: 'Ana' } })
    renderAt('/landing', <LandingPage />)

    await waitFor(() => expect(paymentService.getSubscription).toHaveBeenCalled())
    fireEvent.click(screen.getAllByRole('button', { name: es('nav.irAlChat') })[0])
    expect(screen.getByText('chat abierto')).toBeTruthy()
  })
})

describe('ResetPasswordPage', () => {
  const fill = (id, value) => fireEvent.change(document.querySelector(`#${id}`), { target: { value } })
  const save = () => fireEvent.click(screen.getByRole('button', { name: es('auth.restablecer.guardar') }))

  it('validates the new password before sending it', () => {
    renderAt('/reset?token=t1', <ResetPasswordPage />)

    fill('rp-pass', 'corta')
    fill('rp-confirm', 'otra')
    save()

    expect(screen.getByText(es('auth.validacion.contrasenaCorta'))).toBeTruthy()
    expect(screen.getByText(es('auth.validacion.contrasenaNoCoincide'))).toBeTruthy()
    expect(authService.resetPassword).not.toHaveBeenCalled()
  })

  it('saves the password with the token from the link', async () => {
    authService.resetPassword.mockResolvedValue({})
    renderAt('/reset?token=t1', <ResetPasswordPage />)

    fill('rp-pass', 'nuevaClave1')
    fill('rp-confirm', 'nuevaClave1')
    save()

    expect(await screen.findByText(es('auth.restablecer.listo'))).toBeTruthy()
    expect(authService.resetPassword).toHaveBeenCalledWith({ token: 't1', newPassword: 'nuevaClave1' })
  })

  it('offers a new link when the token is missing or expired', async () => {
    authService.resetPassword.mockRejectedValue({ response: { status: 400, data: { code: 'reset_token_invalid' } } })
    renderAt('/reset?token=viejo', <ResetPasswordPage />)

    fill('rp-pass', 'nuevaClave1')
    fill('rp-confirm', 'nuevaClave1')
    save()

    expect(await screen.findByText(es('auth.restablecer.pedirNuevo'))).toBeTruthy()
  })
})

describe('VerifyEmailPage', () => {
  it('confirms a valid token', async () => {
    authService.verifyEmail.mockResolvedValue({})
    renderAt('/verify?token=t1', <VerifyEmailPage />)

    expect(await screen.findByText(es('auth.verificar.exito'))).toBeTruthy()
    expect(authService.verifyEmail).toHaveBeenCalledWith({ token: 't1' })
  })

  it('reports a missing or rejected token', async () => {
    renderAt('/verify', <VerifyEmailPage />)
    expect(await screen.findByText(es('auth.verificar.sinToken'))).toBeTruthy()
    cleanup()

    authService.verifyEmail.mockRejectedValue({ response: { status: 400, data: {} } })
    renderAt('/verify?token=malo', <VerifyEmailPage />)
    expect(await screen.findByText(es('auth.verificar.error'))).toBeTruthy()
  })
})

describe('TermsPage', () => {
  it('renders the terms', () => {
    renderAt('/terms', <TermsPage />)

    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
  })
})
