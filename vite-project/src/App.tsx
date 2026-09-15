import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import AdminShortcut from './components/AdminShortcut'
import LanguageSwitcher from './components/LanguageSwitcher'
import Cursor from './components/motion/Cursor'
import RequireAuth from './components/RequireAuth'
import ThemeToggle from './components/ThemeToggle'
import { AuthProvider } from './context/AuthProvider'
import { LocaleProvider } from './context/LocaleProvider'
import AdminLogin from './pages/AdminLogin'
import Backoffice from './pages/Backoffice'
import Framework from './pages/Framework'
import Home from './pages/Home'
import Insights from './pages/Insights'
import Services from './pages/Services'
import Studio from './pages/Studio'
import Work from './pages/Work'
import './App.css'

// react-router does not reset scroll position on navigation. Without this,
// clicking a nav link while scrolled down leaves the next page's content
// rendered mid-scroll instead of at the top.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LocaleProvider>
        <AuthProvider>
          <ScrollToTop />
          <Cursor />
          <ThemeToggle />
          <LanguageSwitcher />
          <AdminShortcut />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/services" element={<Services />} />
            <Route path="/framework" element={<Framework />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/backoffice"
              element={
                <RequireAuth>
                  <Backoffice />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}

export default App
