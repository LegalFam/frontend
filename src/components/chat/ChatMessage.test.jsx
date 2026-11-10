import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import ChatMessage from '@/components/chat/ChatMessage'

const renderMessage = (message) =>
  render(
    <MemoryRouter>
      <ChatMessage message={message} />
    </MemoryRouter>,
  )

afterEach(cleanup)

describe('ChatMessage while the answer is being written', () => {
  it('renders the partial Markdown without rating controls', () => {
    const { container } = renderMessage({
      id: 'streaming_user-1',
      role: 'ASSISTANT',
      content: '**Bienes propios:** los que',
      citations: [],
      language: 'es',
      isStreaming: true,
    })

    expect(screen.getByText('Bienes propios:').tagName).toBe('STRONG')
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull()
    expect(container.querySelectorAll('button')).toHaveLength(0)
  })

  it('still offers rating on a finished answer', () => {
    const { container } = renderMessage({
      id: 'answer-1',
      role: 'ASSISTANT',
      content: 'Respuesta final',
      citations: [],
      language: 'es',
    })

    expect(container.querySelector('[aria-busy="true"]')).toBeNull()
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0)
  })
})
