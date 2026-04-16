import { Position, Trade } from '@/types/market';
import { mockMarkets } from './mockMarkets';

export const mockPositions: Position[] = [
  {
    id: 'pos-1',
    marketId: '1',
    market: mockMarkets[0], // Bitcoin $100k
    position: 'yes',
    shares: 150,
    entryPrice: 0.60,
    currentPrice: 0.65,
    investedAmount: 90,
    currentValue: 97.5,
    pnl: 7.5,
    pnlPercentage: 8.33,
    entryDate: new Date('2026-04-05'),
  },
  {
    id: 'pos-2',
    marketId: '3',
    market: mockMarkets[2], // Fed rate cut
    position: 'yes',
    shares: 200,
    entryPrice: 0.75,
    currentPrice: 0.78,
    investedAmount: 150,
    currentValue: 156,
    pnl: 6,
    pnlPercentage: 4.0,
    entryDate: new Date('2026-04-02'),
  },
  {
    id: 'pos-3',
    marketId: '6',
    market: mockMarkets[5], // AI company $3T
    position: 'no',
    shares: 120,
    entryPrice: 0.55,
    currentPrice: 0.52,
    investedAmount: 66,
    currentValue: 62.4,
    pnl: -3.6,
    pnlPercentage: -5.45,
    entryDate: new Date('2026-04-10'),
  },
  {
    id: 'pos-4',
    marketId: '10',
    market: mockMarkets[9], // ChatGPT users
    position: 'yes',
    shares: 180,
    entryPrice: 0.58,
    currentPrice: 0.62,
    investedAmount: 104.4,
    currentValue: 111.6,
    pnl: 7.2,
    pnlPercentage: 6.90,
    entryDate: new Date('2026-04-08'),
  },
  {
    id: 'pos-5',
    marketId: '4',
    market: mockMarkets[3], // Ethereum $5k
    position: 'yes',
    shares: 100,
    entryPrice: 0.60,
    currentPrice: 0.55,
    investedAmount: 60,
    currentValue: 55,
    pnl: -5,
    pnlPercentage: -8.33,
    entryDate: new Date('2026-04-11'),
  },
];

export const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    marketId: '10',
    marketTitle: 'Will ChatGPT reach 500M weekly active users in 2026?',
    type: 'buy-yes',
    shares: 180,
    price: 0.58,
    total: 105.9, // includes fees
    timestamp: new Date('2026-04-08T14:30:00'),
    status: 'confirmed',
    txHash: '0xabcdef1234567890',
  },
  {
    id: 'trade-2',
    marketId: '4',
    marketTitle: 'Will Ethereum reach $5,000 by May 2026?',
    type: 'buy-yes',
    shares: 100,
    price: 0.60,
    total: 60.9,
    timestamp: new Date('2026-04-11T10:15:00'),
    status: 'confirmed',
    txHash: '0x1234567890abcdef',
  },
  {
    id: 'trade-3',
    marketId: '1',
    marketTitle: 'Will Bitcoin reach $100,000 by June 30, 2026?',
    type: 'buy-yes',
    shares: 150,
    price: 0.60,
    total: 91.35,
    timestamp: new Date('2026-04-05T16:45:00'),
    status: 'confirmed',
    txHash: '0xfedcba0987654321',
  },
  {
    id: 'trade-4',
    marketId: '3',
    marketTitle: 'Will the US Federal Reserve cut rates by June 2026?',
    type: 'buy-yes',
    shares: 200,
    price: 0.75,
    total: 152.25,
    timestamp: new Date('2026-04-02T09:20:00'),
    status: 'confirmed',
    txHash: '0x567890abcdef1234',
  },
  {
    id: 'trade-5',
    marketId: '6',
    marketTitle: 'Will a major AI company reach $3T market cap in 2026?',
    type: 'buy-no',
    shares: 120,
    price: 0.55,
    total: 66.99,
    timestamp: new Date('2026-04-10T11:30:00'),
    status: 'confirmed',
    txHash: '0x9876543210fedcba',
  },
];

export function getPositionsByUser(userId: string): Position[] {
  // In real app, filter by user
  return mockPositions;
}

export function getTradesByUser(userId: string): Trade[] {
  // In real app, filter by user
  return mockTrades;
}
