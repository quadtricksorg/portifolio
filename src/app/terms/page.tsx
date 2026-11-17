import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: `Terms for using the ${site.name} website.`,
  path: "/terms",
});

// TODO: client to review and approve the final terms text before launch.
export default function TermsPage() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Terms of use." lead="The basics of using this website." />
      <section className="container-x pb-24">
        <div className="max-w-[68ch] space-y-6 text-fg-muted">
          <p>
            The content on this website, including text, designs, logos and project presentations, belongs to {site.name} or to the clients who have given permission for their work to be shown. Please do not reproduce it without permission.
          </p>
          <p>Project work is shown for information only. Engagement terms for any new project are agreed in a separate written proposal and agreement.</p>
          <p>{site.support.detail}</p>
        </div>
      </section>
    </>
  );
}
