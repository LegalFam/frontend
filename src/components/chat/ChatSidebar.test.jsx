import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import { useLanguageStore } from '@/store/languageStore'
import { tIn } from '@/i18n/translate'
import ChatSidebar from './ChatSidebar'

const es = (key, vars) => tIn('es', key, vars)

const sessions = [
  { id: 's1', title: 'Pensión de alimentos' },
  { id: 's2', title: 'Tenencia del menor' },
  { id: 's3', title: null, createdAt: null },
]

const renderSidebar = (props = {}) => {
  const handlers = {
    onSelectSession: vi.fn(),
    onLoadMoreSessions: vi.fn(),
    onNewChat: vi.fn(),
    onRenameSession: vi.fn(),
    onDeleteSession: vi.fn(),
    onSelectGlossaryTerm: vi.fn(),
    onClose: vi.fn(),
    onSignout: vi.fn(),
  }
  render(
    <MemoryRouter>
      <ChatSidebar open sessions={sessions} activeSessionId="s1" {...handlers} {...props} />
    </MemoryRouter>
  )
  return handlers
}

const search = () => screen.getByRole('searchbox', { name: es('chat.sidebar.buscarAria') })

beforeEach(() => {
  useLanguageStore.setState({ language: 'es' })
  useAuthStore.setState({ accessToken: 'a', user: { name: 'Ana Quispe', email: 'ana@x.pe' } })
})

afterEach(cleanup)

describe('ChatSidebar', () => {
  it('shows the user initials and the default title for untitled sessions', () => {
    renderSidebar()

    expect(screen.getByText('AQ')).toBeTruthy()
    expect(screen.getByText('ana@x.pe')).toBeTruthy()
    expect(screen.getByText(es('chat.consulta'))).toBeTruthy()
  })

  it('filters sessions ignoring accents and clears the search', () => {
    renderSidebar()

    fireEvent.change(search(), { target: { value: 'pension' } })
    expect(screen.getByTitle('Pensión de alimentos')).toBeTruthy()
    expect(screen.queryByTitle('Tenencia del menor')).toBeNull()

    fireEvent.change(search(), { target: { value: 'divorcio' } })
    expect(screen.getByText(es('chat.sidebar.sinResultados'))).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: es('chat.sidebar.limpiarBusqueda') }))
    expect(screen.getByText('Tenencia del menor')).toBeTruthy()

    fireEvent.change(search(), { target: { value: 'x' } })
    fireEvent.keyDown(search(), { key: 'Escape' })
    expect(search().value).toBe('')
  })

  it('selects a session, starts a new chat and closes the panel', () => {
    const handlers = renderSidebar()

    fireEvent.click(screen.getByText('Tenencia del menor'))
    fireEvent.click(screen.getByRole('button', { name: es('chat.sidebar.nueva') }))

    expect(handlers.onSelectSession).toHaveBeenCalledWith('s2')
    expect(handlers.onNewChat).toHaveBeenCalled()
    expect(handlers.onClose).toHaveBeenCalledTimes(2)
  })

  it('renames with Enter, falls back to the default title and cancels with Escape', () => {
    const handlers = renderSidebar()
    const renameButtons = () => screen.getAllByTitle(es('chat.sidebar.renombrar'))

    fireEvent.click(renameButtons()[0])
    const input = screen.getByDisplayValue('Pensión de alimentos')
    fireEvent.change(input, { target: { value: '  Alimentos 2026  ' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handlers.onRenameSession).toHaveBeenCalledWith('s1', 'Alimentos 2026')

    fireEvent.click(renameButtons()[1])
    const second = screen.getByDisplayValue('Tenencia del menor')
    fireEvent.change(second, { target: { value: ' ' } })
    fireEvent.blur(second)
    expect(handlers.onRenameSession).toHaveBeenLastCalledWith('s2', es('chat.consulta'))

    fireEvent.click(renameButtons()[0])
    fireEvent.keyDown(screen.getByDisplayValue('Pensión de alimentos'), { key: 'Escape' })
    expect(handlers.onRenameSession).toHaveBeenCalledTimes(2)
    expect(handlers.onSelectSession).not.toHaveBeenCalled()
  })

  it('deletes a session only after confirming', () => {
    const handlers = renderSidebar()

    fireEvent.click(screen.getAllByTitle(es('chat.sidebar.eliminar'))[1])
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(es('chat.sidebar.eliminarTexto', { titulo: 'Tenencia del menor' }))).toBeTruthy()

    fireEvent.click(within(dialog).getByRole('button', { name: es('chat.sidebar.eliminar') }))

    expect(handlers.onDeleteSession).toHaveBeenCalledWith('s2')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('pages the history and shows the loading and empty states', () => {
    const handlers = renderSidebar({ hasMoreSessions: true })
    fireEvent.click(screen.getByRole('button', { name: es('chat.sidebar.cargarMas') }))
    expect(handlers.onLoadMoreSessions).toHaveBeenCalled()
    cleanup()

    renderSidebar({ sessions: [], loadingSessions: true })
    expect(screen.getByText(es('chat.sidebar.cargandoHistorial'))).toBeTruthy()
    cleanup()

    renderSidebar({ sessions: [] })
    expect(screen.getByText(es('chat.sidebar.sinConsultas'), { exact: false })).toBeTruthy()
  })

  it('opens glossary terms and collapses the glossary', () => {
    const handlers = renderSidebar()

    fireEvent.click(screen.getByRole('button', { name: es('glosario.casacion.termino') }))
    expect(handlers.onSelectGlossaryTerm).toHaveBeenCalledWith('casacion')

    fireEvent.click(screen.getByRole('button', { name: es('chat.glosario.titulo') }))
    expect(screen.queryByRole('button', { name: es('glosario.casacion.termino') })).toBeNull()
  })

  it('signs out from the user row', () => {
    const handlers = renderSidebar()

    fireEvent.click(screen.getByTitle(es('chat.cerrarSesion')))

    expect(handlers.onSignout).toHaveBeenCalled()
  })
})
