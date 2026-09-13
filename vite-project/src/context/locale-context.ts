import { createContext, useContext } from 'react'
import en from '../i18n/en.json'
import type { Dictionary } from '../i18n'
import type { Locale } from '../lib/i18n'

export type LocaleState = {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

export const LocaleContext = createContext<LocaleState>({
  locale: 'en',
  t: en,
  setLocale: () => {},
})

export function useLocale(): LocaleState {
  return useContext(LocaleContext)
}
