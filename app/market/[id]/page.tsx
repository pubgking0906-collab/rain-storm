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
import { useRainLive } from '@/lib/hooks/useRainLive';

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [market, setMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liveYes, setLiveYes] = useState<number | null>(null);
  const [liveNo, setLiveNo]   = useState<number | null>(null);
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

  // Live WebSocket data
  const { trades: liveTrades, connected: liveConnected, lastTradeAt } = useRainLive({ marketId: id });

  // Refresh prices from API after each new trade
  useEffect(() => {
    if (!lastTradeAt || !id) return;
    fetchMarketByIdFromApi(id).then((fresh) => {
      if (fresh) { setLiveYes(fresh.yesPrice); setLiveNo(fresh.noPrice); }
    }).catch(() => {});
  }, [lastTradeAt, id]);

  const displayYes = liveYes ?? market?.yesPrice ?? 50;
  const displayNo  = liveNo  ?? market?.noPrice  ?? 50;

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
                  <div className="text-2xl font-bold text-positive transition-all">{formatPercentage(displayYes)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">NO</div>
                  <div className="text-2xl font-bold text-negative transition-all">{formatPercentage(displayNo)}</div>
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

            {/* Live Activity Feed */}
            <div className="bg-background-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Live Activity</h2>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    liveConnected ? 'bg-positive animate-pulse' : 'bg-text-tertiary'
                  )} />
                  <span className="text-xs text-text-tertiary font-mono">
                    {liveConnected ? 'LIVE' : 'connecting…'}
                  </span>
                </div>
              </div>

              {liveTrades.length === 0 ? (
                <div className="py-8 text-center text-text-tertiary text-sm">
                  <div className="w-8 h-8 border-2 border-text-tertiary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  Waiting for trades…
                </div>
              ) : (
                <div className="space-y-0">
                  {liveTrades.map((trade) => {
                    const isYes = trade.choiceIndex === 0;
                    return (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-fade-in"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            isYes ? 'bg-positive' : 'bg-negative'
                          )} />
                          <span className="text-sm text-text-secondary">
                            <span className={cn('font-semibold', isYes ? 'text-positive' : 'text-negative')}>
                              {trade.optionName.toUpperCase()}
                            </span>
                            {' '}
                            <span className="text-text-tertiary text-xs">{trade.type}</span>
                            {' '}
                            <span className="text-white font-medium">
                              {formatCurrency(trade.amountUsdt)} USDT
                            </span>
                          </span>
                        </div>
                        <span className="text-xs text-text-tertiary font-mono">
                          {trade.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Trade Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TradeWidget
                marketId={market.id}
                yesPrice={displayYes}
                noPrice={displayNo}
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
