import { useEffect } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Reveal from '../components/motion/Reveal'
import { useLocale } from '../context/locale-context'

const withBase = (path: string) =>
  path.startsWith('/')
    ? import.meta.env.BASE_URL.replace(/\/$/, '') + path
    : path

const projectImages = [
  '/images/project-rocket-elevators.png',
  '/images/project-rocket-elevators-admin.png',
  '/images/project-codebloggs.png',
  '/images/project-rocket-food.png',
]

function Work() {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.meta.workTitle
  }, [t])

  return (
    <MainLayout>
      <section id="work" className="portfolio-section portfolio-section--projects">
        <Reveal className="section-heading">
          <p className="eyebrow">{t.projects.eyebrow}</p>
          <h2>
            {t.projects.heading[0]}
            <br />
            {t.projects.heading[1]}
          </h2>
        </Reveal>
        <div className="project-grid">
          {t.projects.items.map((project, index) => (
            <Reveal as="div" delay={index * 0.06} key={project.name}>
              <article className="project-card">
                <img
                  className="project-card__media"
                  src={withBase(projectImages[index])}
                  alt={project.imageAlt}
                  width={640}
                  height={480}
                  loading="lazy"
                />
                <div className="project-card__body">
                  <p className="eyebrow">{project.category}</p>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </MainLayout>
  )
}

export default Work
