import type { Metadata } from "next";
import {
  Geist_Mono,
  DM_Sans,
  Inter,
  Geist,
  Space_Grotesk,
  Playfair_Display,
  Roboto,
  Roboto_Mono,
  Roboto_Serif,
  Poppins,
  Acme,
  DM_Mono,
  Playfair,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const playFairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

const acme = Acme({
  variable: "--font-acme",
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-insturment-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Planetform",
  description:
    "Create beautiful, modern forms with an intuitive block-based editor. Simple to build, powerful to analyze",
  applicationName: "Planetform",
  creator: "raj shakya",
  twitter: {
    card: "summary_large_image",
    site: "@RajShak96083714",
    creator: "@RajShak96083714",
    title: "Planetform",
    description:
      "Create beautiful, modern forms with an intuitive block-based editor. Simple to build, powerful to analyze",
    images: "https://bucket.planetform.xyz/planetform-assets/og-planetform.png",
  },
  openGraph: {
    type: "website",
    countryName: "India",
    description:
      "Create beautiful, modern forms with an intuitive block-based editor. Simple to build, powerful to analyze",
    emails: "rajshakya631@gmail",
    siteName: "Planetform",
    title: "Planetform",
    images: "https://bucket.planetform.xyz/planetform-assets/og-planetform.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(`${dmSans.variable} ${geistMono.variable} ${inter.variable} ${geist.variable} ${spaceGrotesk.variable} ${playFairDisplay.variable} antialiased , ${roboto.variable}
          ${robotoMono.variable} ${robotoSerif.variable} ${poppins.variable} ${acme.variable} ${playfair.variable} ${instrumentSerif.variable}`)}
      >
        <div className={`font-sans tracking-tighter `}>{children}</div>
        <Toaster richColors className="font-sans" position="top-right" />
      </body>
    </html>
  );
}
