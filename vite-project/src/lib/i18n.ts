export type Locale = 'en' | 'fr'

const STORAGE_KEY = 'locale'
const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'fr']

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'fr'
}

/** The visitor's explicit choice, if they have made one. */
export function getStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return isLocale(value) ? value : null
  } catch {
    // localStorage unavailable (private mode, disabled storage, quota) —
    // fall back to "no explicit choice" rather than throwing.
    return null
  }
}

/** The visitor's browser/OS language, mapped to a locale we support. */
export function getBrowserLocale(): Locale {
  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language]

  for (const language of languages) {
    const primary = language.slice(0, 2).toLowerCase()
    if (isLocale(primary)) return primary
  }

  return 'en'
}

/** What should be shown right now: the stored choice, else the browser's language. */
export function resolveLocale(): Locale {
  return getStoredLocale() ?? getBrowserLocale()
}

/** Persist an explicit choice so it survives a reload. */
export function setStoredLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // The choice just won't survive a reload; it still applies now.
  }
}

export { SUPPORTED_LOCALES }
