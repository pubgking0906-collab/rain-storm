import { NextResponse } from 'next/server';
import { fetchRainMarkets } from '@/lib/rain/markets';
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') ?? '24');
  const offset = Number(searchParams.get('offset') ?? '0');

  try {
    const markets = await fetchRainMarkets(limit, offset);
    return NextResponse.json({ markets: markets.map(serializeMarket) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch markets';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
