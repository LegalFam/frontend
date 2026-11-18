import { beforeEach, describe, expect, it } from 'vitest'
import { useLanguageStore } from '@/store/languageStore'
import {
  PLAN_CODES_BY_SLUG,
  formatPlanCapacity,
  formatPlanHistoryWindow,
  formatPlanName,
  formatPlanPeriod,
  formatPlanPrice,
  mergePlanWithStatic,
  planSlug,
} from './plans'

beforeEach(() => useLanguageStore.setState({ language: 'es' }))

describe('plans', () => {
  it('maps slugs back to plan codes', () => {
    expect(PLAN_CODES_BY_SLUG).toEqual({ gratis: 'FREE', basico: 'BASIC', premium: 'PREMIUM' })
    expect(planSlug({ code: 'BASIC' })).toBe('basico')
    expect(planSlug({ code: 'GOLD' })).toBe('gold')
  })

  it('merges server plans over the static catalog', () => {
    const merged = mergePlanWithStatic({ code: 'BASIC', monthlyTokenLimit: 600, historyWindowDays: 90 })

    expect(merged.slug).toBe('basico')
    expect(merged.featured).toBe(true)
    expect(merged.monthlyTokenLimit).toBe(600)
    expect(merged.historyWindowDays).toBe(90)
    expect(merged.contextMessageLimit).toBe(15)
    expect(mergePlanWithStatic(null)).toBeNull()
    expect(mergePlanWithStatic({ code: 'GOLD' })).toMatchObject({ slug: 'gold', featured: false, features: [] })
  })

  it('formats prices and periods', () => {
    expect(formatPlanPrice(null)).toBe('S/ 0')
    expect(formatPlanPrice({ monthlyPriceCents: 1499, currency: 'pen' })).toMatch(/14\.99/)
    expect(formatPlanPeriod({ billingInterval: 'once' })).toBe('')
    expect(formatPlanPeriod({ billingInterval: 'month' })).not.toBe('')
  })

  it('expresses capacity relative to the free plan', () => {
    expect(formatPlanCapacity({ monthlyTokenLimit: 500 })).toBe('×10')
    expect(formatPlanCapacity({ monthlyTokenLimit: 75 })).toMatch(/^×1[.,]5$/)
    expect(formatPlanCapacity({})).toBe('—')
  })

  it('falls back to display name or code when there is no translation', () => {
    expect(formatPlanName({ code: 'GOLD', displayName: 'Oro' })).toBe('Oro')
    expect(formatPlanName({ code: 'GOLD' })).toBe('GOLD')
    expect(formatPlanHistoryWindow({ historyWindowDays: null })).not.toBe(formatPlanHistoryWindow({ historyWindowDays: 30 }))
  })
})
