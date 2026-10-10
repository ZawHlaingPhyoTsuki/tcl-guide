import type { Metadata } from "next";

import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Contact · TCL Guide",
  description: "Suggest a place or report an error in the directory.",
};

// Owner fills in real channels before launch. Empty values render an honest
// fallback instead of a fabricated address.
const CONTACT = {
  email: "",
  facebook: "",
};

export default function ContactPage() {
  const hasChannel = CONTACT.email !== "" || CONTACT.facebook !== "";

  return (
    <>
      <div className="container mx-auto max-w-prose px-4 py-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Contact</h1>
        <div className="mt-4 grid gap-4 text-base leading-loose">
          <p>
            Know a place that belongs in the directory, or spotted wrong hours, a moved pin, or a
            closed shop? Send the place name, what&apos;s wrong (or what&apos;s good), and a photo
            if you have one.
          </p>
          {hasChannel ? (
            <ul className="grid gap-2">
              {CONTACT.email ? (
                <li>
                  Email:{" "}
                  <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">
                    {CONTACT.email}
                  </a>
                </li>
              ) : null}
              {CONTACT.facebook ? (
                <li>
                  Facebook:{" "}
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    TCL Guide
                  </a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Our inbox isn&apos;t public yet — check back soon.
            </p>
          )}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
