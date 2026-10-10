import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const linkClassName =
  "inline-flex h-10 items-center rounded-lg px-2 text-sm text-muted-foreground hover:text-foreground";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-4" aria-label="Main">
        <Link href="/" className="mr-auto text-base font-semibold">
          TCL Guide
        </Link>
        <Link href="/map" className={linkClassName}>
          Map
        </Link>
        <Link href="/about" className={linkClassName}>
          About
        </Link>
        <Link href="/contact" className={linkClassName}>
          Contact
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Login
        </Link>
      </nav>
    </header>
  );
}
