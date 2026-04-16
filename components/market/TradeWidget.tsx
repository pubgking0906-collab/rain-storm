'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatPercentage, calculateShares, calculateProfit, formatAddress } from '@/lib/utils/format';

interface TradeWidgetProps {
  marketId: string;
  yesPrice: number;
  noPrice: number;
  userBalance?: number;
  walletAddress?: string;
  onTrade?: (action: 'buy' | 'sell', position: 'yes' | 'no', amount: number) => Promise<void>;
  isConnected?: boolean;
}

export function TradeWidget({
  yesPrice,
  noPrice,
  userBalance = 1000,
  walletAddress,
  onTrade,
  isConnected = false,
}: TradeWidgetProps) {
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [position, setPosition] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = position === 'yes' ? yesPrice / 100 : noPrice / 100;

  const estimate = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    const shares = calculateShares(amountNum, currentPrice);
    const fees = amountNum * 0.015; // 1.5% fee
    const total = amountNum + fees;
    const { profit, percentage } = calculateProfit(shares, amountNum);

    return {
      shares,
      avgPrice: currentPrice,
      fees,
      total,
      potentialPayout: shares * 1, // $1 per share if correct
      potentialProfit: profit,
      potentialProfitPercentage: percentage,
    };
  }, [amount, currentPrice]);

  const handleMaxClick = () => {
    setAmount(userBalance.toString());
  };

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (!isConnected) return;

    setIsLoading(true);
    try {
      await onTrade?.(action, position, parseFloat(amount));
      setAmount('');
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canTrade = isConnected && amount && parseFloat(amount) > 0 && parseFloat(amount) <= userBalance;

  return (
    <div className="bg-background-card border border-border rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
        <h3 className="text-xl font-semibold text-white">Trade</h3>
        {isConnected && walletAddress && (
          <span className="text-xs text-text-secondary font-mono">{formatAddress(walletAddress)}</span>
        )}
      </div>

      {/* Action Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAction('buy')}
          className={cn(
            'flex-1 py-2.5 rounded-lg font-semibold transition-smooth',
            action === 'buy'
              ? 'bg-gradient-primary text-white'
              : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/8'
          )}
        >
          Buy
        </button>
        <button
          onClick={() => setAction('sell')}
          className={cn(
            'flex-1 py-2.5 rounded-lg font-semibold transition-smooth',
            action === 'sell'
              ? 'bg-gradient-primary text-white'
              : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/8'
          )}
        >
          Sell
        </button>
      </div>

      {/* Position Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-3">Position</label>
        <div className="grid grid-cols-2 gap-3">
          {/* YES */}
          <button
            onClick={() => setPosition('yes')}
            className={cn(
              'p-4 rounded-lg border-2 transition-smooth',
              position === 'yes'
                ? 'border-positive bg-positive-bg'
                : 'border-border bg-white/5 hover:border-border-hover'
            )}
          >
            <div className="text-xs font-medium text-text-secondary mb-1">YES</div>
            <div className="text-2xl font-bold text-positive">{formatPercentage(yesPrice)}</div>
          </button>

          {/* NO */}
          <button
            onClick={() => setPosition('no')}
            className={cn(
              'p-4 rounded-lg border-2 transition-smooth',
              position === 'no'
                ? 'border-negative bg-negative-bg'
                : 'border-border bg-white/5 hover:border-border-hover'
            )}
          >
            <div className="text-xs font-medium text-text-secondary mb-1">NO</div>
            <div className="text-2xl font-bold text-negative">{formatPercentage(noPrice)}</div>
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-3">
          Amount (USDC)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 pr-20 bg-background-input border border-border rounded-lg text-white placeholder-text-secondary focus:border-border-focus focus:outline-none transition-smooth"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
            USDC
          </span>
        </div>
        {isConnected && (
          <button
            onClick={handleMaxClick}
            className="mt-2 text-xs text-primary hover:text-primary-hover transition-fast"
          >
            ▸ Max: {formatCurrency(userBalance)} USDC
          </button>
        )}
      </div>

      {/* Slippage */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Slippage: {slippage}%</span>
        </div>
      </div>

      {/* Summary */}
      {amount && parseFloat(amount) > 0 && (
        <div className="mb-6 py-4 border-y border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Estimated Shares</span>
            <span className="text-white font-medium">~{estimate.shares.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Avg Price</span>
            <span className="text-white font-medium">{formatCurrency(estimate.avgPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Fees (1.5%)</span>
            <span className="text-white font-medium">{formatCurrency(estimate.fees)}</span>
          </div>
        </div>
      )}

      {/* Trade Button */}
      {!isConnected ? (
        <Button fullWidth size="lg" disabled>
          Connect Wallet to Trade
        </Button>
      ) : (
        <Button
          fullWidth
          size="lg"
          onClick={handleTrade}
          isLoading={isLoading}
          disabled={!canTrade}
        >
          {!amount || parseFloat(amount) <= 0
            ? 'Enter Amount'
            : parseFloat(amount) > userBalance
            ? 'Insufficient Balance'
            : `${action === 'buy' ? 'Buy' : 'Sell'} ${position.toUpperCase()} for ${formatCurrency(estimate.total)}`}
        </Button>
      )}

      {/* Potential Outcome */}
      {amount && parseFloat(amount) > 0 && action === 'buy' && (
        <div className="mt-4 p-4 bg-positive-bg border border-positive/20 rounded-lg space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Potential Payout:</span>
            <span className="text-white font-semibold">{formatCurrency(estimate.potentialPayout)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Potential Profit:</span>
            <span className="text-positive font-semibold">
              {formatCurrency(estimate.potentialProfit)} ({estimate.potentialProfitPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
