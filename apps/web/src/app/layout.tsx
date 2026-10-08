import type { Metadata } from "next";
import localFont from "next/font/local";

import "../index.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const outfitHeading = localFont({
  src: "../fonts/outfit-latin.woff2",
  variable: "--font-heading",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "tcl-guide",
  description: "tcl-guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, outfitHeading.variable)}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
