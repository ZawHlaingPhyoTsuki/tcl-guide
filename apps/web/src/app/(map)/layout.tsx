import Link from "next/link";
import { MapPin } from "lucide-react";

import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/get-locale";
import { LocaleToggle } from "@/i18n/locale-toggle";

export default async function MapLayout({ children }: { children: React.ReactNode }) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <div className="relative h-svh">
      {children}
      <div className="absolute z-30 hidden items-center gap-1 rounded-full border border-border/70 bg-card/95 p-1 shadow-md backdrop-blur md:top-4 md:right-16 md:flex">
        <Link
          href="/"
          aria-label={t.brand}
          className="flex h-8 items-center gap-2 rounded-full pr-2 pl-1 font-heading text-sm font-semibold"
        >
          <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <MapPin className="size-3.5" aria-hidden />
          </span>
          <span className="hidden sm:inline">{t.brand}</span>
        </Link>
        <LocaleToggle locale={locale} />
      </div>
    </div>
  );
}
