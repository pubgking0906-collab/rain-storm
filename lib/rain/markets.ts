import { Rain } from '@buidlrrr/rain-sdk';
import { Market, MarketCategory, MarketStatus } from '@/types/market';

type RainEnvironment = 'development' | 'stage' | 'production';

function getEnvironment(): RainEnvironment {
  const env = process.env.RAIN_ENVIRONMENT ?? process.env.NEXT_PUBLIC_RAIN_ENVIRONMENT ?? 'production';
  if (env === 'development' || env === 'stage' || env === 'production') {
    return env;
  }
  return 'production';
}

function getRainClient(): Rain {
  return new Rain({ environment: getEnvironment() });
}

function inferCategory(title: string): MarketCategory {
  const normalized = title.toLowerCase();
  if (normalized.includes('bitcoin') || normalized.includes('ethereum') || normalized.includes('crypto')) return 'crypto';
  if (normalized.includes('nba') || normalized.includes('formula') || normalized.includes('championship')) return 'sports';
  if (normalized.includes('federal reserve') || normalized.includes('election') || normalized.includes('government')) return 'politics';
  if (normalized.includes('market cap') || normalized.includes('sales') || normalized.includes('etf')) return 'finance';
  if (normalized.includes('apple') || normalized.includes('ai') || normalized.includes('chatgpt')) return 'science-tech';
  return 'other';
}

function mapMarketStatus(status: string): MarketStatus {
  const normalized = status.toLowerCase();
  if (normalized.includes('live') || normalized.includes('trading') || normalized.includes('closingsoon')) return 'live';
  if (normalized.includes('new')) return 'upcoming';
  if (normalized.includes('closed') || normalized.includes('result') || normalized.includes('review') || normalized.includes('evaluation')) return 'resolved';
  return 'upcoming';
}

function bigIntPriceToPercent(value: bigint): number {
  return Number((value * BigInt(10000)) / BigInt('1000000000000000000')) / 100;
}

function bigIntTokenToNumber(value: bigint, decimals = 6): number {
  const divisor = 10 ** decimals;
  return Number(value) / divisor;
}

function parseVolume(totalVolume: string | undefined): number {
  if (!totalVolume) return 0;
  const parsed = Number(totalVolume);
  return Number.isFinite(parsed) ? parsed : 0;
}

type RawMarketDetails = {
  title?: string;
  marketQuestion?: string;
  description?: string;
  marketDescription?: string;
  status?: string;
  options?: Array<{ currentPrice?: bigint; optionName?: string }>;
  totalLiquidity?: bigint;
  allFunds?: bigint;
  startTime?: bigint;
  endTime?: bigint;
};

async function mapPublicMarketToAppMarket(rain: Rain, publicMarket: { id: string; title?: string; totalVolume?: string; status?: string }): Promise<Market> {
  let details: RawMarketDetails | null = null;
  try {
    details = (await rain.getMarketDetails(publicMarket.id)) as RawMarketDetails;
  } catch {
    details = null;
  }

  const options = details?.options ?? [];
  const yesPrice = options[0]?.currentPrice ? bigIntPriceToPercent(options[0].currentPrice) : 50;
  const noPrice = options[1]?.currentPrice ? bigIntPriceToPercent(options[1].currentPrice) : Math.max(0, 100 - yesPrice);
  const createdAt = details?.startTime ? new Date(Number(details.startTime) * 1000) : new Date();
  const closesAt = details?.endTime ? new Date(Number(details.endTime) * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const title = details?.title ?? details?.marketQuestion ?? publicMarket.title ?? 'Untitled Market';
  const description = details?.description ?? details?.marketDescription ?? 'Live prediction market powered by Rain Protocol.';

  return {
    id: publicMarket.id,
    title,
    description,
    category: inferCategory(title),
    status: mapMarketStatus(details?.status ?? publicMarket.status ?? 'Live'),
    yesPrice,
    noPrice,
    liquidity: bigIntTokenToNumber(details?.totalLiquidity ?? details?.allFunds ?? BigInt(0)),
    volume: parseVolume(publicMarket.totalVolume),
    totalTraders: 0,
    createdAt,
    closesAt,
    resolutionCriteria: 'Resolved according to official market outcome rules on Rain Protocol.',
  };
}

export async function fetchRainMarkets(limit = 24, offset = 0): Promise<Market[]> {
  const rain = getRainClient();
  const publicMarkets = await rain.getPublicMarkets({ limit, offset, sortBy: 'Liquidity', status: 'Live' });
  return Promise.all(publicMarkets.map((market) => mapPublicMarketToAppMarket(rain, market)));
}

export async function fetchRainMarketById(marketId: string): Promise<Market | null> {
  const rain = getRainClient();
  try {
    const details = (await rain.getMarketDetails(marketId)) as RawMarketDetails;
    const options = details.options ?? [];
    const yesPrice = options[0]?.currentPrice ? bigIntPriceToPercent(options[0].currentPrice) : 50;
    const noPrice = options[1]?.currentPrice ? bigIntPriceToPercent(options[1].currentPrice) : Math.max(0, 100 - yesPrice);
    const title = details.title ?? details.marketQuestion ?? 'Untitled Market';

    return {
      id: marketId,
      title,
      description: details.description ?? details.marketDescription ?? 'Live prediction market powered by Rain Protocol.',
      category: inferCategory(title),
      status: mapMarketStatus(details.status ?? 'Live'),
      yesPrice,
      noPrice,
      liquidity: bigIntTokenToNumber(details.totalLiquidity ?? details.allFunds ?? BigInt(0)),
      volume: 0,
      totalTraders: 0,
      createdAt: details.startTime ? new Date(Number(details.startTime) * 1000) : new Date(),
      closesAt: details.endTime ? new Date(Number(details.endTime) * 1000) : new Date(),
      resolutionCriteria: 'Resolved according to official market outcome rules on Rain Protocol.',
    };
  } catch {
    return null;
  }
}
