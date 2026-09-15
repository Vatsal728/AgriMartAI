import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { HtmlLangSync } from "@/lib/i18n/HtmlLangSync";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AgriSmart AI",
  description: "Intelligent agriculture advisor: disease detection, crop recommendation, irrigation, weather, and sustainability insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LanguageProvider>
          <HtmlLangSync />
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
