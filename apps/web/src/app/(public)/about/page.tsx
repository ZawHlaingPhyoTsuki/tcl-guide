import type { Metadata } from "next";
import Link from "next/link";

import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "About · TCL Guide",
  description: "What TCL Guide is and how its directory is curated.",
};

export default function AboutPage() {
  return (
    <>
      <div className="container mx-auto max-w-prose px-4 py-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">About TCL Guide</h1>
        <div className="mt-4 grid gap-4 text-base leading-loose">
          <p>
            TCL Guide is a local discovery directory for Tachileik, Myanmar. It collects
            restaurants, cafes, bakeries, street-food stalls, and other food businesses into one
            browsable place, so finding somewhere to eat doesn&apos;t mean scrolling through
            scattered Telegram posts and social media threads.
          </p>
          <p>
            Every listing is curated by an admin: name, photos, category, area, hours, prices, and
            location are checked before a place becomes visible. Listings are bilingual in Burmese
            and English.
          </p>
          <p>
            Spotted something wrong, or know a place that should be listed?{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Tell us about it
            </Link>
            .
          </p>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
