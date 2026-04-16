import React from 'react';
import Link from 'next/link';
import { Market } from '@/types/market';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatTimeRemaining, getStatusColor, formatPercentage } from '@/lib/utils/format';

interface MarketCardProps {
  market: Market;
  className?: string;
}

export function MarketCard({ market, className }: MarketCardProps) {
  const statusColors = getStatusColor(market.status);

  return (
    <Link href={`/market/${market.id}`}>
      <div
        className={cn(
          'group relative min-h-[240px] rounded-2xl border border-border bg-background-card/90 p-6',
          'hover:-translate-y-1 hover:border-primary/35 hover:bg-background-card-hover hover:shadow-lg',
          'transition-smooth cursor-pointer',
          className
        )}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          {/* Status Badge */}
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
              statusColors
            )}
          >
            {market.status}
          </span>

          {/* Time Remaining */}
          {market.status === 'live' && (
            <span className="text-xs font-medium text-text-secondary">
              {formatTimeRemaining(market.closesAt)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-xl font-semibold leading-tight text-white transition-smooth group-hover:text-primary">
          {market.title}
        </h3>

        {/* Description */}
        <p className="mb-5 line-clamp-1 text-sm text-text-secondary">
          {market.description}
        </p>

        {/* Probabilities */}
        <div className="mb-5 flex gap-3">
          {/* YES */}
          <div className="flex-1 rounded-xl border border-positive/25 bg-positive-bg px-3 py-2.5">
            <div className="mb-0.5 text-xs font-medium text-text-secondary">YES</div>
            <div className="text-xl font-bold text-positive">{formatPercentage(market.yesPrice)}</div>
          </div>

          {/* NO */}
          <div className="flex-1 rounded-xl border border-negative/25 bg-negative-bg px-3 py-2.5">
            <div className="mb-0.5 text-xs font-medium text-text-secondary">NO</div>
            <div className="text-xl font-bold text-negative">{formatPercentage(market.noPrice)}</div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span>Liquidity: {formatCurrency(market.liquidity)}</span>
          </div>

          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span>Vol: {formatCurrency(market.volume)}</span>
          </div>
        </div>

        {/* Category Tag */}
        <div className="absolute right-5 top-5 opacity-0 transition-smooth group-hover:opacity-100">
          <span className="rounded-md bg-background-elevated px-2 py-1 text-xs font-medium text-text-secondary">
            {market.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
