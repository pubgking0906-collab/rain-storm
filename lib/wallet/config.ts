import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'XRain',
  projectId,
  chains: [arbitrum],
  ssr: true,
});
