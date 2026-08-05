import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SITE_METADATA } from "@/lib/constants";

const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

// Variable weight is required to request the optical-size axis (next/font only
// accepts `axes` when weight is `variable`). opsz keeps small italics from
// going spindly at the 11-15px sizes the chat and rails use.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  subsets: ["latin"],
});

// Absolute, basePath-aware URL to the committed static OG image. (Next does not
// prepend basePath to metadata image URLs, so it is spelled out here.)
const ogImage = `${SITE_METADATA.url}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.origin),
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: SITE_METADATA.url,
    siteName: SITE_METADATA.title,
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_METADATA.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        {/* framer's whileInView serializes opacity:0 into the static export, so
            no-JS visitors would see nothing below the chat. An author-stylesheet
            !important beats those inline styles and restores full visibility. */}
        <noscript>
          <style>{`#main [style]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
        <MotionConfig reducedMotion="user">
          <LenisProvider>
            <ScrollProgress />
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </LenisProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
