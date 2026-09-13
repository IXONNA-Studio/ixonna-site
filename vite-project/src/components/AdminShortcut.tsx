import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Secret access: type this word (outside any text field) to open the login page.
// Recorded in docs/admin-access.md; never surfaced in the UI.
const SEQUENCE = 'admin'
const RESET_MS = 1500

/**
 * Global keydown listener that navigates to /login when the secret sequence is
 * typed. It never authenticates or bypasses the route guard, and it ignores
 * keystrokes originating in form fields so it cannot disturb the contact form.
 */
function AdminShortcut() {
  const navigate = useNavigate()
  const bufferRef = useRef('')
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.key.length !== 1
      ) {
        return
      }

      bufferRef.current = (bufferRef.current + event.key.toLowerCase()).slice(
        -SEQUENCE.length,
      )

      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        bufferRef.current = ''
      }, RESET_MS)

      if (bufferRef.current === SEQUENCE) {
        bufferRef.current = ''
        navigate('/login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(timerRef.current)
    }
  }, [navigate])

  return null
}

export default AdminShortcut
