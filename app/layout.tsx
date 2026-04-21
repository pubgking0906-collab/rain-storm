import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "XRain - Turn Predictions Into Profits",
  description: "The blockchain-native prediction market where it pays to be right. Trade on outcomes from crypto to sports, powered by Rain Protocol.",
  keywords: ["prediction market", "crypto", "blockchain", "Rain Protocol", "Arbitrum", "trading", "XRain"],
  openGraph: {
    title: "XRain - Turn Predictions Into Profits",
    description: "The blockchain-native prediction market where it pays to be right.",
    siteName: "XRain",
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
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
