import { useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Reveal from '../components/motion/Reveal'
import { useLocale } from '../context/locale-context'

const indexTag = (position: number) => String(position + 1).padStart(2, '0')

function Services() {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.meta.servicesTitle
  }, [t])

  return (
    <MainLayout>
      <section id="services" className="portfolio-section portfolio-section--skills">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2>
            {t.services.heading[0]}
            <br />
            {t.services.heading[1]}
          </h2>
        </Reveal>
        <div className="skill-grid">
          {t.services.items.map((pillar, index) => (
            <Reveal as="div" delay={index * 0.06} key={pillar.title}>
              <article className="skill-card skill-card--pillar">
                <span className="skill-card__icon" aria-hidden="true">
                  {indexTag(index)}
                </span>
                <h3>{pillar.title}</h3>
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </MainLayout>
  )
}

export default Services
