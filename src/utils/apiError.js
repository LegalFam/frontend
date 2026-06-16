const DEFAULT_MESSAGE = 'No se pudo completar la acción. Intenta nuevamente.'

const RETRYABLE_STATUS = new Set([408, 502, 503, 504])
const RETRYABLE_CODES = new Set([
  'UPSTREAM_TIMEOUT',
  'UPSTREAM_UNAVAILABLE',
  'UPSTREAM_EMPTY_RESPONSE',
  'UPSTREAM_INVALID_RESPONSE',
  'UPSTREAM_ERROR',
  'AGENT_VALIDATION_FAILED',
])

const ERROR_MESSAGES_BY_CODE = {
  message_processing_pending: 'Ya hay una consulta en proceso. Espera a que termine antes de enviar otra.',
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

  const lower = trimmed.toLowerCase()
  if (lower === 'an unexpected error occurred') {
    return 'Ocurrió un problema inesperado. Intenta nuevamente.'
  }
  if (lower === 'access is forbidden') {
    return 'No tienes permisos para realizar esta acción.'
  }
  if (lower === 'malformed request body') {
    return 'La solicitud no tiene un formato válido.'
  }

  return trimmed
}

export const normalizeApiError = (error, fallbackMessage = DEFAULT_MESSAGE) => {
  const status = error?.response?.status || null
  const detail = readDetail(error?.response?.data)
  const code = detail.code || error?.response?.data?.code || null
  const serverMessage = normalizeServerMessage(detail.message || error?.response?.data?.message)
  const hasResponse = Boolean(status)

  if (!hasResponse) {
    return {
      status,
      code: 'NETWORK_ERROR',
      message: 'Conexión interrumpida. Estamos verificando el estado de la conversación.',
      retryable: true,
    }
  }

  if (status === 401) {
    return { status, code, message: 'Tu sesión expiró. Inicia sesión nuevamente.', retryable: false }
  }

  if (status === 403) {
    return {
      status,
      code,
      message: serverMessage || 'No tienes tokens disponibles o la sesión no está activa.',
      retryable: false,
    }
  }

  if (status === 400 || status === 409 || status === 422) {
    const isAgentFailure = code && RETRYABLE_CODES.has(code)
    const clientMessage = ERROR_MESSAGES_BY_CODE[code]
    return {
      status,
      code,
      message: clientMessage || serverMessage || fallbackMessage,
      retryable: isAgentFailure,
    }
  }

  if (RETRYABLE_STATUS.has(status) || RETRYABLE_CODES.has(code)) {
    return {
      status,
      code,
      message: serverMessage || 'No pude preparar la respuesta por un problema temporal. Puedes intentar nuevamente.',
      retryable: true,
    }
  }

  return {
    status,
    code,
    message: serverMessage || fallbackMessage,
    retryable: false,
  }
}
