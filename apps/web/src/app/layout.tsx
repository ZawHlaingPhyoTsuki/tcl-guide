import type { Metadata } from "next";
import localFont from "next/font/local";

import "../index.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const outfitHeading = localFont({
  src: "../fonts/outfit-latin.woff2",
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      <body className={cn("antialiased", "style-rhea")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
