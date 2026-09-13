import { supabase } from './supabaseClient'

export type ContactMessageInput = {
  name: string
  email: string
  message: string
}

/** One row of the `messages` table, as read by the back office. */
export type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export type ContactMessageResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'failed' }

export async function createContactMessage(
  input: ContactMessageInput,
): Promise<ContactMessageResult> {
  if (!supabase) {
    return { ok: false, reason: 'not-configured' }
  }

  const { error } = await supabase.from('messages').insert(input)

  return error ? { ok: false, reason: 'failed' } : { ok: true }
}

export type ListMessagesResult =
  | { ok: true; data: ContactMessage[] }
  | { ok: false; reason: 'not-configured' | 'failed' }

/**
 * Read every message, newest first. RLS only returns rows to the
 * `admin@codeboxx.com` session; an anonymous caller gets an empty set.
 */
export async function listMessages(): Promise<ListMessagesResult> {
  if (!supabase) {
    return { ok: false, reason: 'not-configured' }
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id, name, email, message, created_at')
    .order('created_at', { ascending: false })

  if (error || !data) {
    return { ok: false, reason: 'failed' }
  }

  return { ok: true, data: data as ContactMessage[] }
}

export type DeleteMessageResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'failed' }

/**
 * Delete one message by id. `.select()` makes Supabase return the deleted
 * row(s), so a delete that RLS silently blocked (0 rows) is reported as a
 * failure instead of a false success.
 */
export async function deleteMessage(id: string): Promise<DeleteMessageResult> {
  if (!supabase) {
    return { ok: false, reason: 'not-configured' }
  }

  const { data, error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)
    .select('id')

  if (error || !data || data.length === 0) {
    return { ok: false, reason: 'failed' }
  }

  return { ok: true }
}
