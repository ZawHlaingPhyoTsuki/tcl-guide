import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { categoriesTransport } from "@/features/categories/categories-transport";
import { LandingSearch } from "@/features/places/components/landing-search";

export const metadata: Metadata = {
  title: "TCL Guide — Find food in Tachileik",
  description:
    "A curated, bilingual directory of Tachileik's restaurants, cafes, bakeries, and street food. Browse the map.",
};

const HIGHLIGHTS = [
  {
    title: "Curated by admins",
    body: "Every listing is checked — name, photos, hours, prices, and location — before it becomes visible.",
  },
  {
    title: "Burmese + English",
    body: "Names and details in both languages, so visitors and locals read the same directory.",
  },
  {
    title: "Map-first",
    body: "See where everything is at a glance, then tap through to photos, hours, and directions.",
  },
];

export default async function LandingPage() {
  const categories = await categoriesTransport.getCategories();

  return (
    <>
      <div className="container mx-auto max-w-5xl px-4">
        <section className="mx-auto grid max-w-2xl gap-5 py-12 text-center sm:py-16">
          <p className="text-sm font-medium text-muted-foreground">
            Tachileik, Myanmar · food directory
          </p>
          <h1 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
            Find somewhere good to eat in Tachileik
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            One browsable directory of restaurants, cafes, bakeries, and street food — no more
            scrolling through Telegram posts.
          </p>
          <LandingSearch />
          {categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(0, 8).map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  render={
                    <Link href={`/map?category=${encodeURIComponent(category.slug)}` as Route} />
                  }
                >
                  {category.nameMy}
                </Button>
              ))}
            </div>
          ) : null}
          <div>
            <Button variant="ghost" render={<Link href={"/map" as Route} />}>
              <MapPin className="size-4" aria-hidden />
              Browse the full map
            </Button>
          </div>
        </section>
        <section className="mx-auto grid max-w-4xl gap-3 pb-12 sm:grid-cols-3">
          {HIGHLIGHTS.map((highlight) => (
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
