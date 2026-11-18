import { beforeEach, describe, expect, it } from 'vitest'
import { useLanguageStore } from '@/store/languageStore'
import { tIn } from '@/i18n/translate'
import {
  getApiErrorMessage,
  normalizeApiError,
  normalizeAssistantErrorMessage,
  resolveApiError,
} from './apiError'

const failure = (status, data) => ({ response: { status, data } })

beforeEach(() => useLanguageStore.setState({ language: 'es' }))

describe('normalizeApiError', () => {
  it('treats a missing response as a retryable network error', () => {
    expect(normalizeApiError(new Error('offline'))).toMatchObject({ code: 'network_error', retryable: true })
  })

  it('classifies auth, validation and upstream failures', () => {
    expect(normalizeApiError(failure(401, {}))).toMatchObject({ fallbackKey: 'errores.unauthorized', retryable: false })
    expect(normalizeApiError(failure(403, {}))).toMatchObject({ fallbackKey: 'errores.forbidden' })
    expect(normalizeApiError(failure(400, { code: ' INVALID_REQUEST ' }), 'x.y')).toMatchObject({
      code: 'invalid_request',
      fallbackKey: 'x.y',
      retryable: false,
    })
    expect(normalizeApiError(failure(422, { detail: { code: 'upstream_timeout' } })).retryable).toBe(true)
    expect(normalizeApiError(failure(503, {}))).toMatchObject({ fallbackKey: 'errores.upstream_error', retryable: true })
    expect(normalizeApiError(failure(500, { message: 'boom' }))).toMatchObject({ serverMessage: 'boom', retryable: false })
  })
})

describe('resolveApiError', () => {
  it('prefers a translated code, then the server message, then the fallback', () => {
    expect(resolveApiError(null)).toBe('')
    expect(resolveApiError('texto')).toBe('texto')
    expect(resolveApiError({ code: 'invalid_credentials' })).toBe(tIn('es', 'errores.invalid_credentials'))
    expect(resolveApiError({ code: 'desconocido', serverMessage: 'Invalid credentials' }))
      .toBe(tIn('es', 'errores.invalid_credentials'))
    expect(resolveApiError({ serverMessage: 'Algo raro' })).toBe('Algo raro')
    expect(resolveApiError({ fallbackKey: 'errores._defecto' })).toBe(tIn('es', 'errores._defecto'))
  })
})

describe('assistant and code messages', () => {
  it('uses the fallback for unknown or empty codes', () => {
    expect(getApiErrorMessage(null, 'f')).toBe('f')
    expect(getApiErrorMessage('no_existe', 'f')).toBe('f')
    expect(normalizeAssistantErrorMessage(null, '')).toBe(tIn('es', 'errores._asistente'))
    expect(normalizeAssistantErrorMessage(null, ' Mensaje propio ')).toBe('Mensaje propio')
  })
})
