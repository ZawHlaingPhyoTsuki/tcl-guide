import Link from "next/link";
import { MapPin, Map as MapIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/get-locale";
import { LocaleToggle } from "@/i18n/locale-toggle";
import { MobilePublicMenu } from "./mobile-public-menu";

const linkClassName =
  "inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export async function PublicHeader() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4" aria-label={t.nav.main}>
        <Link
          href="/"
          className="mr-4 flex shrink-0 items-center gap-2 font-heading text-lg font-semibold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <MapPin className="size-4" aria-hidden />
          </span>
          {t.brand}
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <Link href="/about" className={linkClassName}>
            {t.nav.about}
          </Link>
          <Link href="/contact" className={linkClassName}>
            {t.nav.contact}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle locale={locale} />
          <Link href="/login" className={`${linkClassName} hidden sm:inline-flex`}>
            {t.nav.login}
          </Link>
          <Link
            href="/map"
            className={buttonVariants({
              size: "sm",
              className: "h-10 gap-1.5 rounded-full px-4 font-semibold shadow-md shadow-primary/25",
            })}
          >
            <MapIcon className="size-4" aria-hidden />
            {t.nav.map}
          </Link>
          <MobilePublicMenu />
        </div>
      </nav>
    </header>
  );
}
