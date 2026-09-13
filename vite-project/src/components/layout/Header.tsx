import logo from '../../assets/nixon-logo.svg'
import { useLocale } from '../../context/locale-context'

const navigationItems = [
  { key: 'home', href: '#home', icon: '⌂' },
  { key: 'about', href: '#about', icon: '◌' },
  { key: 'skills', href: '#skills', icon: '◈' },
  { key: 'strengths', href: '#strengths', icon: '✦' },
  { key: 'experience', href: '#experience', icon: '▦' },
  { key: 'education', href: '#education', icon: '❖' },
  { key: 'projects', href: '#projects', icon: '◇' },
  { key: 'contact', href: '#contact', icon: '@' },
] as const

function Header() {
  const { t } = useLocale()

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        {t.header.skipToContent}
      </a>
      <div className="site-header__inner">
        <a
          className="site-brand"
          href="#home"
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
        </a>
        <nav aria-label="Main navigation">
          <ul className="site-nav">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>
                  <span className="site-nav__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="site-nav__label">{t.nav[item.key]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
