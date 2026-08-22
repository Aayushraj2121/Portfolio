import About from '@/components/About';
import Contact from '@/components/Contact';
import Credentials from '@/components/Credentials';
import Experience from '@/components/Experience';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import Projects from '@/components/Projects';

export default function Page() {
  return (
    <>
      <a href="#about" className="skipLink">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Credentials />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
