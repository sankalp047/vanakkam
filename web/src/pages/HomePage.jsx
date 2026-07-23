import { Hero } from '../components/home/Hero';
import { ShowsCarousel } from '../components/home/ShowsCarousel';
import { BigFanApp } from '../components/home/BigFanApp';
import { ScheduleGrid } from '../components/home/ScheduleGrid';
import { SponsorBanner } from '../components/home/SponsorBanner';
import { AboutStats } from '../components/home/AboutStats';
import { ContactSection } from '../components/home/ContactSection';

export function HomePage() {
  return (
    <div className="page-content">
      <Hero />
      <ShowsCarousel />
      <BigFanApp />
      <ScheduleGrid />
      <SponsorBanner />
      <AboutStats />
      <ContactSection />
    </div>
  );
}
