import { afterEach, describe, expect, it } from 'vitest'
import { applyTheme, getStoredTheme, storeTheme } from './theme'

afterEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('theme', () => {
  it('follows the system until a choice is stored', () => {
    expect(getStoredTheme()).toBe('system')
  })

  it('stores light and dark and forgets the choice for system', () => {
    storeTheme('dark')
    expect(getStoredTheme()).toBe('dark')
    storeTheme('light')
    expect(getStoredTheme()).toBe('light')
    storeTheme('system')
    expect(localStorage.getItem('theme')).toBeNull()
    expect(getStoredTheme()).toBe('system')
  })

  it('ignores unknown stored values', () => {
    localStorage.setItem('theme', 'sepia')
    expect(getStoredTheme()).toBe('system')
  })

  it('sets data-theme on <html> and removes it for system', () => {
    applyTheme('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    applyTheme('light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    applyTheme('system')
    expect(document.documentElement).not.toHaveAttribute('data-theme')
  })
})
