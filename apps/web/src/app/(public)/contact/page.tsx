import type { Metadata } from "next";

import { PublicFooter } from "@/components/public-footer";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.contact.metaTitle, description: t.contact.metaDescription };
}

// Owner fills in real channels before launch. Empty values render an honest
// fallback instead of a fabricated address.
const CONTACT = {
  email: "",
  facebook: "",
};

export default async function ContactPage() {
  const t = await getDictionary();
  const hasChannel = CONTACT.email !== "" || CONTACT.facebook !== "";

  return (
    <>
      <div className="container mx-auto max-w-prose px-4 py-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t.contact.title}</h1>
        <div className="mt-4 grid gap-4 text-base leading-loose">
          <p>{t.contact.intro}</p>
          {hasChannel ? (
            <ul className="grid gap-2">
              {CONTACT.email ? (
                <li>
                  {t.contact.emailLabel}{" "}
                  <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">
                    {CONTACT.email}
                  </a>
                </li>
              ) : null}
              {CONTACT.facebook ? (
                <li>
                  {t.contact.facebookLabel}{" "}
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {t.brand}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="text-muted-foreground">{t.contact.inboxMissing}</p>
          )}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
