import { Market } from '@/types/market';

type ApiMarket = Omit<Market, 'createdAt' | 'closesAt' | 'resolvedAt'> & {
  createdAt: string;
  closesAt: string;
  resolvedAt?: string;
};

function parseMarket(market: ApiMarket): Market {
  return {
    ...market,
    createdAt: new Date(market.createdAt),
    closesAt: new Date(market.closesAt),
    resolvedAt: market.resolvedAt ? new Date(market.resolvedAt) : undefined,
  };
}

export async function fetchMarketsFromApi(limit = 24): Promise<Market[]> {
  const response = await fetch(`/api/markets?limit=${limit}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }
  const data = (await response.json()) as { markets: ApiMarket[] };
  return data.markets.map(parseMarket);
}

export async function fetchMarketByIdFromApi(id: string): Promise<Market | null> {
  const response = await fetch(`/api/markets/${id}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error('Failed to fetch market');
  }
  const data = (await response.json()) as { market: ApiMarket };
  return parseMarket(data.market);
}
