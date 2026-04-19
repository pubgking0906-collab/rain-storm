import { Rain } from '@buidlrrr/rain-sdk';
import { Market, MarketCategory, MarketStatus } from '@/types/market';

type RainEnvironment = 'development' | 'stage' | 'production';

// Raw pool shape returned by the Rain API (not the typed SDK wrapper)
type RawPool = {
  id?: string;
  _id?: string;
  title?: string;
  question?: string;          // API sometimes uses this instead of title
  name?: string;
  description?: string;
  status?: string;
  totalVolume?: string;
  contractAddress?: string;
  endTime?: string | number | bigint;
  startTime?: string | number | bigint;
  options?: Array<{
    choiceIndex?: number;
    optionName?: string;
    currentPrice?: string | number | bigint;
    totalFunds?: string | number | bigint;
  }>;
  choices?: Array<{
    choiceIndex?: number;
    optionName?: string;
    currentPrice?: string | number | bigint;
  }>;
  [key: string]: unknown;
};

function getEnvironment(): RainEnvironment {
  const env = process.env.RAIN_ENVIRONMENT ?? process.env.NEXT_PUBLIC_RAIN_ENVIRONMENT ?? 'production';
  if (env === 'development' || env === 'stage' || env === 'production') return env as RainEnvironment;
  return 'production';
}

function getRainClient(): Rain {
  return new Rain({ environment: getEnvironment() });
}

function inferCategory(title: string): MarketCategory {
  const t = title.toLowerCase();
  if (t.includes('bitcoin') || t.includes('ethereum') || t.includes('crypto') || t.includes('btc') || t.includes('eth') || t.includes('sol')) return 'crypto';
  if (t.includes('nba') || t.includes('nfl') || t.includes('mlb') || t.includes('formula') || t.includes('championship') || t.includes('match') || t.includes('game') || t.includes('sport')) return 'sports';
  if (t.includes('federal reserve') || t.includes('election') || t.includes('president') || t.includes('congress') || t.includes('government') || t.includes('vote')) return 'politics';
  if (t.includes('market cap') || t.includes('sales') || t.includes('etf') || t.includes('stock') || t.includes('fed') || t.includes('rate')) return 'finance';
  if (t.includes('apple') || t.includes('ai') || t.includes('chatgpt') || t.includes('openai') || t.includes('tech') || t.includes('launch')) return 'science-tech';
  return 'other';
}

function mapRainStatus(status: string | undefined): MarketStatus {
  if (!status) return 'live';
  const s = status.toLowerCase();
  if (s.includes('live') || s.includes('trading') || s.includes('closingsoon')) return 'live';
  if (s.includes('new')) return 'upcoming';
  if (s.includes('closed') || s.includes('result') || s.includes('review') || s.includes('evaluation') || s.includes('finalized')) return 'resolved';
  return 'live';
}

function safeNumber(val: string | number | bigint | undefined, decimals = 18): number {
  if (val === undefined || val === null) return 0;
  try {
    const n = typeof val === 'bigint' ? val : BigInt(String(val));
    return Number((n * BigInt(10000)) / BigInt(10 ** decimals)) / 100;
  } catch {
    return 0;
  }
}

function safeTokenAmount(val: string | number | bigint | undefined, decimals = 6): number {
  if (val === undefined || val === null) return 0;
  try {
    return Number(BigInt(String(val))) / 10 ** decimals;
  } catch {
    return 0;
  }
}

function parseTimestamp(val: string | number | bigint | undefined): Date {
  if (!val) return new Date();
  try {
    const n = Number(typeof val === 'bigint' ? val : BigInt(String(val)));
    // seconds vs milliseconds heuristic
    return new Date(n > 1e12 ? n : n * 1000);
  } catch {
    return new Date();
  }
}

function extractTitle(raw: RawPool): string {
  return String(raw.title ?? raw.question ?? raw.name ?? '').trim() || 'Untitled Market';
}

function mapRawPool(raw: RawPool, fallbackId?: string): Market {
  const id = String(raw.id ?? raw._id ?? fallbackId ?? '');
  const title = extractTitle(raw);
  const opts = raw.options ?? raw.choices ?? [];

  // Price comes from the chain-enriched currentPrice (bigint-like string).
  // The API also stores an initial price — use whichever is present.
  let yesPrice = 50;
  let noPrice = 50;

  if (opts.length >= 2) {
    const yRaw = opts[0]?.currentPrice;
    const nRaw = opts[1]?.currentPrice;
    if (yRaw !== undefined && Number(yRaw) > 0) {
      yesPrice = safeNumber(yRaw);
      noPrice  = safeNumber(nRaw ?? String(BigInt('1000000000000000000') - BigInt(String(yRaw))));
    }
  } else if (opts.length === 1) {
    const yRaw = opts[0]?.currentPrice;
    if (yRaw !== undefined && Number(yRaw) > 0) {
      yesPrice = safeNumber(yRaw);
      noPrice  = 100 - yesPrice;
    }
  }

  const liquidity = safeTokenAmount(
    raw.options?.[0]?.totalFunds ?? undefined
  );

  const volume = (() => {
    const v = Number(raw.totalVolume ?? 0);
    return Number.isFinite(v) ? v : 0;
  })();

  const closesAt = raw.endTime
    ? parseTimestamp(raw.endTime as string | number | bigint)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const createdAt = raw.startTime
    ? parseTimestamp(raw.startTime as string | number | bigint)
    : new Date();

  return {
    id,
    title,
    description: String(raw.description ?? 'Live prediction market powered by Rain Protocol.'),
    category: inferCategory(title),
    status: mapRainStatus(String(raw.status ?? 'Live')),
    yesPrice,
    noPrice,
    liquidity,
    volume,
    totalTraders: 0,
    createdAt,
    closesAt,
    resolutionCriteria: 'Resolved according to official market outcome rules on Rain Protocol.',
  };
}

export async function fetchRainMarkets(limit = 24, offset = 0): Promise<Market[]> {
  const rain = getRainClient();

  // Step 1: get the public market list (API call — fast)
  const publicMarkets = await rain.getPublicMarkets({ limit, offset, sortBy: 'Liquidity', status: 'Live' });

  // Step 2: enrich each with full API data via getMarketById (API call, no RPC)
  const settled = await Promise.allSettled(
    publicMarkets.map(async (m) => {
      try {
        const full = await rain.getMarketById({ marketId: m.id }) as unknown as RawPool;
        // getMarketById returns the raw API object; merge with public market's totalVolume
        const merged: RawPool = { ...full, totalVolume: m.totalVolume ?? full.totalVolume };
        return mapRawPool(merged, m.id);
      } catch {
        // Fallback: use what we got from the public list
        const raw = m as unknown as RawPool;
        return mapRawPool({ ...raw, totalVolume: m.totalVolume }, m.id);
      }
    })
  );

  return settled
    .filter((r): r is PromiseFulfilledResult<Market> => r.status === 'fulfilled')
    .map((r) => r.value);
}

export async function fetchRainMarketById(marketId: string): Promise<Market | null> {
  const rain = getRainClient();
  try {
    const raw = await rain.getMarketById({ marketId }) as unknown as RawPool;
    return mapRawPool(raw, marketId);
  } catch {
    return null;
  }
}
