import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export type SignInResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'unavailable' | 'error' }

/**
 * Sign the admin in with Supabase Auth. Uses the shared client from
 * `supabaseClient`; never creates a second client. The `admin@codeboxx.com`
 * account must already exist in the Supabase dashboard.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  if (!supabase) {
    return { ok: false, reason: 'unavailable' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) {
    return { ok: true }
  }

  const isInvalid =
    error.status === 400 || /invalid login credentials/i.test(error.message)
  return { ok: false, reason: isInvalid ? 'invalid' : 'error' }
}

/** Clear the Supabase session. Safe to call when Supabase is not configured. */
export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

/** Read the persisted session (restored by supabase-js from browser storage). */
export async function getSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Subscribe to auth state changes (sign-in, sign-out, token refresh, and
 * sign-out in another tab). Returns an unsubscribe function.
 */
export function onAuthChange(
  callback: (session: Session | null) => void,
): () => void {
  if (!supabase) {
    return () => {}
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return () => data.subscription.unsubscribe()
}
