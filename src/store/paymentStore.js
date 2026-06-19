import { create } from 'zustand'
import { paymentService } from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'

export const usePaymentStore = create((set) => ({
  plans: [],
  subscription: null,
  loading: false,
  error: null,

  setPlans: (plans) => set({ plans }),
  setSubscription: (subscription) => set({ subscription }),

  loadPlans: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await paymentService.getPlans()
      const plans = Array.isArray(data) ? data : []
      set({ plans, loading: false })
      return plans
    } catch (e) {
      set({
        loading: false,
        error: normalizeApiError(e, 'No se pudieron cargar los planes.').message,
      })
      throw e
    }
  },

  loadSubscription: async () => {
    try {
      const { data } = await paymentService.getSubscription()
      set({ subscription: data })
      return data
    } catch (e) {
      set({ error: normalizeApiError(e, 'No se pudo cargar la suscripción.').message })
      throw e
    }
  },

  refreshBilling: async () => {
    set({ loading: true, error: null })
    const [plansResult, subscriptionResult] = await Promise.allSettled([
      paymentService.getPlans(),
      paymentService.getSubscription(),
    ])

    if (plansResult.status === 'fulfilled') {
      set({ plans: Array.isArray(plansResult.value.data) ? plansResult.value.data : [] })
    }
    if (subscriptionResult.status === 'fulfilled') {
      set({ subscription: subscriptionResult.value.data })
    }

    if (plansResult.status === 'rejected' && subscriptionResult.status === 'rejected') {
      const e = subscriptionResult.reason
      set({ loading: false, error: normalizeApiError(e, 'No se pudo actualizar la facturación.').message })
      throw e
    }

    set({ loading: false })
  },

  cancelSubscription: async () => {
    set({ loading: true, error: null })
    try {
      await paymentService.cancelSubscription()
      const { data } = await paymentService.getSubscription()
      set({ subscription: data, loading: false })
      return data
    } catch (e) {
      set({
        loading: false,
        error: normalizeApiError(e, 'No se pudo cancelar la suscripción.').message,
      })
      throw e
    }
  },
}))
