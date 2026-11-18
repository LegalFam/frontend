import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api', () => ({
  paymentService: {
    getPlans: vi.fn(),
    getSubscription: vi.fn(),
    cancelSubscription: vi.fn(),
  },
}))

const { paymentService } = await import('@/services/api')
const { usePaymentStore } = await import('./paymentStore')
const { useAuthStore } = await import('./authStore')

const serverError = { response: { status: 500, data: {} } }

beforeEach(() => {
  vi.resetAllMocks()
  usePaymentStore.setState({ plans: [], subscription: null, loading: false, error: null })
})

describe('paymentStore', () => {
  it('loads plans and ignores non-array payloads', async () => {
    paymentService.getPlans.mockResolvedValueOnce({ data: [{ code: 'FREE' }] })
    await usePaymentStore.getState().loadPlans()
    expect(usePaymentStore.getState().plans).toEqual([{ code: 'FREE' }])

    paymentService.getPlans.mockResolvedValueOnce({ data: null })
    await usePaymentStore.getState().loadPlans()
    expect(usePaymentStore.getState().plans).toEqual([])
  })

  it('keeps the error when plans or subscription fail', async () => {
    paymentService.getPlans.mockRejectedValue(serverError)
    paymentService.getSubscription.mockRejectedValue(serverError)

    await expect(usePaymentStore.getState().loadPlans()).rejects.toBe(serverError)
    expect(usePaymentStore.getState()).toMatchObject({ loading: false, error: { fallbackKey: 'errores._planes' } })

    await expect(usePaymentStore.getState().loadSubscription()).rejects.toBe(serverError)
    expect(usePaymentStore.getState().error.fallbackKey).toBe('errores._suscripcion')
  })

  it('refreshes billing with whatever succeeds and fails only if both fail', async () => {
    paymentService.getPlans.mockRejectedValueOnce(serverError)
    paymentService.getSubscription.mockResolvedValueOnce({ data: { planCode: 'BASIC' } })
    await usePaymentStore.getState().refreshBilling()
    expect(usePaymentStore.getState()).toMatchObject({ subscription: { planCode: 'BASIC' }, loading: false })

    paymentService.getPlans.mockRejectedValueOnce(serverError)
    paymentService.getSubscription.mockRejectedValueOnce(serverError)
    await expect(usePaymentStore.getState().refreshBilling()).rejects.toBe(serverError)
    expect(usePaymentStore.getState().error.fallbackKey).toBe('errores._planYTokens')
  })

  it('reloads the subscription after cancelling', async () => {
    paymentService.cancelSubscription.mockResolvedValueOnce({})
    paymentService.getSubscription.mockResolvedValueOnce({ data: { planCode: 'FREE' } })

    await usePaymentStore.getState().cancelSubscription()
    expect(usePaymentStore.getState().subscription).toEqual({ planCode: 'FREE' })

    paymentService.cancelSubscription.mockRejectedValueOnce(serverError)
    await expect(usePaymentStore.getState().cancelSubscription()).rejects.toBe(serverError)
    expect(usePaymentStore.getState().error.fallbackKey).toBe('config.suscripcion.errorBaja')
  })

  it('clears the subscription on logout', () => {
    useAuthStore.setState({ accessToken: 'a' })
    usePaymentStore.setState({ subscription: { planCode: 'BASIC' } })

    useAuthStore.getState().logout()

    expect(usePaymentStore.getState().subscription).toBeNull()
  })
})
