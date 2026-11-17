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
import type { Metadata } from "next";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

/**
 * Single-page site. Every section has an id so it can be reached with
 * /#section links from the menu, and scrolling continues to the next one.
 */
export const metadata: Metadata = pageMetadata({ description: site.metaDescription, path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${site.url}/#website`,
          name: site.name,
          url: site.url,
          inLanguage: site.locale,
          publisher: { "@id": `${site.url}/#organization` },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${site.name} | ${site.tagline}`,
          description: site.metaDescription,
          url: site.url,
          isPartOf: { "@id": `${site.url}/#website` },
          about: { "@id": `${site.url}/#organization` },
        }}
      />
      <Hero />
      <TickerBands />
      <Studio />
      <ServicesStack services={services} />
      <WorkShowcase projects={projects} />
      <ImageMarquee />
      <WhyUs />
      <ProcessStrip />
      <AboutSection />
      <ContactSection />
    </>
  );
}
