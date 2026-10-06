import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Outfit } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({ subsets: ["latin"], variable: "--font-heading" });

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={cn("font-sans", dmSans.variable, outfitHeading.variable)}
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
