import TopBar from '@/components/TopBar';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import About from '@/components/About';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Work />
        <About />
        <Services />
        <Process />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
