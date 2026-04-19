'use client';

import { ReactNode, useEffect } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider, type Config } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { arbitrum } from '@reown/appkit/networks';
import { wagmiAdapter, projectId } from '@/lib/wallet/config';

const queryClient = new QueryClient();

createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId!,
  networks: [arbitrum],
  defaultNetwork: arbitrum,
  metadata: {
    name: 'XRain',
    description: 'The blockchain-native prediction market powered by Rain Protocol',
    url: 'https://xrain.ai',
    icons: ['https://xrain.ai/favicon.ico'],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7B73FF',
    '--w3m-border-radius-master': '12px',
  },
});

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={undefined}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
