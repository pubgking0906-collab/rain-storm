'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/layout/Header';
import { TradeWidget } from '@/components/market/TradeWidget';
import { Button } from '@/components/ui/Button';
import { fetchMarketByIdFromApi } from '@/lib/data/marketApi';
import { Market } from '@/types/market';
import { formatCurrency, formatDate, formatTimeRemaining, getStatusColor, formatPercentage, formatAddress } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [market, setMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    let isMounted = true;
    fetchMarketByIdFromApi(id)
      .then((result) => {
        if (isMounted) setMarket(result);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-page">
        <Header />
        <div className="max-w-container mx-auto px-4 py-16 text-center">
          <p className="text-text-secondary">Loading market...</p>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-background-page">
        <Header />
        <div className="max-w-container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Market not found</h1>
          <p className="text-text-secondary mb-8">The market you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/markets">
            <Button>Browse All Markets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = getStatusColor(market.status);

  // Mock activity data
  const recentActivity = [
    { address: '0x1a2b3c4d', action: 'bought', shares: 150, position: 'yes', time: '2m ago' },
    { address: '0x5e6f7g8h', action: 'sold', shares: 200, position: 'no', time: '5m ago' },
    { address: '0x9i0j1k2l', action: 'bought', shares: 75, position: 'yes', time: '12m ago' },
    { address: '0x3m4n5o6p', action: 'bought', shares: 300, position: 'no', time: '18m ago' },
    { address: '0x7q8r9s0t', action: 'sold', shares: 125, position: 'yes', time: '25m ago' },
    { address: '0xabcdef12', action: 'bought', shares: 180, position: 'no', time: '32m ago' },
  ];

  return (
    <div className="min-h-screen bg-background-page">
      <Header />

      <div className="max-w-container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-fast mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Markets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <div className="bg-background-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={cn('px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-full border', statusColors)}>
                  {market.status}
                </span>
                {market.status === 'live' && (
                  <span className="text-sm font-medium text-text-secondary">
                    {formatTimeRemaining(market.closesAt)}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                {market.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <span className="capitalize">{market.category.replace('-', ' ')}</span>
                <span>•</span>
                <span>Created {formatDate(market.createdAt)}</span>
                <span>•</span>
                <span>Closes {formatDate(market.closesAt)}</span>
              </div>
            </div>

            {/* Price Chart Placeholder */}
            <div className="bg-background-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Price History</h2>
                <div className="flex gap-2">
                  {['1H', '24H', '7D', '30D', 'ALL'].map((period) => (
                    <button
                      key={period}
                      className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-fast"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="relative h-80 bg-background-page-secondary rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <p className="text-text-secondary text-sm">Chart visualization coming soon</p>
                </div>
              </div>

              {/* Current Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div>
                  <div className="text-xs text-text-secondary mb-1">YES</div>
                  <div className="text-2xl font-bold text-positive">{formatPercentage(market.yesPrice)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">NO</div>
                  <div className="text-2xl font-bold text-negative">{formatPercentage(market.noPrice)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">24h Change</div>
                  <div className="text-2xl font-bold text-positive">+2.3%</div>
                </div>
              </div>
            </div>

            {/* Market Information */}
            <div className="bg-background-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Market Information</h2>
              <p className="text-text-secondary leading-relaxed mb-6">{market.description}</p>

              <h3 className="text-md font-semibold text-white mb-3">Resolution Criteria</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{market.resolutionCriteria}</p>
            </div>

            {/* Market Details */}
            <div className="bg-background-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Market Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-text-secondary mb-1">Total Volume</div>
                  <div className="text-lg font-semibold text-white">{formatCurrency(market.volume)}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Liquidity</div>
                  <div className="text-lg font-semibold text-white">{formatCurrency(market.liquidity)}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Unique Traders</div>
                  <div className="text-lg font-semibold text-white">{market.totalTraders}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Created</div>
                  <div className="text-lg font-semibold text-white">{formatDate(market.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Closes</div>
                  <div className="text-lg font-semibold text-white">{formatDate(market.closesAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Category</div>
                  <div className="text-lg font-semibold text-white capitalize">{market.category.replace('-', ' ')}</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-background-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        activity.position === 'yes' ? 'bg-positive' : 'bg-negative'
                      )} />
                      <span className="text-sm text-text-secondary">
                        <span className="text-white font-medium">{formatAddress(activity.address)}</span>
                        {' '}{activity.action}{' '}
                        <span className="text-white font-medium">{activity.shares}</span>
                        {' '}{activity.position.toUpperCase()} shares
                      </span>
                    </div>
                    <span className="text-xs text-text-tertiary">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Trade Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TradeWidget
                marketId={market.id}
                yesPrice={market.yesPrice}
                noPrice={market.noPrice}
                isConnected={isConnected}
                walletAddress={address}
                onTrade={async (action, position, amount) => {
                  console.log('Trade:', { action, position, amount, address });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
