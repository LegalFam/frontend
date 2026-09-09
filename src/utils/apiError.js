// Los mensajes de error viven en el catálogo de idiomas, en errores.<código>: la clave es el
// código que devuelve el backend, así que no hay un segundo mapa que mantener sincronizado.
//
// Se resuelven con tOptional() y no con t(), y eso es lo importante de este módulo: cuando el
// código no existe en el catálogo tiene que salir undefined, para que siga funcionando la
// cadena clientMessage || serverMessage || fallbackMessage de normalizeApiError. Un t()
// normal devolvería la clave y el usuario acabaría leyendo "errores.algun_codigo".
import { t, tOptional } from '@/i18n/translate'

const RETRYABLE_STATUS = new Set([408, 502, 503, 504])
const RETRYABLE_CODES = new Set([
  'upstream_timeout',
  'upstream_unavailable',
  'upstream_empty_response',
  'upstream_invalid_response',
  'upstream_error',
  'upstream_not_configured',
  'upstream_request_invalid',
  'agent_validation_failed',
])

// Algunos errores llegan sin código y sólo con el mensaje del servidor, en inglés. Cada uno
// apunta al código equivalente y se resuelve por el mismo camino que los demás.
const FALLBACK_CODES = {
  'an unexpected error occurred': 'internal_server_error',
  'access is forbidden': 'forbidden',
  'authentication is required': 'unauthorized',
  'malformed request body': 'malformed_json',
  'request validation failed': 'invalid_request',
  'email already exists': 'email_already_exists',
  'invalid credentials': 'invalid_credentials',
  'invalid refresh token': 'invalid_refresh_token',
  'message is required': 'message_required',
  'message processing is already pending': 'message_processing_pending',
  'insufficient tokens': 'insufficient_tokens',
}

const normalizeErrorCode = (code) => {
  if (typeof code !== 'string') return null
  const normalized = code.trim().toLowerCase()
  return normalized || null
}

const readDetail = (data) => {
  if (!data || typeof data !== 'object') return {}
  if (data.detail && typeof data.detail === 'object') return data.detail
  return data
}

const normalizeServerMessage = (message) => {
  if (typeof message !== 'string') return null
  const trimmed = message.trim()
  if (!trimmed) return null
  const code = FALLBACK_CODES[trimmed.toLowerCase()]
  return (code && tOptional(`errores.${code}`)) || trimmed
}

export const getApiErrorMessage = (code, fallbackMessage = null) => {
  const normalizedCode = normalizeErrorCode(code)
  if (!normalizedCode) return fallbackMessage
  return tOptional(`errores.${normalizedCode}`) || fallbackMessage
}

export const normalizeAssistantErrorMessage = (code, fallbackMessage = null) =>
  getApiErrorMessage(
    code,
    normalizeServerMessage(fallbackMessage) || t('errores._asistente')
  )

// Describe el error sin resolverlo a texto: guarda el código, el mensaje crudo del servidor y
// la CLAVE del respaldo. El texto se produce en resolveApiError() al renderizar.
//
// Antes esta función devolvía la frase ya traducida y quien la llamaba la guardaba en estado.
// Un aviso en pantalla se quedaba entonces en el idioma que hubiera en el instante del fallo,
// aunque después se cambiara de lengua: justo lo que el producto promete que no pasa (ver
// HU0006, los textos de la aplicación cambian en el sitio). El hilo del chat ya lo hacía bien
// guardando `errorCode`; esto extiende la misma idea a todo lo demás.
//
// `fallbackKey` es una clave del catálogo, no una frase. Pasar texto aquí vuelve a congelarlo.
export const normalizeApiError = (error, fallbackKey = 'errores._defecto') => {
  const status = error?.response?.status || null
  const detail = readDetail(error?.response?.data)
  const code = normalizeErrorCode(detail.code || error?.response?.data?.code)
  // Crudo a propósito: normalizeServerMessage() traduce lo que puede, y eso también tiene que
  // ocurrir al renderizar y no aquí.
  const serverMessage = detail.message || error?.response?.data?.message || null
  const hasResponse = Boolean(status)

  if (!hasResponse) {
    return { status, code: 'network_error', serverMessage: null, fallbackKey: 'errores.network_error', retryable: true }
  }

  if (status === 401) {
    return { status, code, serverMessage, fallbackKey: 'errores.unauthorized', retryable: false }
  }

  if (status === 403) {
    return { status, code, serverMessage, fallbackKey: 'errores.forbidden', retryable: false }
  }

  if (status === 400 || status === 409 || status === 422) {
    return { status, code, serverMessage, fallbackKey, retryable: Boolean(code && RETRYABLE_CODES.has(code)) }
  }

  if (RETRYABLE_STATUS.has(status) || RETRYABLE_CODES.has(code)) {
    return { status, code, serverMessage, fallbackKey: 'errores.upstream_error', retryable: true }
  }

  return { status, code, serverMessage, fallbackKey, retryable: false }
}

// Convierte el descriptor en la frase que lee el usuario, en el idioma de este render. Hay que
// llamarla dentro de un componente que se suscriba al idioma (useT()), o el texto no se
// actualizará al cambiar de lengua aunque ya no esté congelado.
//
// Acepta también un string por comodidad de los sitios que aún guardan texto suelto.
export const resolveApiError = (descriptor) => {
  if (!descriptor) return ''
  if (typeof descriptor === 'string') return descriptor

  const { code, serverMessage, fallbackKey } = descriptor
  return (
    getApiErrorMessage(code) ||
    normalizeServerMessage(serverMessage) ||
    t(fallbackKey || 'errores._defecto')
  )
}
