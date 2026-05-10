import Nav from "../components/Nav";
import Hero from "../components/Hero";
import ProjectList from "../components/ProjectList";
import About from "../components/About";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--gd)", color: "var(--c)" }}
    >
      <div className="max-w-[800px] mx-auto px-7">
        <Nav />
        <Hero />
        <ProjectList />
        <About />
        <Footer />
      </div>
    </div>
  );
}
