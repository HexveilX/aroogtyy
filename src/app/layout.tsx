import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lora, Caveat, Aref_Ruqaa, Amiri } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const arefRuuqaa = Aref_Ruqaa({
  variable: "--font-aref",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

/* Amiri — the reading voice of the Arabic universe: a Bulaq-press
   naskh that pairs with Lora the way Cormorant pairs with itself. */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Aroogty ♡ — our little universe",
  description: "A small place was made just for you.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/heart.svg",
    apple: "/heart-apple.png",
  },
  appleWebApp: {
    title: "Aroogty ♡ — our little universe",
  },
  openGraph: {
    title: "Aroogty ♡ — our little universe",
    description: "A small place was made just for you.",
    images: [
      {
        url: "/og.png",
        width: 1344,
        height: 768,
        alt: "A burgundy scrapbook — a pressed rose, a folded note, a wax seal, and one small candle",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0A0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Arabic-first: the page is an Arabic page from the very
     first server-rendered byte — dir="rtl" before hydration,
     no LTR flash, portals included. English survives only as
     isolated LTR islands (dates, titles, archival labels). */
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${lora.variable} ${caveat.variable} ${arefRuuqaa.variable} ${amiri.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
