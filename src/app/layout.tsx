import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Unbounded } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { services } from "@/content/services";
import { Footer } from "@/components/layout/Footer";
import { themeInitScript } from "@/components/layout/ThemeToggle";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollHelper } from "@/components/layout/ScrollHelper";
import { BrandScene } from "@/components/brand/BrandScene";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  // Labels only: not needed for first paint, so skip the preload.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.metaDescription,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    title: `${site.name} | ${site.tagline}`,
    description: site.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.metaDescription,
  },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090e" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${unbounded.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${site.url}/#organization`,
            name: site.name,
            slogan: site.tagline,
            description: site.description,
            url: site.url,
            logo: `${site.url}/icon.svg`,
            email: site.contact.email,
            telephone: `+${site.contact.phones[0].number}`,
            address: { "@type": "PostalAddress", addressLocality: site.contact.locations[0].city, addressRegion: "Kerala", addressCountry: "IN" },
            contactPoint: site.contact.phones.map((p) => ({
              "@type": "ContactPoint",
              telephone: `+${p.number}`,
              email: site.contact.email,
              contactType: "sales",
              availableLanguage: ["English"],
            })),
            areaServed: ["India", "United Arab Emirates", "GCC", "United States", "Canada", "United Kingdom"],
            ...(Object.values(site.social).some(Boolean) ? { sameAs: Object.values(site.social).filter(Boolean) } : {}),
          }}
        />
        <BrandScene />
        <SmoothScroll />
        <MotionProvider>
          <Header services={services.map(({ slug, index, shortName }) => ({ slug, index, shortName }))} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <ScrollHelper />
        </MotionProvider>
      </body>
    </html>
  );
}
