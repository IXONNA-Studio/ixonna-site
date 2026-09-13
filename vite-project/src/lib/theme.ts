export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/**
 * The visitor's explicit choice, if they have made one. `null` means
 * "no choice yet — follow the OS," which index.css handles on its own via
 * `@media (prefers-color-scheme: dark)` without any JS involved.
 */
export function getStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    // localStorage unavailable (private mode, disabled storage, quota) —
    // fall back to "no explicit choice" rather than throwing.
    return null
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** What should be shown right now: the stored choice, else the OS setting. */
export function resolveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

/**
 * Pin an explicit choice: persist it and stamp <html data-theme="...">, which
 * beats the `prefers-color-scheme` media query in index.css regardless of
 * what the OS is set to.
 */
export function setTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // The choice just won't survive a reload; the toggle still works now.
  }
  document.documentElement.setAttribute('data-theme', theme)
}

/**
 * Notify `callback` when the OS-level scheme changes, but only while there is
 * no explicit stored choice — once the visitor has toggled, their choice is
 * pinned and must not be overridden by a later OS change.
 */
export function subscribeToSystemTheme(
  callback: (theme: Theme) => void,
): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (event: MediaQueryListEvent) => {
    if (getStoredTheme()) return
    callback(event.matches ? 'dark' : 'light')
  }
  media.addEventListener('change', handler)
  return () => media.removeEventListener('change', handler)
}
