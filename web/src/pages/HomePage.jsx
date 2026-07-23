import { Hero } from '../components/home/Hero';
import { AdCarousel } from '../components/home/AdCarousel';
import { ShowsCarousel } from '../components/home/ShowsCarousel';
import { BigFanApp } from '../components/home/BigFanApp';
import { ScheduleGrid } from '../components/home/ScheduleGrid';
import { AboutStats } from '../components/home/AboutStats';
import { ContactSection } from '../components/home/ContactSection';

export function HomePage() {
  return (
    <div className="page-content">
      <Hero />
      <AdCarousel />
      <ShowsCarousel />
      <BigFanApp />
      <ScheduleGrid />
      <AboutStats />
      <ContactSection />
    </div>
  );
}
