// tOptional(): un código desconocido debe dar undefined, no la clave.
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

export const normalizeApiError = (error, fallbackKey = 'errores._defecto') => {
  const status = error?.response?.status || null
  const detail = readDetail(error?.response?.data)
  const code = normalizeErrorCode(detail.code || error?.response?.data?.code)
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
