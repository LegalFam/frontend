import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ChatMessage from '@/components/chat/ChatMessage'
import { tIn } from '@/i18n/translate'
import { useLanguageStore } from '@/store/languageStore'

const es = (key, vars) => tIn('es', key, vars)

const answer = (overrides = {}) => ({
  id: 'answer-1',
  role: 'ASSISTANT',
  content: 'Respuesta en español',
  language: 'es',
  citations: [],
  ...overrides,
})

const renderMessage = (message, props = {}) =>
  render(
    <MemoryRouter>
      <ChatMessage message={message} {...props} />
    </MemoryRouter>
  )

beforeEach(() => useLanguageStore.setState({ language: 'es' }))
afterEach(cleanup)

describe('ChatMessage sources', () => {
  const citations = [
    {
      sourceTitle: '"Código Civil"',
      sourceUrl: 'https://example.org/cc',
      sourceLocator: 'Art. 472',
      sourceLocatorKind: 'exact',
      sourceBreadcrumb: 'Libro III',
      sourceOriginalSnippet: 'Se entiende por alimentos lo indispensable.',
      sourceSnippet: 'Define los alimentos.',
    },
    {
      sourceTitle: 'Código Civil',
      sourceUrl: 'https://example.org/cc',
      sourceLocator: 'Art. 472',
      sourceLocatorKind: 'exact',
      sourceOriginalSnippet: 'se entiende por alimentos',
      sourceSnippet: 'Duplicado del mismo pasaje.',
    },
    { sourceTitle: 'Pleno casatorio', sourceLocator: 'Fundamento 5', sourceLocatorKind: 'heading', sourceSnippet: 'Resumen' },
    { sourceTitle: '', sourceSnippet: '', sourceUrl: '' },
  ]

  it('groups citations by document and drops duplicate passages', () => {
    renderMessage(answer({ citations }))

    const toggle = screen.getByRole('button', { name: new RegExp(es('chat.mensaje.fuentesUtilizadas')) })
    expect(toggle.textContent).toContain('3')
    fireEvent.click(toggle)

    expect(screen.getAllByText('Código Civil')).toHaveLength(1)
    expect(screen.getByTitle('Libro III').textContent).toBe('Art. 472')
    expect(screen.queryByText('Duplicado del mismo pasaje.')).toBeNull()
    expect(screen.queryByText('Fundamento 5')).toBeNull()
    expect(screen.getByText(es('chat.mensaje.verFuente')).getAttribute('href')).toBe('https://example.org/cc')
    expect(screen.getByText(es('chat.mensaje.resumenAsistente'))).toBeTruthy()
  })
})

describe('ChatMessage notices', () => {
  it('shows specialist, weak-source and low-confidence notices with next steps', () => {
    renderMessage(answer({
      specialistSupportRecommended: true,
      citationSupportStatus: 'WEAK',
      confidenceStatus: 'LOW',
      nextSteps: ['Ir a la **DEMUNA**'],
    }))

    expect(screen.getByText(es('chat.mensaje.especialistaEnlace')).getAttribute('href')).toBe('/contactos-emergencia')
    expect(screen.getByText(es('chat.mensaje.fuentesDebilesTitulo'))).toBeTruthy()
    expect(screen.getByText(es('chat.mensaje.alcanceLimitadoTitulo'))).toBeTruthy()
    expect(screen.getByText('DEMUNA').tagName).toBe('STRONG')
  })

  it('explains answers without sources and skips the low-confidence note', () => {
    renderMessage(answer({ citationSupportStatus: 'NONE', confidenceStatus: 'LOW' }))

    expect(screen.getByText(es('chat.mensaje.sinFuentesTitulo'))).toBeTruthy()
    expect(screen.queryByText(es('chat.mensaje.alcanceLimitadoTitulo'))).toBeNull()
  })

  it('shows delivery states and unwraps JSON-quoted content', () => {
    renderMessage({ id: 'tmp_1', role: 'USER', content: 'Mi pregunta', state: 'sending' })
    expect(screen.getByText(es('chat.mensaje.enviando'))).toBeTruthy()
    cleanup()

    for (const [state, key] of [['processing', 'procesando'], ['unknown_delivery', 'verificando'], ['failed', 'noEnviado']]) {
      renderMessage({ id: 'u', role: 'USER', content: 'x', state })
      expect(screen.getByText(es(`chat.mensaje.${key}`))).toBeTruthy()
      cleanup()
    }

    renderMessage(answer({ content: '"Texto entre comillas"' }))
    expect(screen.getByText('Texto entre comillas')).toBeTruthy()
  })
})

