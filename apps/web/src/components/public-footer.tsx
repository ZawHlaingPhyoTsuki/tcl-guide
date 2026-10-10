import Link from "next/link";

import { getDictionary } from "@/i18n/get-dictionary";

export async function PublicFooter() {
  const t = await getDictionary();
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {t.brand}
        </p>
        <nav className="flex gap-4 sm:ml-auto" aria-label={t.nav.footer}>
          <Link href="/about" className="hover:text-foreground">
            {t.nav.about}
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            {t.nav.contact}
          </Link>
          <Link href="/login" className="hover:text-foreground">
            {t.nav.login}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
