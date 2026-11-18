import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  paymentService: {
    getPlans: vi.fn(),
    getSubscription: vi.fn(),
    createCheckoutSession: vi.fn(),
    cancelSubscription: vi.fn(),
  },
}))

const { paymentService } = await import('@/services/api')
const { default: PaymentPage } = await import('./PaymentPage')
const { default: BillingReturnPage } = await import('./BillingReturnPage')
const { default: SpecialistAssistancePage } = await import('./SpecialistAssistancePage')
const { usePaymentStore } = await import('@/store/paymentStore')
const { useLanguageStore } = await import('@/store/languageStore')
const { tIn } = await import('@/i18n/translate')

const es = (key, vars) => tIn('es', key, vars)

const renderAt = (path, pattern, element) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={pattern} element={element} />
        <Route path="/chat" element={<p>chat abierto</p>} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  vi.resetAllMocks()
  useLanguageStore.setState({ language: 'es' })
  usePaymentStore.setState({ plans: [], subscription: null, loading: false, error: null })
  paymentService.getPlans.mockResolvedValue({ data: [{ code: 'BASIC', monthlyTokenLimit: 600, monthlyPriceCents: 1499 }] })
  paymentService.getSubscription.mockResolvedValue({ data: { planCode: 'FREE', remainingTokens: 50, monthlyTokenLimit: 50 } })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('PaymentPage', () => {
  it('opens the Mercado Pago checkout for the chosen plan', async () => {
    const assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, origin: 'https://app.test', assign })
    paymentService.createCheckoutSession.mockResolvedValue({ data: { url: 'https://mp.test/pay' } })
    renderAt('/pago/basico', '/pago/:plan', <PaymentPage />)

    expect(await screen.findByText(es('planes.tokensMensuales', { cantidad: '600' }))).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: es('pago.continuar') }))

    await waitFor(() => expect(assign).toHaveBeenCalledWith('https://mp.test/pay'))
    expect(paymentService.createCheckoutSession).toHaveBeenCalledWith({
      planCode: 'BASIC',
      successUrl: 'https://app.test/billing/success',
      cancelUrl: 'https://app.test/billing/cancel',
    })
    vi.unstubAllGlobals()
  })

  it('shows the error when the checkout cannot be created', async () => {
    paymentService.createCheckoutSession.mockRejectedValue({ response: { status: 500, data: {} } })
    renderAt('/pago/premium', '/pago/:plan', <PaymentPage />)

    fireEvent.click(screen.getByRole('button', { name: es('pago.continuar') }))

    expect(await screen.findByText(es('pago.errorCheckout'))).toBeTruthy()
  })

  it('renders nothing for an unknown plan and returns to the chat', async () => {
    const { container } = renderAt('/pago/oro', '/pago/:plan', <PaymentPage />)
    expect(container.innerHTML).toBe('')
    cleanup()

    renderAt('/pago/basico', '/pago/:plan', <PaymentPage />)
    fireEvent.click(screen.getByRole('button', { name: es('pago.volverAlChat') }))
    expect(await screen.findByText('chat abierto')).toBeTruthy()
  })
})

describe('BillingReturnPage', () => {
  it('explains a cancelled checkout without polling', () => {
    renderAt('/billing/cancel', '/billing/:result', <BillingReturnPage />)

    expect(screen.getByText(es('pago.retorno.cancelado'))).toBeTruthy()
    expect(paymentService.getSubscription).not.toHaveBeenCalled()
  })

  it('confirms the upgrade once the subscription changes', async () => {
    paymentService.getSubscription.mockResolvedValue({ data: { planCode: 'BASIC', remainingTokens: 500, monthlyTokenLimit: 500 } })
    renderAt('/billing/success', '/billing/:result', <BillingReturnPage />)

    expect(await screen.findByText(es('pago.retorno.listo'))).toBeTruthy()
  })

  it('keeps polling and gives up after the timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderAt('/billing/success', '/billing/:result', <BillingReturnPage />)

    expect(screen.getByText(es('pago.retorno.confirmando'))).toBeTruthy()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50_000)
    })

    expect(screen.getByText(es('pago.retorno.tardaHint'))).toBeTruthy()
    expect(paymentService.getSubscription.mock.calls.length).toBeGreaterThan(1)
  })
})

describe('SpecialistAssistancePage', () => {
  it('lists the emergency contacts and goes back to the chat', () => {
    renderAt('/ayuda', '/ayuda', <SpecialistAssistancePage />)

    expect(screen.getByRole('heading', { name: es('contactos.titulo') })).toBeTruthy()
    expect(screen.getByText(es('contactos.llamar105')).getAttribute('href')).toBe('tel:105')

    fireEvent.click(screen.getByRole('button', { name: es('comun.volver') }))
    expect(screen.getByText('chat abierto')).toBeTruthy()
  })
})
