const DEFAULT_MESSAGE = 'No se pudo completar la acción. Intenta nuevamente.'

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

const ERROR_MESSAGES_BY_CODE = {
  unauthorized: 'Tu sesión expiró. Inicia sesión nuevamente.',
  forbidden: 'No tienes permisos para realizar esta acción.',
  malformed_json: 'La solicitud no tiene un formato válido.',
  invalid_request: 'Revisa los datos ingresados e intenta nuevamente.',
  max_upload_size_exceeded: 'El archivo supera el tamaño permitido.',
  internal_server_error: 'Ocurrió un problema inesperado. Intenta nuevamente.',

  email_required: 'Ingresa tu correo electrónico.',
  email_invalid: 'Ingresa un correo electrónico válido.',
  email_too_long: 'El correo electrónico es demasiado largo.',
  password_required: 'Ingresa tu contraseña.',
  password_length_invalid: 'La contraseña no cumple con la longitud requerida.',
  name_required: 'Ingresa tu nombre.',
  name_too_long: 'El nombre es demasiado largo.',
  phone_required: 'Ingresa tu número de celular.',
  phone_too_long: 'El número de celular es demasiado largo.',
  refresh_token_required: 'No se pudo renovar la sesión. Inicia sesión nuevamente.',
  profile_request_required: 'Revisa los datos ingresados e intenta nuevamente.',
  password_request_required: 'Completa los campos de contraseña e intenta nuevamente.',
  current_password_invalid: 'La contraseña actual es incorrecta.',
  message_required: 'Escribe una consulta antes de enviarla.',
  message_too_long: 'Tu consulta es demasiado larga. Reduce el texto e intenta nuevamente.',
  session_id_required: 'No se encontró la conversación. Vuelve a abrir el chat.',
  session_title_required: 'Ingresa un título para la conversación.',
  session_title_too_long: 'El título de la conversación es demasiado largo.',
  rating_required: 'Selecciona una calificación.',
  rating_out_of_range: 'La calificación debe estar entre 1 y 5.',
  feedback_comment_too_long: 'El comentario es demasiado largo.',
  plan_code_required: 'Selecciona un plan.',
  plan_code_too_long: 'El código del plan es demasiado largo.',
  plan_code_invalid: 'El plan seleccionado no es válido.',
  success_url_too_long: 'La URL de retorno es demasiado larga.',
  success_url_invalid: 'La URL de retorno no es válida.',
  cancel_url_too_long: 'La URL de cancelación es demasiado larga.',
  cancel_url_invalid: 'La URL de cancelación no es válida.',

  email_already_exists: 'Este correo ya está registrado.',
  invalid_credentials: 'Correo o contraseña incorrectos.',
  invalid_refresh_token: 'Tu sesión expiró. Inicia sesión nuevamente.',
  signup_request_required: 'Completa los datos para crear tu cuenta.',
  login_request_required: 'Ingresa tu correo y contraseña.',

  chat_session_not_found: 'No encontramos esta conversación.',
  chat_message_not_found: 'No encontramos este mensaje.',
  assistant_delivery_event_not_found: 'No encontramos la confirmación de entrega del mensaje.',
  message_processing_pending: 'Ya hay una consulta en proceso. Espera a que termine antes de enviar otra.',
  assistant_receipt_pending: 'La respuesta anterior aún se está confirmando. Espera unos segundos.',
  personal_data_not_allowed: 'Evita enviar DNI, teléfono, correo o dirección. Describe la situación de forma general.',
  metadata_only_assistant: 'La metadata solo puede aplicarse a respuestas del asistente.',
  only_assistant_messages_can_be_rated: 'Solo puedes calificar respuestas del asistente.',
  receipt_only_assistant_messages: 'Solo se puede confirmar la lectura de respuestas del asistente.',
  cursor_invalid: 'No se pudo cargar esa página de resultados. Intenta nuevamente.',
  upstream_error: 'No pude preparar la respuesta por un problema temporal. Puedes intentar nuevamente.',
  upstream_timeout: 'La respuesta está tardando más de lo esperado. Intenta nuevamente en unos segundos.',
  upstream_empty_response: 'El asistente no devolvió una respuesta. Intenta reformular tu consulta.',
  upstream_invalid_response: 'El asistente devolvió una respuesta que no pudimos procesar. Intenta nuevamente.',
  upstream_not_configured: 'El servicio del asistente no está configurado. Intenta más tarde.',
  upstream_unavailable: 'El servicio del asistente no está disponible. Intenta más tarde.',
  upstream_request_invalid: 'No se pudo preparar la consulta para el asistente. Intenta nuevamente.',
  agent_validation_failed: 'No pudimos validar la respuesta del asistente. Intenta nuevamente.',

  checkout_request_required: 'No se pudo iniciar el checkout. Intenta nuevamente.',
  paid_plan_required: 'Selecciona un plan de pago para continuar.',
  plan_not_purchasable: 'Este plan no está disponible para compra en este momento.',
  checkout_plan_already_active: 'Ya estás suscrito a este plan.',
  checkout_active_gateway_subscription: 'Cancela tu suscripción actual antes de cambiar de plan.',
  no_gateway_subscription_to_cancel: 'No tienes una suscripción activa para cancelar.',
  subscription_not_found: 'No encontramos tu suscripción.',
  subscription_inactive: 'Tu suscripción no está activa.',
  insufficient_tokens: 'No tienes tokens suficientes para enviar esta consulta.',
  webhook_payload_required: 'La notificación de pago está incompleta.',
  payment_webhook_unmatched_user: 'No pudimos asociar el pago a una cuenta.',
  webhook_payload_invalid: 'La notificación de pago no es válida.',
  webhook_user_reference_invalid: 'La referencia de usuario del pago no es válida.',
  webhook_request_id_required: 'La notificación de pago no incluye identificador de solicitud.',
  webhook_data_id_required: 'La notificación de pago no incluye identificador de datos.',
  webhook_signature_invalid: 'La firma de la notificación de pago no es válida.',
  webhook_signature_required: 'La notificación de pago no incluye firma.',
  webhook_signature_unverifiable: 'No pudimos verificar la firma de la notificación de pago.',
  payment_gateway_unavailable: 'Mercado Pago no está disponible en este momento. Intenta más tarde.',
  payment_gateway_empty_response: 'Mercado Pago no devolvió una respuesta válida. Intenta nuevamente.',
  payment_gateway_misconfigured: 'El checkout no está configurado correctamente. Intenta más tarde.',
  payment_gateway_payer_email_required: 'Mercado Pago requiere un correo del comprador.',
  payment_gateway_checkout_url_missing: 'Mercado Pago no devolvió el enlace de pago. Intenta nuevamente.',
  payment_gateway_subscription_id_required: 'No se encontró el identificador de la suscripción en Mercado Pago.',
}

