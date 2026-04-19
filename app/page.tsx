'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { MarketCard } from '@/components/market/MarketCard';
import { fetchMarketsFromApi } from '@/lib/data/marketApi';
import { Market } from '@/types/market';

export default function HomePage() {
  const [featuredMarkets, setFeaturedMarkets] = useState<Market[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchMarketsFromApi(6)
      .then((markets) => {
        if (isMounted) setFeaturedMarkets(markets.slice(0, 6));
      })
      .catch(() => {
        if (isMounted) setFeaturedMarkets([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background-page">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ padding: '80px 10% 100px' }}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(123,115,255,0.2),transparent_70%)]" />

        <div className="relative text-center">
          <span className="inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Rain Protocol Powered
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl lg:text-[80px]">
            Turn Predictions
            <br />
            Into Profits
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
            The blockchain-native prediction market where it pays to be right. Trade on outcomes from crypto to sports, powered by Rain Protocol.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/markets">
              <Button size="lg" className="min-w-[200px]">
                Start Trading
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="min-w-[200px] border-primary/35 bg-background-elevated/35 hover:border-primary/55">
                Learn How It Works
              </Button>
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Volume', value: '$2.5M' },
              { label: 'Active Markets', value: '234' },
              { label: 'Total Traders', value: '12.3K' },
              { label: 'Markets Resolved', value: '1,823' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-background-card/70 px-4 py-5">
                <div className="text-2xl font-bold text-gradient sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section style={{ padding: '64px 10%' }}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Featured Markets
          </h2>
          <Link href="/markets">
            <Button variant="ghost" size="sm" className="rounded-full border border-primary/25 bg-primary/5 px-4 text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary-hover">
              View All →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background-page-secondary" style={{ padding: '64px 10%' }}>
        <h2 className="mb-3 text-center text-2xl font-bold text-white md:text-3xl">
          How Prediction Markets Work
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-text-secondary">
          Four simple steps from curiosity to profit. No complex orders, no hidden fees.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { n: 1, title: 'Connect Wallet', body: 'Link your Web3 wallet in seconds. MetaMask, WalletConnect, or Coinbase Wallet supported.' },
            { n: 2, title: 'Browse Markets', body: 'Explore predictions on crypto, sports, politics, and more. Find markets where your knowledge gives you an edge.' },
            { n: 3, title: 'Trade YES/NO', body: "Buy shares based on your prediction. YES if you think it'll happen, NO if you don't. Simple as that." },
            { n: 4, title: 'Claim Winnings', body: 'When the market resolves, collect your profits instantly. 100% transparent, secured on-chain.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="rounded-2xl border border-border bg-background-card/70 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary text-xl font-bold text-white shadow-glow">
                {n}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 10%' }}>
        <div className="rounded-3xl border border-primary/20 bg-[radial-gradient(circle_at_top,rgba(123,115,255,0.2),transparent_55%),rgba(18,24,43,0.95)] p-8 text-center md:p-12">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Ready to turn your insights into profit?
          </h2>
          <Link href="/markets">
            <Button size="lg" className="min-w-[260px]">
              Connect Wallet &amp; Start Trading
            </Button>
          </Link>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {['Powered by Rain Protocol', 'Secured on Arbitrum One', 'Fully Decentralized'].map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm text-text-secondary">
                <svg className="h-5 w-5 text-positive" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background-page-secondary" style={{ padding: '48px 10%' }}>
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 font-semibold text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/markets" className="hover:text-white transition-fast">Markets</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition-fast">Portfolio</Link></li>
              <li><Link href="/about" className="hover:text-white transition-fast">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/faq" className="hover:text-white transition-fast">FAQ</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-fast">Docs</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-fast">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-fast">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Community</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-white transition-fast">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-fast">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-fast">Telegram</a></li>
              <li><a href="#" className="hover:text-white transition-fast">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">XRain</h4>
            <p className="mb-4 text-sm text-text-secondary">
              The blockchain-native prediction market powered by Rain Protocol.
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-text-secondary">
            © 2026 XRain. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
