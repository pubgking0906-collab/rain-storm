import { NextResponse } from 'next/server';
import { fetchRainMarketById } from '@/lib/rain/markets';
import { Market } from '@/types/market';

type MarketResponse = Omit<Market, 'createdAt' | 'closesAt' | 'resolvedAt'> & {
  createdAt: string;
  closesAt: string;
  resolvedAt?: string;
};

function serializeMarket(market: Market): MarketResponse {
  return {
    ...market,
    createdAt: market.createdAt.toISOString(),
    closesAt: market.closesAt.toISOString(),
    resolvedAt: market.resolvedAt?.toISOString(),
  };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const market = await fetchRainMarketById(id);
    if (!market) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }
    return NextResponse.json({ market: serializeMarket(market) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch market';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
