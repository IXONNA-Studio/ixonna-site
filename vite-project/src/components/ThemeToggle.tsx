import { useEffect, useState } from 'react'
import {
  getStoredTheme,
  resolveTheme,
  setTheme,
  subscribeToSystemTheme,
  type Theme,
} from '../lib/theme'

/**
 * Mounted once at the app root (see App.tsx), outside <Routes>, so this one
 * instance covers every route — including /login and /backoffice, which
 * don't share the public Header — without being wired into each page.
 */
function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => resolveTheme())

  useEffect(() => {
    // Keep following the OS live for as long as no explicit choice exists.
    return subscribeToSystemTheme((next) => {
      if (!getStoredTheme()) setThemeState(next)
    })
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{isDark ? '☾' : '☀'}</span>
    </button>
  )
}

export default ThemeToggle
