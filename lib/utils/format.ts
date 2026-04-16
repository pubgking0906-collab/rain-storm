/**
 * Format a number as USD currency
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format wallet address (0x1a2b...3c4d)
 */
export function formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars + 2)}...${address.slice(-endChars)}`;
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatNumber(value: number, decimals: number = 1): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

/**
 * Format date relative to now (e.g., "2 days left", "Closed 5h ago")
 */
export function formatTimeRemaining(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);
  
  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return isPast ? `Closed ${days}d ago` : `${days}d left`;
  }
  if (hours > 0) {
    return isPast ? `Closed ${hours}h ago` : `${hours}h left`;
  }
  if (minutes > 0) {
    return isPast ? `Closed ${minutes}m ago` : `${minutes}m left`;
  }
  return isPast ? 'Just closed' : 'Closing soon';
}

/**
 * Format date as readable string (e.g., "Apr 12, 2026")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date with time (e.g., "Apr 12, 2026 14:30")
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate P&L color class
 */
export function getPnLColor(pnl: number): string {
  if (pnl > 0) return 'text-positive';
  if (pnl < 0) return 'text-negative';
  return 'text-text-secondary';
}

/**
 * Format P&L with + or - sign
 */
export function formatPnL(pnl: number, decimals: number = 2): string {
  const sign = pnl > 0 ? '+' : '';
  return `${sign}${formatCurrency(pnl, decimals)}`;
}

/**
 * Format P&L percentage with + or - sign
 */
export function formatPnLPercentage(pnl: number, decimals: number = 1): string {
  const sign = pnl > 0 ? '+' : '';
  return `${sign}${formatPercentage(pnl, decimals)}`;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'live':
      return 'text-status-live border-status-live bg-positive-bg';
    case 'upcoming':
      return 'text-status-upcoming border-status-upcoming bg-warning-bg';
    case 'resolved':
      return 'text-status-resolved border-status-resolved bg-border';
    case 'cancelled':
      return 'text-status-cancelled border-status-cancelled bg-negative-bg';
    default:
      return 'text-text-secondary border-border bg-border';
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate shares from amount and price
 */
export function calculateShares(amount: number, price: number): number {
  if (price === 0) return 0;
  return amount / price;
}

/**
 * Calculate payout from shares
 */
export function calculatePayout(shares: number): number {
  return shares * 1; // Each share pays $1 if correct
}

/**
 * Calculate profit and percentage
 */
export function calculateProfit(shares: number, invested: number): { profit: number; percentage: number } {
  const payout = calculatePayout(shares);
  const profit = payout - invested;
  const percentage = invested > 0 ? (profit / invested) * 100 : 0;
  return { profit, percentage };
}
