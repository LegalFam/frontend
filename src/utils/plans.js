export const PLAN_SLUGS = {
  FREE: 'gratis',
  BASIC: 'basico',
  PREMIUM: 'premium',
}

export const PLAN_CODES_BY_SLUG = Object.entries(PLAN_SLUGS).reduce(
  (acc, [code, slug]) => ({ ...acc, [slug]: code }),
  {}
)

// Estas capacidades no dependen del plan: el backend no las restringe por tier.
// Lo que sí cambia entre planes son los tokens mensuales, la ventana de contexto
// del asistente y la ventana de historial visible.
export const SHARED_PLAN_FEATURES = [
  'Asistente de Derecho de Familia',
  'Fuentes legales citadas',
  'Calificación de respuestas',
]

// Estos valores replican los del backend en payment.properties (app.payment.plans.*),
// que es la fuente de verdad: si cambian allí, hay que actualizarlos aquí.
export const STATIC_PLANS = [
  {
    code: 'FREE',
    slug: PLAN_SLUGS.FREE,
    displayName: 'Plan gratuito',
    monthlyPriceCents: null,
    currency: 'pen',
    billingInterval: 'once',
    monthlyTokenLimit: 50,
    contextMessageLimit: 10,
    historyWindowDays: 30,
    featured: false,
    buttonLabel: 'Empezar gratis',
    features: SHARED_PLAN_FEATURES,
  },
  {
    code: 'BASIC',
    slug: PLAN_SLUGS.BASIC,
    displayName: 'Plan Básico',
    monthlyPriceCents: 1499,
    currency: 'pen',
    billingInterval: 'month',
    monthlyTokenLimit: 500,
    contextMessageLimit: 15,
    historyWindowDays: null,
    featured: true,
    buttonLabel: 'Suscribirse',
    features: SHARED_PLAN_FEATURES,
  },
  {
    code: 'PREMIUM',
    slug: PLAN_SLUGS.PREMIUM,
    displayName: 'Plan Premium',
    monthlyPriceCents: 4999,
    currency: 'pen',
    billingInterval: 'month',
    monthlyTokenLimit: 2500,
    contextMessageLimit: 25,
    historyWindowDays: null,
    featured: false,
    buttonLabel: 'Suscribirse',
    features: SHARED_PLAN_FEATURES,
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
    buttonLabel: staticPlan.buttonLabel || 'Suscribirse',
    contextMessageLimit: plan.contextMessageLimit ?? staticPlan.contextMessageLimit ?? null,
    historyWindowDays: plan.historyWindowDays ?? staticPlan.historyWindowDays ?? null,
    features: staticPlan.features || [],
  }
}

export const formatPlanName = (plan) => plan?.displayName || plan?.code || 'Plan'

export const formatPlanPrice = (plan) => {
  if (!plan || plan.monthlyPriceCents == null) return 'S/ 0'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: (plan.currency || 'PEN').toUpperCase(),
  }).format(plan.monthlyPriceCents / 100)
}

export const formatPlanPeriod = (plan) =>
  plan?.billingInterval === 'month' ? '/ mes' : ''

export const formatPlanTokens = (plan) =>
  `${new Intl.NumberFormat('es-PE').format(plan?.monthlyTokenLimit || 0)} tokens mensuales`

// La capacidad se expresa como múltiplo del plan gratuito para que las tres
// columnas compartan la misma referencia. Se deriva de los límites reales, así
// que si cambian los tokens de un plan el multiplicador sigue siendo correcto.
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
  `${plan?.contextMessageLimit || 0} mensajes`

export const formatPlanHistoryWindow = (plan) =>
  plan?.historyWindowDays == null ? 'Completo' : `${plan.historyWindowDays} días`

export const planSlug = (plan) => PLAN_SLUGS[plan?.code] || String(plan?.code || '').toLowerCase()
