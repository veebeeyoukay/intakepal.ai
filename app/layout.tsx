import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntakePal - The friendliest first step in care",
  description:
    "AI-native patient intake via voice, text, or web. Real-time eligibility, EHR write-back, and Spanish support.",
  openGraph: {
    title: "IntakePal - The friendliest first step in care",
    description:
      "AI-native patient intake via voice, text, or web. Real-time eligibility, EHR write-back, and Spanish support.",
    url: "https://intakepal.ai",
    siteName: "IntakePal",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
