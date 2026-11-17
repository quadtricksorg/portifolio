import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles the information you share with us.`,
};

// TODO: client to review and approve the final policy text before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Privacy policy." lead="How we handle the information you share with us." />
      <section className="container-x pb-24">
        <div className="max-w-[68ch] space-y-6 text-fg-muted">
          <p>
            When you contact {site.name} through this website, we collect only the details you provide, such as your name, email address, company and message. We use them to respond to your enquiry and, if we work together, to deliver the project.
          </p>
          <p>We do not sell or share your information with third parties for marketing. We use privacy-friendly analytics to understand how the site is used; no personal profiles are built.</p>
          <p>
            You can ask us to correct or delete your information at any time by emailing{" "}
            <a href={`mailto:${site.contact.email}`} className="text-fg underline decoration-border-strong underline-offset-4 hover:text-accent-text">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
