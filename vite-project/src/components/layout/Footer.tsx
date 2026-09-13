import { useLocale } from '../../context/locale-context'

function Footer() {
  const { t } = useLocale()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          <strong>E'Onna Nixon</strong> {t.footer.tagline}
        </p>
        <div className="site-footer__links" aria-label="Professional links">
          <a href="mailto:eonnait25@gmail.com">{t.footer.email}</a>
          <a
            href="https://github.com/FS2505NixonE"
            target="_blank"
            rel="noreferrer"
          >
            {t.footer.github}
          </a>
          <a href="#contact">{t.footer.cta}</a>
        </div>
        <p className="site-footer__copyright">
          © {new Date().getFullYear()} E'Onna Nixon
        </p>
      </div>
    </footer>
  )
}

export default Footer
