import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

/**
 * Wraps protected routes. Shows a loading state during the initial session
 * check, redirects to /login (preserving the attempted path) when there is no
 * session, and never flashes protected content.
 */
function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <main id="main-content" className="admin-shell">
        <p className="route-status" role="status">
          Checking your session…
        </p>
      </main>
    )
  }

  if (status === 'anon') {
    const attempted = location.pathname + location.search
    const query =
      attempted && attempted !== '/backoffice'
        ? `?redirect=${encodeURIComponent(attempted)}`
        : ''
    return <Navigate to={`/login${query}`} replace />
  }

  return <>{children}</>
}

export default RequireAuth
