import { useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Reveal from '../components/motion/Reveal'
import { useLocale } from '../context/locale-context'

function Framework() {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.meta.frameworkTitle
  }, [t])

  return (
    <MainLayout>
      <section id="framework" className="portfolio-section portfolio-section--framework">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.framework.eyebrow}</p>
          <h2>
            {t.framework.heading[0]}
            <br />
            {t.framework.heading[1]}
          </h2>
          <p className="framework-intro">{t.framework.intro}</p>
        </Reveal>
        <ol className="framework-steps">
          {t.framework.steps.map((step, index) => (
            <Reveal as="li" delay={index * 0.05} key={step.number}>
              <span className="framework-step__number">{step.number}</span>
              <span className="framework-step__body">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </span>
            </Reveal>
          ))}
        </ol>
      </section>
    </MainLayout>
  )
}

export default Framework
