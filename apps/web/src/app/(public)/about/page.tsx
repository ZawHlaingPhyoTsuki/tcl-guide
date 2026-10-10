import type { Metadata } from "next";
import Link from "next/link";

import { PublicFooter } from "@/components/public-footer";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.about.metaTitle, description: t.about.metaDescription };
}

export default async function AboutPage() {
  const t = await getDictionary();
  return (
    <>
      <div className="container mx-auto max-w-prose px-4 py-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t.about.title}</h1>
        <div className="mt-4 grid gap-4 text-base leading-loose">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>
            {t.about.ctaPre}{" "}
            <Link href="/contact" className="underline underline-offset-4">
              {t.about.ctaLink}
            </Link>
            .
          </p>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
