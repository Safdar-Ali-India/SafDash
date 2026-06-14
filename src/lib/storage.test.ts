import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadJSON, saveJSON } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads fallback when key is missing', () => {
    expect(loadJSON('missing', { ok: true })).toEqual({ ok: true })
  })

  it('round-trips JSON values with prefix', () => {
    saveJSON('tasks', [{ id: '1' }])
    expect(loadJSON('tasks', [])).toEqual([{ id: '1' }])
    expect(localStorage.getItem('safdash:tasks')).toBeTruthy()
  })

  it('returns parsed object for JSON with __proto__ key (does not throw)', () => {
    localStorage.setItem('safdash:settings', '{"__proto__":{"polluted":true},"githubUsername":"x"}')
    const result = loadJSON<Record<string, unknown>>('settings', {})
    expect(result).toHaveProperty('githubUsername', 'x')
    expect(Object.prototype).not.toHaveProperty('polluted')
  })

  it('returns fallback when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadJSON('x', 'fallback')).toBe('fallback')
  })

  it('does not throw when localStorage setItem fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(() => saveJSON('tasks', [])).not.toThrow()
  })
})
