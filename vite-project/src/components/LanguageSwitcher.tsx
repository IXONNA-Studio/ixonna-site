import { useLocale } from '../context/locale-context'
import type { Locale } from '../lib/i18n'

const OTHER_LOCALE: Record<Locale, Locale> = { en: 'fr', fr: 'en' }

/**
 * Mounted once at the app root (see App.tsx), outside <Routes>, so this one
 * instance covers every route — mirrors ThemeToggle's placement and styling
 * pattern so the two controls read as one pair of settings.
 */
function LanguageSwitcher() {
  const { locale, t, setLocale } = useLocale()
  const next = OTHER_LOCALE[locale]

  return (
    <button
      type="button"
      className="language-switcher"
      onClick={() => setLocale(next)}
      aria-label={t.languageSwitcher.label}
      title={t.languageSwitcher.label}
    >
      <span aria-hidden="true">{next.toUpperCase()}</span>
    </button>
  )
}

export default LanguageSwitcher
