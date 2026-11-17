import { Hero } from "@/components/home/Hero";
import { TickerBands } from "@/components/home/TickerBands";
import { Studio } from "@/components/home/Studio";
import { ServicesStack } from "@/components/home/ServicesStack";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { ImageMarquee } from "@/components/home/ImageMarquee";
import { WhyUs } from "@/components/home/WhyUs";
import { ProcessStrip } from "@/components/home/ProcessStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";

/**
 * Single-page site. Every section has an id so it can be reached with
 * /#section links from the menu, and scrolling continues to the next one.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: `${site.name} | ${site.tagline}`, url: site.url }} />
      <Hero />
      <TickerBands />
      <Studio />
      <ServicesStack />
      <WorkShowcase />
      <ImageMarquee />
      <WhyUs />
      <ProcessStrip />
      <AboutSection />
      <ContactSection />
    </>
  );
}
