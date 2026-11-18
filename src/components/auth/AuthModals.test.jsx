import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn(),
    signup: vi.fn(),
    forgotPassword: vi.fn(),
    resendVerification: vi.fn(),
  },
}))

const { authService } = await import('@/services/api')
const { default: LoginModal } = await import('./LoginModal')
const { default: RegisterModal } = await import('./RegisterModal')
const { default: ForgotPasswordModal } = await import('./ForgotPasswordModal')
const { useAuthStore } = await import('@/store/authStore')
const { useLanguageStore } = await import('@/store/languageStore')
const { tIn } = await import('@/i18n/translate')

const es = (key, vars) => tIn('es', key, vars)
const fill = (id, value, container) => fireEvent.change(container.querySelector(`#${id}`), { target: { value } })

const renderAt = (ui) =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/chat" element={<p>chat abierto</p>} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  vi.resetAllMocks()
  useLanguageStore.setState({ language: 'es' })
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null })
})

afterEach(cleanup)

describe('LoginModal', () => {
  it('validates the fields before calling the server', () => {
    renderAt(<LoginModal onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: es('auth.login.entrar') }))

    expect(screen.getByText(es('auth.validacion.correoInvalido'))).toBeTruthy()
    expect(screen.getByText(es('auth.validacion.contrasenaRequerida'))).toBeTruthy()
    expect(authService.login).not.toHaveBeenCalled()
  })

  it('stores the session and opens the chat on success', async () => {
    authService.login.mockResolvedValue({ data: { accessToken: 'a', refreshToken: 'r', user: { email: 'ana@x.pe' } } })
    const { container } = renderAt(<LoginModal onClose={vi.fn()} />)

    fill('li-email', 'ana@x.pe', container)
    fill('li-pass', 'secreta123', container)
    fireEvent.click(screen.getByRole('button', { name: es('auth.login.entrar') }))

    expect(await screen.findByText('chat abierto')).toBeTruthy()
    expect(authService.login).toHaveBeenCalledWith({ email: 'ana@x.pe', password: 'secreta123' })
    expect(useAuthStore.getState().accessToken).toBe('a')
  })

  it('shows the server error when credentials are wrong', async () => {
    authService.login.mockRejectedValue({ response: { status: 401, data: { code: 'invalid_credentials' } } })
    const { container } = renderAt(<LoginModal onClose={vi.fn()} />)

    fill('li-email', 'ana@x.pe', container)
    fill('li-pass', 'mala', container)
    fireEvent.click(screen.getByRole('button', { name: es('auth.login.entrar') }))

    expect(await screen.findByText(es('errores.invalid_credentials'))).toBeTruthy()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('toggles password visibility and switches to the other modals', () => {
    const onRegister = vi.fn()
    const onForgot = vi.fn()
    const { container } = renderAt(
      <LoginModal onClose={vi.fn()} onSwitchToRegister={onRegister} onForgotPassword={onForgot} />
    )

    fireEvent.click(screen.getByRole('button', { name: es('auth.campos.mostrarContrasena') }))
    expect(container.querySelector('#li-pass').type).toBe('text')

    fireEvent.click(screen.getByText(es('auth.login.registrate')))
    fireEvent.click(screen.getByText(es('auth.login.olvidaste')))
    expect(onRegister).toHaveBeenCalled()
    expect(onForgot).toHaveBeenCalled()
  })
})

describe('RegisterModal', () => {
  it('lists every invalid field', () => {
    renderAt(<RegisterModal onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: es('auth.registro.crear') }))

    expect(screen.getAllByText(es('auth.validacion.requerido'))).toHaveLength(2)
    expect(screen.getByText(es('auth.validacion.celularDigitos'))).toBeTruthy()
    expect(screen.getByText(es('auth.validacion.contrasenaCorta'))).toBeTruthy()
    expect(screen.getByText(es('auth.validacion.terminosRequeridos'))).toBeTruthy()
    expect(authService.signup).not.toHaveBeenCalled()
  })

  it('signs up with the full name and keeps only phone digits', async () => {
    authService.signup.mockResolvedValue({ data: {} })
    const { container } = renderAt(<RegisterModal onClose={vi.fn()} />)

    fill('rg-nombre', 'Ana', container)
    fill('rg-apellido', 'Quispe', container)
    fill('rg-email', 'ana@x.pe', container)
    fill('rg-phone', '987-654-321', container)
    fill('rg-pass', 'secreta123', container)
    fill('rg-confirm', 'secreta123', container)
    fireEvent.click(container.querySelector('#rg-terms'))
    fireEvent.click(screen.getByRole('button', { name: es('auth.registro.crear') }))

    await waitFor(() => expect(authService.signup).toHaveBeenCalledWith({
      email: 'ana@x.pe',
      password: 'secreta123',
      name: 'Ana Quispe',
      phone: '987654321',
    }))
    expect(screen.queryByRole('button', { name: es('auth.registro.crear') })).toBeNull()
  })
})

describe('ForgotPasswordModal', () => {
  it('rejects an invalid email and confirms a valid one', async () => {
    authService.forgotPassword.mockResolvedValue({})
    const { container } = render(<ForgotPasswordModal onClose={vi.fn()} onSwitchToLogin={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: es('auth.recuperar.enviar') }))
    expect(screen.getByText(es('auth.validacion.correoInvalido'))).toBeTruthy()

    fill('fp-email', 'ana@x.pe', container)
    fireEvent.click(screen.getByRole('button', { name: es('auth.recuperar.enviar') }))

    expect(await screen.findByText(es('auth.recuperar.revisaCorreo'))).toBeTruthy()
    expect(authService.forgotPassword).toHaveBeenCalledWith({ email: 'ana@x.pe' })
  })

  it('keeps the form when the request fails', async () => {
    authService.forgotPassword.mockRejectedValue(new Error('offline'))
    render(<ForgotPasswordModal onClose={vi.fn()} initialEmail="ana@x.pe" />)

    fireEvent.click(screen.getByRole('button', { name: es('auth.recuperar.enviar') }))

    expect(await screen.findByText(es('errores.network_error'))).toBeTruthy()
  })
})
