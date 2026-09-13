import { useEffect } from 'react'
import portrait from '../assets/portrait.jpg'
import ContactForm from '../components/ContactForm'
import MainLayout from '../components/layout/MainLayout'
import { useLocale } from '../context/locale-context'

// Files in public/ (images, the résumé PDF) are served under the deploy base
// (import.meta.env.BASE_URL, e.g. "/Nixone.github.io/" on GitHub Pages). Vite
// does NOT rewrite string paths in JSX, so prefix them here. External URLs
// (https:, mailto:) are returned unchanged.
const withBase = (path: string) =>
  path.startsWith('/')
    ? import.meta.env.BASE_URL.replace(/\/$/, '') + path
    : path

// Decorative icons and non-text data (image paths, outbound URLs, tech tags)
// live here rather than in the translation files, since they aren't
// user-facing copy — only their order (matching the JSON arrays) matters.
const valueIcons = ['</>', '⌁', '↗', '♧', '♕']
const skillIcons = ['⚛', '⚙', '◫', '⎇', '✓', '▣']
const strengthIcons = ['✉', '⇄', '↻', '⚑', '⏱', '♡']

// Newest first — the array order matches i18n/en.json's education.items order.
const projectImages = [
  '/images/project-rocket-elevators.png',
  '/images/project-rocket-elevators-admin.png',
  '/images/project-codebloggs.png',
  '/images/project-rocket-food.png',
]

// Thumbnails are AI-generated (see Research.md). Each card links out in a new tab.
const linkTargets = [
  { url: 'https://github.com/FS2505NixonE', image: '/images/link-github.png' },
  {
    url: 'https://www.linkedin.com/in/eonna-nixon-266323170',
    image: '/images/link-linkedin.png',
  },
  { url: '/EOnna-Nixon-Resume.pdf', image: '/images/link-resume.png' },
  { url: 'mailto:eonnait25@gmail.com', image: '/images/link-email.png' },
]

function Home() {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.meta.title
  }, [t])

  return (
    <MainLayout>
      <section id="home" className="portfolio-hero">
        <div className="portfolio-hero__art">
          <div className="hero-orbit hero-orbit--one" aria-hidden="true"></div>
          <div className="hero-orbit hero-orbit--two" aria-hidden="true"></div>
          <img src={portrait} alt={t.hero.portraitAlt} />
        </div>
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
            <a className="hero-cta" href="#projects">
              {t.hero.ctaWork} <span aria-hidden="true">↗</span>
            </a>
            <a
              className="hero-cta hero-cta--ghost"
              href={withBase('/EOnna-Nixon-Resume.pdf')}
              download
              target="_blank"
              rel="noopener"
            >
              {t.hero.ctaResume} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section className="value-strip" aria-label="Core values">
        {t.values.items.map((value, index) => (
          <div key={value.title}>
            <strong>{valueIcons[index]}</strong>
            <span>
              <b>{value.title}</b>
              {value.body}
            </span>
          </div>
        ))}
      </section>

      <section id="about" className="portfolio-section">
        <div className="section-heading">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2>
            {t.about.heading[0]}
            <br />
            {t.about.heading[1]}
          </h2>
        </div>
        <div className="about-copy">
          {/* AI-generated image (see Research.md): created with OpenAI DALL-E 3 via ChatGPT */}
          <img
            className="about-portrait"
            src={withBase('/images/ai-portrait.png')}
            alt={t.about.portraitAlt}
            width={720}
            height={450}
            loading="lazy"
          />
          <div className="about-text">
            {t.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="stat-row">
              {t.about.stats.map((stat) => (
                <span key={stat.label}>
                  <strong>{stat.number}</strong>
                  <small>{stat.label}</small>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="portfolio-section portfolio-section--skills">
        <div className="section-heading">
          <p className="eyebrow">{t.skills.eyebrow}</p>
          <h2>
            {t.skills.heading[0]}
            <br />
            {t.skills.heading[1]}
          </h2>
        </div>
        <div className="skill-grid">
          {t.skills.items.map((skill, index) => (
            <article className="skill-card" key={skill.title}>
              <span className="skill-card__icon" aria-hidden="true">
                {skillIcons[index]}
              </span>
              <h3>{skill.title}</h3>
              <p>{skill.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="strengths" className="portfolio-section portfolio-section--soft">
        <div className="section-heading">
          <p className="eyebrow">{t.strengths.eyebrow}</p>
          <h2>
            {t.strengths.heading[0]}
            <br />
            {t.strengths.heading[1]}
          </h2>
        </div>
        <div className="soft-skill-content">
          {/* AI-generated image (see Research.md): created with OpenAI DALL-E 3 via ChatGPT */}
          <img
            className="soft-skill-banner"
            src={withBase('/images/ai-workspace.png')}
            alt={t.strengths.bannerAlt}
            width={960}
            height={540}
            loading="lazy"
          />
          <div className="skill-grid">
            {t.strengths.items.map((strength, index) => (
              <article className="skill-card" key={strength.title}>
                <span className="skill-card__icon" aria-hidden="true">
                  {strengthIcons[index]}
                </span>
                <h3>{strength.title}</h3>
                <p>{strength.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="portfolio-section">
        <div className="section-heading">
          <p className="eyebrow">{t.experience.eyebrow}</p>
          <h2>
            {t.experience.heading[0]}
            <br />
            {t.experience.heading[1]}
          </h2>
        </div>
        <div className="timeline">
          {t.experience.items.map((job) => (
            <article className="timeline-item" key={`${job.role}-${job.org}`}>
              <p className="timeline-item__dates">{job.dates}</p>
              <h3>{job.role}</h3>
              <p className="timeline-item__org">{job.org}</p>
              <p>{job.summary}</p>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="portfolio-section">
        <div className="section-heading">
          <p className="eyebrow">{t.education.eyebrow}</p>
          <h2>
            {t.education.heading[0]}
            <br />
            {t.education.heading[1]}
          </h2>
        </div>
        <div className="timeline">
          {t.education.items.map((entry) => (
            <article
              className="timeline-item"
              key={`${entry.school}-${entry.program}`}
            >
              <p className="timeline-item__dates">{entry.dates}</p>
              <h3>{entry.school}</h3>
              <p className="timeline-item__org">{entry.program}</p>
              <p>{entry.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="portfolio-section portfolio-section--projects">
        <div className="section-heading">
          <p className="eyebrow">{t.projects.eyebrow}</p>
          <h2>
            {t.projects.heading[0]}
            <br />
            {t.projects.heading[1]}
          </h2>
        </div>
        {/* Project screenshots live in public/images/ — replace the placeholder
            project-*.png files with real captures (documented in Research.md). */}
        <div className="project-grid">
          {t.projects.items.map((project, index) => (
            <article className="project-card" key={project.name}>
              <img
                className="project-card__media"
                src={withBase(projectImages[index])}
                alt={project.imageAlt}
                width={640}
                height={480}
                loading="lazy"
              />
              <div className="project-card__body">
                <p className="eyebrow">{project.kind}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="links" className="portfolio-section portfolio-section--projects">
        <div className="section-heading">
          <p className="eyebrow">{t.links.eyebrow}</p>
          <h2>{t.links.heading}</h2>
        </div>
        {/* Link thumbnails are AI-generated placeholders in public/images/ — see Research.md. */}
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
