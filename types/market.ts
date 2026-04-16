export type MarketStatus = 'live' | 'upcoming' | 'resolved' | 'cancelled';

export type MarketCategory = 
  | 'sports' 
  | 'crypto' 
  | 'politics' 
  | 'finance' 
  | 'entertainment' 
  | 'world-events' 
  | 'science-tech' 
  | 'other';

export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  
  // Probabilities (0-100)
  yesPrice: number;
  noPrice: number;
  
  // Financial data
  liquidity: number;
  volume: number;
  totalTraders: number;
  
  // Time
  createdAt: Date;
  closesAt: Date;
  resolvedAt?: Date;
  
  // Resolution
  resolutionCriteria: string;
  resolvedOutcome?: 'yes' | 'no';
  
  // Optional
  imageUrl?: string;
}

export interface PricePoint {
  timestamp: number;
  yesPrice: number;
  noPrice: number;
}

export interface MarketActivity {
  id: string;
  marketId: string;
  type: 'buy' | 'sell';
  position: 'yes' | 'no';
  shares: number;
  price: number;
  userAddress: string;
  timestamp: Date;
}

export interface Position {
  id: string;
  marketId: string;
  market: Market;
  position: 'yes' | 'no';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
  entryDate: Date;
}

export interface Trade {
  id: string;
  marketId: string;
  marketTitle: string;
  type: 'buy-yes' | 'buy-no' | 'sell-yes' | 'sell-no';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
  txHash?: string;
}

export interface UserBalance {
  total: number;
  available: number;
  locked: number;
}

export interface TradeRequest {
  marketId: string;
  action: 'buy' | 'sell';
  position: 'yes' | 'no';
  amount: number; // in USDC
  slippage: number; // percentage
}

export interface TradeEstimate {
  estimatedShares: number;
  avgPrice: number;
  fees: number;
  total: number;
  potentialPayout?: number;
  potentialProfit?: number;
  potentialProfitPercentage?: number;
}
