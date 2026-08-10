import Nav from '../components/Nav'
import Hero from '../components/Hero'
import ProjectList from '../components/ProjectList'
import About from '../components/About'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="page-fade min-h-screen" style={{ background: 'var(--gd)', color: 'var(--c)' }}>
      <Nav />
      <div className="max-w-[800px] mx-auto px-7 pt-24">
        <Hero />
        <ProjectList />
        <About />
        <Footer />
      </div>
    </div>
  )
}