import type { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

type MainLayoutProps = {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="site-shell">
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
