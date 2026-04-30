import { http, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!;

export const wcConnector = walletConnect({
  projectId,
  showQrModal: true,
  metadata: {
    name: 'XRain',
    description: 'Prediction markets on Arbitrum',
    url: 'https://xrain.ai',
    icons: ['https://xrain.ai/favicon.ico'],
  },
});

export const injectedConnector = injected();

export const wagmiConfig = createConfig({
  chains: [arbitrum],
  connectors: [wcConnector, injectedConnector],
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
});
