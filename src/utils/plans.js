import { t, tOptional } from '@/i18n/translate'

export const PLAN_SLUGS = {
  FREE: 'gratis',
  BASIC: 'basico',
  PREMIUM: 'premium',
}

export const PLAN_CODES_BY_SLUG = Object.entries(PLAN_SLUGS).reduce(
  (acc, [code, slug]) => ({ ...acc, [slug]: code }),
  {}
)

export const SHARED_PLAN_FEATURE_KEYS = ['asistente', 'fuentes', 'calificacion']

export const formatPlanFeature = (clave) => t(`planes.incluye.${clave}`)

export const STATIC_PLANS = [
  {
    code: 'FREE',
    slug: PLAN_SLUGS.FREE,
    monthlyPriceCents: null,
    currency: 'pen',
    billingInterval: 'once',
    monthlyTokenLimit: 50,
    contextMessageLimit: 10,
    historyWindowDays: 30,
    featured: false,
    features: SHARED_PLAN_FEATURE_KEYS,
  },
  {
    code: 'BASIC',
    slug: PLAN_SLUGS.BASIC,
    monthlyPriceCents: 1499,
    currency: 'pen',
    billingInterval: 'month',
    monthlyTokenLimit: 500,
    contextMessageLimit: 15,
    historyWindowDays: null,
    featured: true,
    features: SHARED_PLAN_FEATURE_KEYS,
  },
  {
    code: 'PREMIUM',
    slug: PLAN_SLUGS.PREMIUM,
    monthlyPriceCents: 4999,
    currency: 'pen',
    billingInterval: 'month',
    monthlyTokenLimit: 2500,
    contextMessageLimit: 25,
    historyWindowDays: null,
    featured: false,
    features: SHARED_PLAN_FEATURE_KEYS,
  },
]

export const PLANS_BY_SLUG = STATIC_PLANS.reduce(
  (acc, plan) => ({ ...acc, [plan.slug]: plan }),
  {}
)

export const STATIC_PLANS_BY_CODE = STATIC_PLANS.reduce(
  (acc, plan) => ({ ...acc, [plan.code]: plan }),
  {}
)

export const mergePlanWithStatic = (plan) => {
  if (!plan) return null
  const staticPlan = STATIC_PLANS_BY_CODE[plan.code] || {}
  return {
    ...staticPlan,
    ...plan,
    slug: staticPlan.slug || plan.slug || planSlug(plan),
    featured: staticPlan.featured || false,
    contextMessageLimit: plan.contextMessageLimit ?? staticPlan.contextMessageLimit ?? null,
    historyWindowDays: plan.historyWindowDays ?? staticPlan.historyWindowDays ?? null,
    features: staticPlan.features || [],
  }
}

export const formatPlanName = (plan) =>
  (plan?.code && tOptional(`planes.nombre.${plan.code}`)) ||
  plan?.displayName ||
  plan?.code ||
  t('planes.generico')

export const formatPlanButtonLabel = (plan) =>
  (plan?.code && tOptional(`planes.boton.${plan.code}`)) || t('planes.boton.generico')

export const formatPlanPrice = (plan) => {
  if (!plan || plan.monthlyPriceCents == null) return 'S/ 0'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: (plan.currency || 'PEN').toUpperCase(),
  }).format(plan.monthlyPriceCents / 100)
}

export const formatPlanPeriod = (plan) =>
  plan?.billingInterval === 'month' ? t('planes.porMes') : ''

export const formatPlanTokens = (plan) =>
  t('planes.tokensMensuales', {
    cantidad: new Intl.NumberFormat('es-PE').format(plan?.monthlyTokenLimit || 0),
  })

const basePlanTokenLimit = () =>
  STATIC_PLANS_BY_CODE.FREE?.monthlyTokenLimit || 0

export const formatPlanCapacity = (plan) => {
  const base = basePlanTokenLimit()
  const limit = plan?.monthlyTokenLimit || 0
  if (!base || !limit) return '—'

  const multiplier = limit / base
  const rounded = Math.round(multiplier * 10) / 10
  return `×${new Intl.NumberFormat('es-PE').format(rounded)}`
}

export const formatPlanContextMessages = (plan) =>
  t('planes.mensajes', { cantidad: plan?.contextMessageLimit || 0 })

export const formatPlanHistoryWindow = (plan) =>
  plan?.historyWindowDays == null
    ? t('planes.historialCompleto')
    : t('planes.dias', { cantidad: plan.historyWindowDays })

export const planSlug = (plan) => PLAN_SLUGS[plan?.code] || String(plan?.code || '').toLowerCase()
