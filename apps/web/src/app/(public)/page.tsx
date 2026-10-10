import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { PublicFooter } from "@/components/public-footer";
import { buttonVariants } from "@/components/ui/button";
import { categoriesTransport } from "@/features/categories/categories-transport";
import { LandingSearch } from "@/features/places/components/landing-search";
import { displayName } from "@/i18n/display-name";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.landing.metaTitle, description: t.landing.metaDescription };
}

export default async function LandingPage() {
  const [categories, t, locale] = await Promise.all([
    categoriesTransport.getCategories(),
    getDictionary(),
    getLocale(),
  ]);

  return (
    <>
      <div className="container mx-auto max-w-5xl px-4">
        <section className="mx-auto grid max-w-2xl gap-5 py-12 text-center sm:py-16">
          <p className="text-sm font-medium text-muted-foreground">{t.landing.eyebrow}</p>
          <h1 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
            {t.landing.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">{t.landing.subtitle}</p>
          <LandingSearch />
          {categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/map?category=${encodeURIComponent(category.slug)}` as Route}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {displayName(category.nameMy, category.nameEn, locale)}
                </Link>
              ))}
            </div>
          ) : null}
          <div>
            <Link href={"/map" as Route} className={buttonVariants({ variant: "ghost" })}>
              <MapPin className="size-4" aria-hidden />
              {t.landing.browseMap}
            </Link>
          </div>
        </section>
        <section className="mx-auto grid max-w-4xl gap-3 pb-12 sm:grid-cols-3">
          {t.landing.highlights.map((highlight) => (
            <div key={highlight.title} className="rounded-2xl border p-5">
              <h2 className="font-medium">{highlight.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{highlight.body}</p>
            </div>
          ))}
        </section>
      </div>
      <PublicFooter />
    </>
  );
}
