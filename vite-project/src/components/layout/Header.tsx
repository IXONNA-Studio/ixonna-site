import { Link } from 'react-router-dom'
import logo from '../../assets/branding/IXONNA-IX-symbol.png'
import { useLocale } from '../../context/locale-context'
import Magnetic from '../motion/Magnetic'

const withBase = (path: string) =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + path

const navigationItems = [
  { key: 'work', icon: '◇', to: '/work' },
  { key: 'services', icon: '◈', to: '/services' },
  { key: 'framework', icon: '✳', to: '/framework' },
  { key: 'studio', icon: '◌', to: '/studio' },
  { key: 'insights', icon: '✦', to: '/insights' },
  { key: 'contact', icon: '@', hash: '#contact' },
] as const

function Header() {
  const { t } = useLocale()

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        {t.header.skipToContent}
      </a>
      <div className="site-header__inner">
        <Link
          className="site-brand"
          to="/"
          aria-label={t.header.brandHomeLabel}
        >
          <img
            className="site-brand__logo"
            src={logo}
            alt={t.header.brandLogoAlt}
          />
          <span>
            {t.header.brandName}
            <small>{t.header.brandTagline}</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <ul className="site-nav">
            {navigationItems.map((item) => (
              <li key={item.key}>
                {'hash' in item ? (
                  <a href={withBase(`/${item.hash}`)}>
                    <span className="site-nav__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="site-nav__label">{t.nav[item.key]}</span>
                  </a>
                ) : (
                  <Link to={item.to}>
                    <span className="site-nav__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="site-nav__label">{t.nav[item.key]}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Magnetic className="site-header__cta">
          <a className="nav-cta" href={withBase('/#contact')}>
            {t.header.ctaProject} <span aria-hidden="true">→</span>
          </a>
        </Magnetic>
      </div>
    </header>
  )
}

export default Header
