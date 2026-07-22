import { Hero } from '../components/home/Hero';
import { ShowsCarousel } from '../components/home/ShowsCarousel';
import { AboutStats } from '../components/home/AboutStats';
import { ContactSection } from '../components/home/ContactSection';

export function HomePage() {
  return (
    <div className="page-content">
      <Hero />
      <ShowsCarousel />
      <AboutStats />
      <ContactSection />
    </div>
  );
}
