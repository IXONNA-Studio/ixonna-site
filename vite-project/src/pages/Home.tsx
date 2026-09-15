import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ixonnaWordmark from '../assets/branding/ixonna-brand-identity.png'
import ContactForm from '../components/ContactForm'
import MainLayout from '../components/layout/MainLayout'
import HeroMark from '../components/motion/HeroMark'
import Magnetic from '../components/motion/Magnetic'
import Reveal from '../components/motion/Reveal'
import { useLocale } from '../context/locale-context'

const withBase = (path: string) =>
  path.startsWith('/')
    ? import.meta.env.BASE_URL.replace(/\/$/, '') + path
    : path

const indexTag = (position: number) => String(position + 1).padStart(2, '0')

const linkTargets = [
  { url: 'https://github.com/FS2505NixonE', image: '/images/link-github.png' },
  {
    url: 'https://www.linkedin.com/in/eonna-nixon-266323170',
    image: '/images/link-linkedin.png',
  },
  { url: 'mailto:eonna@ixonna.com', image: '/images/link-email.png' },
]

function Home() {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.meta.title
  }, [t])

  // The header's Contact link points at "/#contact" so it works from every
  // page. On a fresh load of that URL the target section doesn't exist yet
  // when the browser tries its native scroll-to-hash, so it's a no-op — do
  // it ourselves once Home has mounted and rendered it.
  useEffect(() => {
    if (!window.location.hash) return
    document.querySelector(window.location.hash)?.scrollIntoView()
  }, [])

  return (
    <MainLayout>
      <section id="home" className="portfolio-hero">
        <HeroMark className="portfolio-hero__mark" />
        <div className="portfolio-hero__copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.header.brandName}</h1>
          <p className="portfolio-hero__tagline">
            {t.hero.taglineLead} <span>{t.hero.taglineHighlight}</span>
          </p>
          <p>{t.hero.intro}</p>
          <p>
            <strong>{t.hero.mission}</strong>
          </p>
          <div className="hero-actions">
            <Magnetic>
              <Link className="hero-cta" to="/work">
                {t.hero.ctaWork} <span aria-hidden="true">↗</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <a className="hero-cta hero-cta--ghost" href="#contact">
                {t.hero.ctaSecondary} <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      <section id="statement" className="ix-statement">
        <Reveal className="ix-statement__intro">
          <p className="eyebrow">{t.statement.eyebrow}</p>
          <h2>{t.statement.lead}</h2>
          <p className="ix-statement__equation">{t.statement.equation}</p>
        </Reveal>
        <Reveal as="div" delay={0.15} className="ix-statement__words">
          {t.statement.words.map((word, index) => (
            <span key={word}>
              <b>{indexTag(index)}</b>
              {word}
            </span>
          ))}
        </Reveal>
        <Reveal as="div" delay={0.25} className="ix-statement__footer">
          <p>{t.statement.closing}</p>
          <Magnetic>
            <Link className="hero-cta hero-cta--ghost" to="/framework">
              {t.statement.cta} <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      <section id="strengths" className="portfolio-section portfolio-section--soft">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.strengths.eyebrow}</p>
          <h2>
            {t.strengths.heading[0]}
            <br />
            {t.strengths.heading[1]}
          </h2>
        </Reveal>
        <div className="soft-skill-content">
          <img
            className="soft-skill-banner"
            src={ixonnaWordmark}
            alt={t.strengths.bannerAlt}
            width={570}
            height={230}
            loading="lazy"
          />
          <div className="skill-grid">
            {t.strengths.items.map((strength, index) => (
              <Reveal
                as="div"
                delay={index * 0.06}
                key={strength.title}
              >
                <article className="skill-card">
                  <span className="skill-card__icon" aria-hidden="true">
                    {indexTag(index)}
                  </span>
                  <h3>{strength.title}</h3>
                  <p>{strength.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="links" className="portfolio-section portfolio-section--projects">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.links.eyebrow}</p>
          <h2>{t.links.heading}</h2>
        </Reveal>
        <div className="project-grid">
          {t.links.items.map((link, index) => (
            <a
              className="project-card link-card"
              key={link.title}
              href={withBase(linkTargets[index].url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="project-card__media"
                src={withBase(linkTargets[index].image)}
                alt={link.imageAlt}
                width={640}
                height={480}
                loading="lazy"
              />
              <div className="project-card__body">
                <h3>
                  {link.title} <span aria-hidden="true">↗</span>
                </h3>
                <p>{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <ContactForm />
    </MainLayout>
  )
}

export default Home
