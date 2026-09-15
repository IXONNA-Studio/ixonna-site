import { useEffect } from 'react'
import ixSymbol from '../assets/branding/IXONNA-IX-symbol.png'
import MainLayout from '../components/layout/MainLayout'
import Reveal from '../components/motion/Reveal'
import { useLocale } from '../context/locale-context'

function Studio() {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.meta.studioTitle
  }, [t])

  return (
    <MainLayout>
      <section id="studio" className="portfolio-section">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.studio.eyebrow}</p>
          <h2>
            {t.studio.heading[0]}
            <br />
            {t.studio.heading[1]}
          </h2>
        </Reveal>
        <div className="about-copy">
          <img
            className="about-portrait"
            src={ixSymbol}
            alt={t.studio.portraitAlt}
            width={720}
            height={450}
            loading="lazy"
          />
          <div className="about-text">
            {t.studio.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="stat-row">
              {t.studio.stats.map((stat) => (
                <span key={stat.label}>
                  <strong>{stat.number}</strong>
                  <small>{stat.label}</small>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="portfolio-section">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.experience.eyebrow}</p>
          <h2>
            {t.experience.heading[0]}
            <br />
            {t.experience.heading[1]}
          </h2>
        </Reveal>
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
        <Reveal className="section-heading">
          <p className="eyebrow">{t.education.eyebrow}</p>
          <h2>
            {t.education.heading[0]}
            <br />
            {t.education.heading[1]}
          </h2>
        </Reveal>
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
    </MainLayout>
  )
}

export default Studio
