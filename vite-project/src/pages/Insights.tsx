import { useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Reveal from '../components/motion/Reveal'
import { useLocale } from '../context/locale-context'

function Insights() {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.meta.insightsTitle
  }, [t])

  return (
    <MainLayout>
      <section id="insights" className="portfolio-section portfolio-section--insights">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.insights.eyebrow}</p>
          <h2>
            {t.insights.heading[0]}
            <br />
            {t.insights.heading[1]}
          </h2>
          <p className="framework-intro">{t.insights.intro}</p>
        </Reveal>
        <div className="insight-grid">
          {t.insights.items.map((item, index) => (
            <Reveal as="div" delay={index * 0.06} key={item.title}>
              <article className="insight-card">
                <div className="insight-card__meta">
                  <span className="insight-card__tag">{item.tag}</span>
                  <span>{item.readTime}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </MainLayout>
  )
}

export default Insights
