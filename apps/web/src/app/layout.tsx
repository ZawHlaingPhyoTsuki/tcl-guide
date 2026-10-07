import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({ subsets: ["latin"], variable: "--font-heading" });

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
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
