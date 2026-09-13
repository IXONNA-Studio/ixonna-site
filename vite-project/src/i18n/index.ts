import type { Locale } from '../lib/i18n'
import en from './en.json'
import fr from './fr.json'

/** The shape every locale dictionary must satisfy, derived from the English source of truth. */
export type Dictionary = typeof en

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  // fr.json is authored by hand to mirror en.json's structure; this cast
  // trusts that structure rather than re-deriving it, the same way any
  // translated JSON is trusted against a source-of-truth type.
  fr: fr as Dictionary,
}
