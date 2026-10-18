import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { WorkshopsSection } from "@/components/WorkshopsSection";
import { AudienceSection } from "@/components/AudienceSection";
import { ContactSection } from "@/components/ContactSection";
import { DonateSection } from "@/components/DonateSection";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";

export default function Home() {
  return (
    <div>
      <SkipLink />
      <Navbar />
      <main id="main">
        <Hero />
        <AboutSection />
        <WorkshopsSection />
        <AudienceSection />
        <ContactSection />
        <DonateSection />
      </main>
      <Footer />
    </div>
  );
}
