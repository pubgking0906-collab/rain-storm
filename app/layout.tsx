import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/providers/WalletProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "RainStorm - Turn Predictions Into Profits",
  description: "The blockchain-native prediction market where it pays to be right. Trade on outcomes from crypto to sports, powered by Rain Protocol.",
  keywords: ["prediction market", "crypto", "blockchain", "Rain Protocol", "Arbitrum", "trading"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
