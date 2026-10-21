import DentalHero from './components/hero/DentalHero.jsx';
import AboutSection from './components/sections/AboutSection.jsx';
import ServicesSection from './components/sections/ServicesSection.jsx';
import ContactSection from './components/sections/ContactSection.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <DentalHero />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </main>
    </>
  );
}