describe('ChatMessage system errors', () => {
  it('offers retry and plans for system errors', () => {
    const onRetry = vi.fn()
    const onUpgrade = vi.fn()
    renderMessage(
      { id: 'sys-1', role: 'SYSTEM', errorCode: 'insufficient_tokens', content: 'sin tokens' },
      { onRetry, onUpgrade, retryText: '¿Qué es la tenencia?' }
    )

    expect(screen.getByText(es('errores.insufficient_tokens'))).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: es('chat.mensaje.reintentar') }))
    fireEvent.click(screen.getByRole('button', { name: es('chat.mensaje.verPlanes') }))

    expect(onRetry).toHaveBeenCalledWith('¿Qué es la tenencia?', 'sys-1')
    expect(onUpgrade).toHaveBeenCalled()
  })

  it('renders translated message keys', () => {
    renderMessage({ id: 'welcome', role: 'ASSISTANT', messageKey: 'chat.mensaje.sistema' })

    expect(screen.getAllByText(es('chat.mensaje.sistema')).length).toBeGreaterThan(0)
    expect(screen.queryAllByTitle(/★|calificar/i)).toHaveLength(0)
  })
})

describe('ChatMessage translations', () => {
  const quechua = answer({
    language: 'qu',
    content: 'Respuesta en español',
    contentLocalized: 'Kichwapi kutichiy',
    nextSteps: ['Paso uno'],
    nextStepsLocalized: ['Ñawpaq ruray'],
    citations: [{ sourceTitle: 'Código Civil', sourceSnippet: 'Resumen', sourceSnippetLocalized: 'Pisiyachisqa' }],
  })

  it('shows the translation and toggles back to Spanish', () => {
    renderMessage(quechua)

    expect(screen.getByText('Kichwapi kutichiy')).toBeTruthy()
    expect(screen.getByText('Ñawpaq ruray')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: es('comun.verEnEspanol') }))

    expect(screen.getByText('Respuesta en español')).toBeTruthy()
    expect(screen.getByText('Paso uno')).toBeTruthy()
  })

  it('explains a language switch and lets the user adopt it', () => {
    renderMessage(answer({ language: 'qu', languageRequested: 'es' }))

    const adopt = screen.getByRole('button', { name: tIn('qu', 'chat.mensaje.idiomaDetectadoAccion', { idioma: 'Runasimi' }) })
    fireEvent.click(adopt)

    expect(useLanguageStore.getState().language).toBe('qu')
  })
})

describe('ChatMessage rating', () => {
  it('saves a star rating and a comment', async () => {
    const onRate = vi.fn().mockResolvedValue()
    renderMessage(answer(), { onRate })

    fireEvent.click(screen.getByRole('button', { name: es('chat.mensaje.comentario') }))
    expect(screen.getByText(es('chat.mensaje.calificaPrimero'))).toBeTruthy()

    fireEvent.click(screen.getByTitle(tIn('es', 'chat.mensaje.calificar_other', { n: 4 })))
    expect(await screen.findByRole('status')).toBeTruthy()
    expect(onRate).toHaveBeenLastCalledWith('answer-1', 4, '')

    fireEvent.click(screen.getByRole('button', { name: es('chat.mensaje.comentario') }))
    fireEvent.change(screen.getByPlaceholderText(es('chat.mensaje.comentarioPlaceholder')), { target: { value: 'Muy útil' } })
    fireEvent.click(screen.getByRole('button', { name: es('chat.mensaje.guardarComentario') }))

    await waitFor(() => expect(onRate).toHaveBeenLastCalledWith('answer-1', 4, 'Muy útil'))
  })

  it('restores the previous rating when saving fails', async () => {
    const onRate = vi.fn().mockRejectedValue(new Error('offline'))
    const { container } = renderMessage(answer({ rating: 2 }), { onRate })

    fireEvent.click(screen.getByTitle(tIn('es', 'chat.mensaje.calificar_other', { n: 5 })))

    await waitFor(() => expect(onRate).toHaveBeenCalled())
    await waitFor(() => expect(container.querySelectorAll('button[disabled]')).toHaveLength(0))
    expect(screen.queryByRole('status')).toBeNull()
  })
})
