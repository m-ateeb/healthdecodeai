import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HealthDecodeAI",
    template: "%s | HealthDecodeAI"
  },
  description: "AI-powered health insights and personalized wellness recommendations",
  keywords: ["health", "AI", "wellness", "healthcare", "medical", "diagnosis"],
  authors: [{ name: "HealthDecodeAI Team" }],
  creator: "HealthDecodeAI",
  metadataBase: new URL("https://healthdecodeai.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://healthdecodeai.com",
    title: "HealthDecodeAI",
    description: "AI-powered health insights and personalized wellness recommendations",
    siteName: "HealthDecodeAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthDecodeAI",
    description: "AI-powered health insights and personalized wellness recommendations",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="healthdecodeai-theme"
        >
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
