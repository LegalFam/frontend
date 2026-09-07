// Los planes son datos (códigos, precios, límites); el texto que los acompaña vive en el
// catálogo de idiomas. Las funciones de formato de este módulo resuelven ese texto al ser
// llamadas, así que devuelven el idioma activo en ese momento y no hace falta un hook.
//
// Nota para quien las use: como leen el idioma sin suscribirse, el componente que las llama
// tiene que suscribirse por su cuenta (useT()) para volver a renderizar al cambiar de lengua.
// En la práctica todos lo hacen, porque también tienen texto propio.
import { t, tOpcional } from '@/i18n/traducir'

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
//
// Sólo los identificadores: el texto sale de planes.incluye.* al renderizar.
export const SHARED_PLAN_FEATURE_KEYS = ['asistente', 'fuentes', 'calificacion']

export const formatPlanFeature = (clave) => t(`planes.incluye.${clave}`)

// Estos valores replican los del backend en payment.properties (app.payment.plans.*),
// que es la fuente de verdad: si cambian allí, hay que actualizarlos aquí.
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

// El catálogo manda sobre el displayName que llega del servidor, que siempre viene en
// español; si aparece un plan cuyo código no está en el catálogo, se usa el del servidor.
export const formatPlanName = (plan) =>
  (plan?.code && tOpcional(`planes.nombre.${plan.code}`)) ||
  plan?.displayName ||
  plan?.code ||
  t('planes.generico')

export const formatPlanButtonLabel = (plan) =>
  (plan?.code && tOpcional(`planes.boton.${plan.code}`)) || t('planes.boton.generico')

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
  t('planes.mensajes', { cantidad: plan?.contextMessageLimit || 0 })

export const formatPlanHistoryWindow = (plan) =>
  plan?.historyWindowDays == null
    ? t('planes.historialCompleto')
    : t('planes.dias', { cantidad: plan.historyWindowDays })

export const planSlug = (plan) => PLAN_SLUGS[plan?.code] || String(plan?.code || '').toLowerCase()
