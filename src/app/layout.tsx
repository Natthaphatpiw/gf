import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Inter,
  Kanit,
} from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n";
import { AccountProvider } from "@/lib/account";
import { Header } from "@/components/layout/Header";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/account/AuthModal";
import { CartDrawer } from "@/components/account/CartDrawer";
import { SITE_URL } from "@/lib/site";

/* ----- Typography: serif display for Latin + Kanit for Thai readability. */

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kanit = Kanit({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Goodfill Care — Samui Wellness",
  description:
    "A personal wellness journey on Koh Samui — assessment, curated packages and expert care, crafted for you.",
  icons: {
    icon: "/icon.ico",
    apple: "/icon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2faf6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-scroll-behavior="smooth">
      <body
        className={`${cormorant.variable} ${inter.variable} ${kanit.variable} antialiased`}
      >
        <LocaleProvider>
          <AccountProvider>
            <Header />
            <main className="min-h-[70vh] pb-24 md:pb-0">{children}</main>
            <Footer />
            <MobileTabBar />
            <AuthModal />
            <CartDrawer />
          </AccountProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
