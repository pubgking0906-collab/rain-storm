import React from 'react';
import Link from 'next/link';
import { Position } from '@/types/market';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatPnL, formatPnLPercentage, getPnLColor, formatPercentage } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';

interface PositionCardProps {
  position: Position;
  onSell?: (positionId: string) => void;
}

export function PositionCard({ position, onSell }: PositionCardProps) {
  const pnlColor = getPnLColor(position.pnl);
  const isWinning = position.pnl > 0;

  return (
    <div className={cn(
      'bg-background-card border rounded-xl p-5 hover:border-border-hover transition-smooth',
      isWinning ? 'border-positive/20' : 'border-negative/20'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/market/${position.marketId}`}>
            <h3 className="text-lg font-semibold text-white hover:text-primary transition-fast line-clamp-2 mb-2">
              {position.market.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3">
            <span className={cn(
              'px-2 py-1 text-xs font-semibold uppercase rounded-full',
              position.position === 'yes'
                ? 'bg-positive-bg text-positive border border-positive/20'
                : 'bg-negative-bg text-negative border border-negative/20'
            )}>
              {position.position}
            </span>
            <span className="text-sm text-text-secondary">
              {position.shares.toFixed(2)} shares
            </span>
          </div>
        </div>
      </div>

      {/* Price Movement */}
      <div className="flex items-center gap-3 mb-4 text-sm">
        <span className="text-text-secondary">Entry:</span>
        <span className="text-white font-medium">{formatCurrency(position.entryPrice)}</span>
        <span className="text-text-tertiary">→</span>
        <span className="text-text-secondary">Current:</span>
        <span className="text-white font-medium">{formatCurrency(position.currentPrice)}</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border mb-4">
        <div>
          <div className="text-xs text-text-secondary mb-1">Invested</div>
          <div className="text-sm font-semibold text-white">{formatCurrency(position.investedAmount)}</div>
        </div>
        <div>
          <div className="text-xs text-text-secondary mb-1">Current Value</div>
          <div className="text-sm font-semibold text-white">{formatCurrency(position.currentValue)}</div>
        </div>
        <div>
          <div className="text-xs text-text-secondary mb-1">P&L</div>
          <div className={cn('text-sm font-semibold', pnlColor)}>
            {formatPnL(position.pnl)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={cn('text-xl font-bold', pnlColor)}>
          {formatPnLPercentage(position.pnlPercentage)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSell?.(position.id)}
        >
          Sell Position
        </Button>
      </div>
    </div>
  );
}
