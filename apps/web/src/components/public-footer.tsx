import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} TCL Guide</p>
        <nav className="flex gap-4 sm:ml-auto" aria-label="Footer">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
