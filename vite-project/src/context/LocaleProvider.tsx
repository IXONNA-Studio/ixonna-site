import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { dictionaries } from '../i18n'
import { resolveLocale, setStoredLocale, type Locale } from '../lib/i18n'
import { LocaleContext } from './locale-context'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveLocale())

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  function setLocale(next: Locale) {
    setStoredLocale(next)
    setLocaleState(next)
  }

  const value = useMemo(
    () => ({ locale, t: dictionaries[locale], setLocale }),
    [locale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
