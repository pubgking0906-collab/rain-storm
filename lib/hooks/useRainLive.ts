'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { RainSocket, EnterOptionEventData, OrderEventData } from '@buidlrrr/rain-sdk';

export type LiveTrade = {
  id: string;
  optionName: string;   // 'Yes' | 'No' | custom
  choiceIndex: number;  // 0 = YES, 1 = NO
  amountUsdt: number;   // USDT amount (raw / 10^decimals)
  type: 'buy' | 'order';
  timestamp: Date;
};

type UseRainLiveOptions = {
  marketId: string;
  /** Max trades to keep in the feed */
  maxItems?: number;
};

type UseRainLiveReturn = {
  trades: LiveTrade[];
  connected: boolean;
  lastTradeAt: Date | null;
};

function getEnvironment(): 'development' | 'stage' | 'production' {
  const env = process.env.NEXT_PUBLIC_RAIN_ENVIRONMENT ?? 'production';
  if (env === 'development' || env === 'stage' || env === 'production') return env;
  return 'production';
}

let sharedSocket: RainSocket | null = null;
let socketRefCount = 0;

function getSharedSocket(): RainSocket {
  if (!sharedSocket) {
    sharedSocket = new RainSocket({ environment: getEnvironment() });
  }
  return sharedSocket;
}

export function useRainLive({ marketId, maxItems = 20 }: UseRainLiveOptions): UseRainLiveReturn {
  const [trades, setTrades] = useState<LiveTrade[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastTradeAt, setLastTradeAt] = useState<Date | null>(null);
  const counterRef = useRef(0);

  const addTrade = useCallback((trade: Omit<LiveTrade, 'id'>) => {
    const id = `${Date.now()}-${++counterRef.current}`;
    setTrades((prev) => [{ ...trade, id }, ...prev].slice(0, maxItems));
    setLastTradeAt(new Date());
  }, [maxItems]);

  useEffect(() => {
    if (!marketId) return;

    const socket = getSharedSocket();
    socketRefCount++;

    socket.onConnect(() => setConnected(true));
    socket.onDisconnect(() => setConnected(false));

    // Listen for market buys
    const unsubEnter = socket.onEnterOption(marketId, (data: EnterOptionEventData) => {
      const decimals = data.tokenDecimals ?? 6;
      for (const inv of data.investments) {
        const amount = Number(inv.amount) / 10 ** decimals;
        if (amount <= 0) continue;
        addTrade({
          optionName: inv.optionName ?? (inv.choiceIndex === 0 ? 'Yes' : 'No'),
          choiceIndex: inv.choiceIndex,
          amountUsdt: amount,
          type: 'buy',
          timestamp: new Date(),
        });
      }
    });

    // Listen for limit orders
    const unsubOrder = socket.onOrderCreated(marketId, (data: OrderEventData) => {
      const decimals = data.tokenDecimals ?? 6;
      const amount = Number(data.order.quantity) / 10 ** decimals;
      if (amount <= 0) return;
      addTrade({
        optionName: data.order.optionName ?? (data.order.option === 0 ? 'Yes' : 'No'),
        choiceIndex: data.order.option,
        amountUsdt: amount,
        type: 'order',
        timestamp: new Date(),
      });
    });

    return () => {
      unsubEnter();
      unsubOrder();
      socketRefCount--;
      if (socketRefCount === 0) {
        sharedSocket?.disconnect();
        sharedSocket = null;
      }
    };
  }, [marketId, addTrade]);

  return { trades, connected, lastTradeAt };
}
