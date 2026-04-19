import { Rain } from '@buidlrrr/rain-sdk';
import { Market, MarketCategory, MarketStatus } from '@/types/market';

type RainEnvironment = 'development' | 'stage' | 'production';

// Raw shape from the Rain REST API
type ApiPool = {
  id?: string;
  _id?: string;
  title?: string;
  question?: string;
  marketQuestion?: string;
  description?: string;
  marketDescription?: string;
  status?: string;
  totalVolume?: string | number;
  contractAddress?: string;
  endTime?: string | number;
  startTime?: string | number;
  options?: ApiOption[];
  choices?: ApiOption[];
  [key: string]: unknown;
};

type ApiOption = {
  choiceIndex?: number;
  optionName?: string;
  currentPrice?: string | number;
  totalFunds?: string | number;
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
  if (/bitcoin|ethereum|btc|eth|sol|crypto|token|defi|nft/.test(t)) return 'crypto';
  if (/nba|nfl|mlb|nhl|formula|championship|match|game|sport|football|soccer|tennis|golf/.test(t)) return 'sports';
  if (/election|president|congress|government|vote|senate|democrat|republican|political/.test(t)) return 'politics';
  if (/market cap|etf|stock|nasdaq|s&p|fed|interest rate|bond|gdp/.test(t)) return 'finance';
  if (/apple|openai|chatgpt|ai model|launch|tech|startup|software|hardware/.test(t)) return 'science-tech';
  return 'other';
}

function mapStatus(raw: string | undefined): MarketStatus {
  if (!raw) return 'live';
  const s = raw.toLowerCase();
  if (/live|trading|closingsoon/.test(s)) return 'live';
  if (/new/.test(s)) return 'upcoming';
  if (/closed|result|review|evaluation|finalized|appeal|dispute/.test(s)) return 'resolved';
  return 'live';
}

// currentPrice is in 1e18 (e.g. 650000000000000000n = 65%)
function priceToPercent(raw: string | number | undefined): number {
  if (raw === undefined || raw === null || raw === '') return 0;
  try {
    const n = BigInt(String(raw).split('.')[0]); // drop any decimals
    return Number((n * BigInt(10000)) / BigInt('1000000000000000000')) / 100;
  } catch {
    return 0;
  }
}

function toUSDT(raw: string | number | undefined, decimals = 6): number {
  if (!raw) return 0;
  try {
    return Number(BigInt(String(raw).split('.')[0])) / 10 ** decimals;
  } catch {
    return 0;
  }
}

function parseTime(raw: string | number | undefined): Date {
  if (!raw) return new Date();
  const n = Number(raw);
  if (!Number.isFinite(n)) return new Date();
  // seconds → ms heuristic
  return new Date(n > 1e12 ? n : n * 1000);
}

// Unwrap the Rain API response — some endpoints return { data: { ... } }, others return the object directly
function unwrap(raw: unknown): ApiPool {
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    if (r.data && typeof r.data === 'object') return r.data as ApiPool;
    return r as ApiPool;
  }
  return {};
}

function extractTitle(pool: ApiPool): string {
  return (
    String(pool.title ?? pool.question ?? pool.marketQuestion ?? '').trim() || 'Untitled Market'
  );
}

function mapPool(pool: ApiPool, id: string, volumeOverride?: string): Market {
  const opts: ApiOption[] = pool.options ?? pool.choices ?? [];
  const title = extractTitle(pool);

  let yesPrice = 50;
  let noPrice = 50;

  if (opts.length >= 2) {
    const y = priceToPercent(opts[0]?.currentPrice);
    const n = priceToPercent(opts[1]?.currentPrice);
    if (y > 0) { yesPrice = y; noPrice = n > 0 ? n : 100 - y; }
  } else if (opts.length === 1) {
    const y = priceToPercent(opts[0]?.currentPrice);
    if (y > 0) { yesPrice = y; noPrice = 100 - y; }
  }

  const liquidity = toUSDT(opts[0]?.totalFunds);
  const volume = Number(volumeOverride ?? pool.totalVolume ?? 0);

  return {
    id,
    title,
    description: String(pool.description ?? pool.marketDescription ?? 'Live prediction market powered by Rain Protocol.'),
    category: inferCategory(title),
    status: mapStatus(String(pool.status ?? 'Live')),
    yesPrice,
    noPrice,
    liquidity: Number.isFinite(liquidity) ? liquidity : 0,
    volume: Number.isFinite(volume) ? volume : 0,
    totalTraders: 0,
    createdAt: parseTime(pool.startTime as string | number | undefined),
    closesAt: pool.endTime
      ? parseTime(pool.endTime as string | number | undefined)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    resolutionCriteria: 'Resolved according to official market outcome rules on Rain Protocol.',
  };
}

export async function fetchRainMarkets(limit = 24, offset = 0): Promise<Market[]> {
  const rain = getRainClient();

  // getPublicMarkets returns Market[] with { id, title, totalVolume, status, contractAddress }
  // The title field comes directly from the API listing endpoint.
  const list = await rain.getPublicMarkets({ limit, offset, sortBy: 'Liquidity', status: 'Live' });

  // Enrich each market with full details (options/prices) via getMarketById
  const results = await Promise.allSettled(
    list.map(async (m) => {
      try {
        // getMarketById returns the raw HTTP JSON — unwrap { data: {...} } if needed
        const raw = await rain.getMarketById({ marketId: m.id });
        const pool = unwrap(raw);
        return mapPool(pool, m.id, m.totalVolume);
      } catch {
        // Fallback: just use the listing data (title, status, volume)
        const pool = unwrap(m as unknown);
        return mapPool(pool, m.id, m.totalVolume);
      }
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<Market> => r.status === 'fulfilled')
    .map((r) => r.value);
}

export async function fetchRainMarketById(marketId: string): Promise<Market | null> {
  const rain = getRainClient();
  try {
    const raw = await rain.getMarketById({ marketId });
    const pool = unwrap(raw);
    return mapPool(pool, marketId);
  } catch {
    return null;
  }
}
