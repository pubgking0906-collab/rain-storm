import {
  connectorsForWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { arbitrum } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Connect with QR Code',
      wallets: [walletConnectWallet, metaMaskWallet, trustWallet],
    },
    {
      groupName: 'Browser Extension',
      wallets: [rainbowWallet, coinbaseWallet],
    },
  ],
  { appName: 'XRain', projectId }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
});
