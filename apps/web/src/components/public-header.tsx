import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/get-locale";
import { LocaleToggle } from "@/i18n/locale-toggle";

const linkClassName =
  "inline-flex h-10 items-center rounded-lg px-2 text-sm text-muted-foreground hover:text-foreground";

export async function PublicHeader() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4" aria-label={t.nav.main}>
        <Link href="/" className="mr-auto text-base font-semibold">
          {t.brand}
        </Link>
        <Link href="/map" className={linkClassName}>
          {t.nav.map}
        </Link>
        <Link href="/about" className={linkClassName}>
          {t.nav.about}
        </Link>
        <Link href="/contact" className={linkClassName}>
          {t.nav.contact}
        </Link>
        <LocaleToggle locale={locale} />
        <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
          {t.nav.login}
        </Link>
      </nav>
    </header>
  );
}
