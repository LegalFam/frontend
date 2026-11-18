import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  userService: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    updatePassword: vi.fn(),
  },
  paymentService: {
    getPlans: vi.fn(),
    getSubscription: vi.fn(),
    cancelSubscription: vi.fn(),
    createCheckoutSession: vi.fn(),
  },
}))

const { userService, paymentService } = await import('@/services/api')
const { default: SettingsPage } = await import('./SettingsPage')
const { useAuthStore } = await import('@/store/authStore')
const { usePaymentStore } = await import('@/store/paymentStore')
const { useLanguageStore } = await import('@/store/languageStore')
const { tIn } = await import('@/i18n/translate')

const es = (key, vars) => tIn('es', key, vars)
const fill = (id, value) => fireEvent.change(document.querySelector(`#${id}`), { target: { value } })
const paidSubscription = {
  planCode: 'BASIC',
  provider: 'MERCADO_PAGO',
  monthlyTokenLimit: 500,
  remainingTokens: 120,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: '2026-12-15T00:00:00Z',
}

const renderPage = async (subscription = paidSubscription) => {
  paymentService.getPlans.mockResolvedValue({ data: [] })
  paymentService.getSubscription.mockResolvedValue({ data: subscription })
  render(<MemoryRouter><SettingsPage /></MemoryRouter>)
  await waitFor(() => expect(document.querySelector('#st-nombre').value).toBe('Ana'))
}

beforeEach(() => {
  vi.resetAllMocks()
  useLanguageStore.setState({ language: 'es' })
  useAuthStore.setState({ accessToken: 'a', refreshToken: 'r', user: { name: 'Ana Quispe', email: 'ana@x.pe' } })
  usePaymentStore.setState({ plans: [], subscription: null, loading: false, error: null })
  userService.getProfile.mockResolvedValue({ data: { name: 'Ana Quispe Mamani', email: 'ana@x.pe' } })
})

afterEach(cleanup)

describe('SettingsPage profile', () => {
  it('loads the profile and saves the new name', async () => {
    userService.updateProfile.mockResolvedValue({ data: { name: 'Ana Condori', email: 'ana@x.pe' } })
    await renderPage()

    fill('st-apellido', 'Condori')
    fireEvent.click(screen.getByRole('button', { name: es('config.datos.guardar') }))

    expect(await screen.findByText(es('config.datos.guardado'))).toBeTruthy()
    expect(userService.updateProfile).toHaveBeenCalledWith({ name: 'Ana Condori' })
    expect(useAuthStore.getState().user.name).toBe('Ana Condori')
  })

  it('requires both names', async () => {
    await renderPage()

    fill('st-nombre', ' ')
    fireEvent.click(screen.getByRole('button', { name: es('config.datos.guardar') }))

    expect(screen.getByText(es('auth.validacion.requerido'))).toBeTruthy()
    expect(userService.updateProfile).not.toHaveBeenCalled()
  })
})

describe('SettingsPage password', () => {
  const change = () => fireEvent.click(screen.getByRole('button', { name: es('config.contrasena.cambiar') }))

  it('validates and changes the password', async () => {
    userService.updatePassword.mockResolvedValue({})
    await renderPage()

    change()
    expect(screen.getByText(es('auth.validacion.contrasenaCorta'))).toBeTruthy()

    fill('st-current', 'actual123')
    fill('st-next', 'nuevaClave1')
    fill('st-confirm', 'nuevaClave1')
    change()

    expect(await screen.findByText(es('config.contrasena.guardado'))).toBeTruthy()
    expect(userService.updatePassword).toHaveBeenCalledWith({ currentPassword: 'actual123', newPassword: 'nuevaClave1' })
  })

  it('marks the current password when the server rejects it', async () => {
    userService.updatePassword.mockRejectedValue({ response: { status: 400, data: { code: 'current_password_invalid' } } })
    await renderPage()

    fill('st-current', 'mala')
    fill('st-next', 'nuevaClave1')
    fill('st-confirm', 'nuevaClave1')
    change()

    expect(await screen.findByText(es('config.contrasena.actualIncorrecta'))).toBeTruthy()
  })
})

describe('SettingsPage subscription', () => {
  it('cancels a paid subscription after confirming', async () => {
    paymentService.cancelSubscription.mockResolvedValue({})
    await renderPage()

    fireEvent.click(await screen.findByRole('button', { name: es('config.suscripcion.darDeBaja') }))
    paymentService.getSubscription.mockResolvedValue({ data: { ...paidSubscription, cancelAtPeriodEnd: true } })
    fireEvent.click(screen.getByRole('button', { name: es('config.suscripcion.confirmarBoton') }))

    expect(await screen.findByText(es('config.suscripcion.dadaDeBaja'))).toBeTruthy()
    expect(paymentService.cancelSubscription).toHaveBeenCalledTimes(1)
  })

  it('offers the plans to a free user', async () => {
    await renderPage({ planCode: 'FREE', provider: 'FREE', monthlyTokenLimit: 50, remainingTokens: 50 })

    expect(await screen.findByText(es('config.suscripcion.esGratuito'))).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: es('config.suscripcion.verPlanes') }))
    expect(screen.getAllByRole('dialog').length).toBeGreaterThan(0)
  })
})