const FALLBACK_MESSAGES = {
  'an unexpected error occurred': ERROR_MESSAGES_BY_CODE.internal_server_error,
  'access is forbidden': ERROR_MESSAGES_BY_CODE.forbidden,
  'authentication is required': ERROR_MESSAGES_BY_CODE.unauthorized,
  'malformed request body': ERROR_MESSAGES_BY_CODE.malformed_json,
  'request validation failed': ERROR_MESSAGES_BY_CODE.invalid_request,
  'email already exists': ERROR_MESSAGES_BY_CODE.email_already_exists,
  'invalid credentials': ERROR_MESSAGES_BY_CODE.invalid_credentials,
  'invalid refresh token': ERROR_MESSAGES_BY_CODE.invalid_refresh_token,
  'message is required': ERROR_MESSAGES_BY_CODE.message_required,
  'message processing is already pending': ERROR_MESSAGES_BY_CODE.message_processing_pending,
  'insufficient tokens': ERROR_MESSAGES_BY_CODE.insufficient_tokens,
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
  return FALLBACK_MESSAGES[trimmed.toLowerCase()] || trimmed
}

export const getApiErrorMessage = (code, fallbackMessage = null) => {
  const normalizedCode = normalizeErrorCode(code)
  return ERROR_MESSAGES_BY_CODE[normalizedCode] || fallbackMessage
}

export const normalizeAssistantErrorMessage = (code, fallbackMessage = null) =>
  getApiErrorMessage(
    code,
    normalizeServerMessage(fallbackMessage) || 'No se pudo generar la respuesta. Intenta nuevamente.'
  )

export const normalizeApiError = (error, fallbackMessage = DEFAULT_MESSAGE) => {
  const status = error?.response?.status || null
  const detail = readDetail(error?.response?.data)
  const code = normalizeErrorCode(detail.code || error?.response?.data?.code)
  const serverMessage = normalizeServerMessage(detail.message || error?.response?.data?.message)
  const clientMessage = getApiErrorMessage(code)
  const hasResponse = Boolean(status)

  if (!hasResponse) {
    return {
      status,
      code: 'network_error',
      message: 'Conexión interrumpida. Estamos verificando el estado de la conversación.',
      retryable: true,
    }
  }

  if (status === 401) {
    return {
      status,
      code,
      message: clientMessage || 'Tu sesión expiró. Inicia sesión nuevamente.',
      retryable: false,
    }
  }

  if (status === 403) {
    return {
      status,
      code,
      message: clientMessage || serverMessage || 'No tienes permisos para realizar esta acción.',
      retryable: false,
    }
  }

  if (status === 400 || status === 409 || status === 422) {
    const isAgentFailure = code && RETRYABLE_CODES.has(code)
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
      message: clientMessage || serverMessage || 'No pude preparar la respuesta por un problema temporal. Puedes intentar nuevamente.',
      retryable: true,
    }
  }

  return {
    status,
    code,
    message: clientMessage || serverMessage || fallbackMessage,
    retryable: false,
  }
}
