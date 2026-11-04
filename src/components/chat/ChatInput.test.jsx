import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ChatInput from './ChatInput'

const field = () => screen.getByRole('textbox')
const type = (text) => {
  field().value = text
  fireEvent.input(field())
}

afterEach(cleanup)

describe('ChatInput drafts', () => {
  it('hands over what was typed when it leaves', () => {
    const onLeave = vi.fn()
    const { unmount } = render(<ChatInput onSend={vi.fn()} onLeave={onLeave} />)

    type('a medio escribir')
    unmount()

    expect(onLeave).toHaveBeenCalledWith('a medio escribir')
  })

  it('hands over nothing after sending', () => {
    const onSend = vi.fn()
    const onLeave = vi.fn()
    const { unmount } = render(<ChatInput onSend={onSend} onLeave={onLeave} />)

    type('¿qué es la tenencia?')
    fireEvent.keyDown(field(), { key: 'Enter' })
    unmount()

    expect(onSend).toHaveBeenCalledTimes(1)
    expect(onLeave).toHaveBeenCalledWith('')
  })

  it('does not carry text or the privacy notice to another session', () => {
    const { rerender } = render(<ChatInput key="a" onSend={vi.fn()} />)

    type('mi DNI es 45678912')
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(document.querySelector('[class*=privacyError]')).not.toBeNull()

    rerender(<ChatInput key="b" onSend={vi.fn()} />)

    expect(field().value).toBe('')
    expect(document.querySelector('[class*=privacyError]')).toBeNull()
  })

  it('restores the draft of the session it opens', () => {
    render(<ChatInput onSend={vi.fn()} draft={{ text: 'guardado', ts: 1 }} />)

    expect(field().value).toBe('guardado')
  })

  it('hands over a restored draft that was left untouched', () => {
    const onLeave = vi.fn()
    const { unmount } = render(<ChatInput onSend={vi.fn()} onLeave={onLeave} draft={{ text: 'guardado', ts: 1 }} />)

    unmount()

    expect(onLeave).toHaveBeenCalledWith('guardado')
  })
})
