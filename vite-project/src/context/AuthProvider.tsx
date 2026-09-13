import { type ReactNode, useEffect, useState } from 'react'
import { getSession, onAuthChange } from '../lib/auth'
import { AuthContext, type AuthState } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    session: null,
  })

  useEffect(() => {
    let active = true

    getSession().then((session) => {
      if (!active) return
      setState({ status: session ? 'authed' : 'anon', session })
    })

    const unsubscribe = onAuthChange((session) => {
      setState({ status: session ? 'authed' : 'anon', session })
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
