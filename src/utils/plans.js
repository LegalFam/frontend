export const PLAN_SLUGS = {
  FREE: 'gratis',
  BASIC: 'basico',
  PREMIUM: 'premium',
}

export const PLAN_CODES_BY_SLUG = Object.entries(PLAN_SLUGS).reduce(
  (acc, [code, slug]) => ({ ...acc, [slug]: code }),
  {}
)

export const STATIC_PLANS = [
  {
    code: 'FREE',
    slug: PLAN_SLUGS.FREE,
    displayName: 'Prueba gratuita',
    monthlyPriceCents: null,
    currency: 'pen',
    billingInterval: 'once',
    monthlyTokenLimit: 50,
    featured: false,
    buttonLabel: 'Empezar gratis',
    features: [
      '1 sesion de asesoria legal',
      'Respuestas en lenguaje simple',
      'Temas: alimentos, tenencia y filiacion',
      'Sin tarjeta requerida',
    ],
  },
  {
    code: 'BASIC',
    slug: PLAN_SLUGS.BASIC,
    displayName: 'Plan Basico',
    monthlyPriceCents: 1499,
    currency: 'pen',
    billingInterval: 'month',
    monthlyTokenLimit: 500,
    featured: true,
    buttonLabel: 'Suscribirse',
    features: [
      'Consultas dentro del limite mensual',
      'Historial completo de conversaciones',
      'Fuentes legales citadas',
      'Calificacion de respuestas',
    ],
  },
  {
    code: 'PREMIUM',
    slug: PLAN_SLUGS.PREMIUM,
    displayName: 'Plan Premium',
    monthlyPriceCents: 4999,
    currency: 'pen',
    billingInterval: 'month',
    monthlyTokenLimit: 2500,
    featured: false,
    buttonLabel: 'Suscribirse',
    features: [
      'Mayor limite mensual de consultas',
      'Respuestas mas detalladas',
      'Prioridad operativa',
      'Soporte prioritario',
    ],
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

export const planSlug = (plan) => PLAN_SLUGS[plan?.code] || String(plan?.code || '').toLowerCase()
