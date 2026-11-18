import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import api, { chatService, paymentService, refreshAccessToken } from './api'

const calls = []
const replies = []

const respond = (config) => {
  calls.push(config)
  const reply = replies.shift() || { status: 200, data: {} }
  const response = { ...reply, config, headers: {}, statusText: '' }
  if (reply.status >= 400) {
    return Promise.reject(Object.assign(new Error(`status ${reply.status}`), { config, response }))
  }
  return Promise.resolve(response)
}

beforeEach(() => {
  calls.length = 0
  replies.length = 0
  api.defaults.adapter = respond
  useAuthStore.setState({ accessToken: 'old', refreshToken: 'refresh', user: null })
})

afterEach(() => vi.restoreAllMocks())

describe('api client', () => {
  it('sends the bearer token and default page sizes', async () => {
    await chatService.getSessions({ params: { q: 'x' } })
    await chatService.getMessages('s1')

    expect(calls[0].headers.Authorization).toBe('Bearer old')
    expect(calls[0].params).toEqual({ size: 500, q: 'x' })
    expect(calls[1].url).toBe('/chat/sessions/s1/messages')
    expect(calls[1].params).toEqual({ size: 50 })
  })

  it('refreshes the token once on 401 and retries the request', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: { accessToken: 'new', refreshToken: 'refresh2', user: { id: 'u' } },
    })
    replies.push({ status: 401, data: {} }, { status: 200, data: { ok: true } })

    const { data } = await paymentService.getSubscription()

    expect(data).toEqual({ ok: true })
    expect(calls[1].headers.Authorization).toBe('Bearer new')
    expect(useAuthStore.getState()).toMatchObject({ accessToken: 'new', refreshToken: 'refresh2', user: { id: 'u' } })
  })

  it('does not try to refresh on auth endpoints or other errors', async () => {
    const post = vi.spyOn(axios, 'post')
    replies.push({ status: 401, data: {} }, { status: 500, data: {} })

    await expect(api.post('/auth/login', {})).rejects.toThrow('status 401')
    await expect(api.get('/users/me')).rejects.toThrow('status 500')
    expect(post).not.toHaveBeenCalled()
  })

  it('logs out when refreshing fails or there is no refresh token', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('expired'))
    await expect(refreshAccessToken()).rejects.toThrow('expired')
    expect(useAuthStore.getState().accessToken).toBeNull()

    await expect(refreshAccessToken()).rejects.toThrow('Refresh token is missing')
  })

  it('queues concurrent refreshes behind the first one', async () => {
    let finish
    vi.spyOn(axios, 'post').mockReturnValue(new Promise((resolve) => { finish = resolve }))

    const first = refreshAccessToken()
    const second = refreshAccessToken()
    finish({ data: { accessToken: 'shared', refreshToken: 'r' } })

    await expect(first).resolves.toBe('shared')
    await expect(second).resolves.toBe('shared')
  })
})
