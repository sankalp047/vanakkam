import { Hero } from '../components/home/Hero';
import { ShowsCarousel } from '../components/home/ShowsCarousel';
import { SponsorBanner } from '../components/home/SponsorBanner';
import { AboutStats } from '../components/home/AboutStats';
import { ContactSection } from '../components/home/ContactSection';

export function HomePage() {
  return (
    <div className="page-content">
      <Hero />
      <ShowsCarousel />
      <SponsorBanner />
      <AboutStats />
      <ContactSection />
    </div>
  );
}
