'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { QRCodeSVG } from 'qrcode.react';
import { injectedConnector } from '@/lib/wallet/config';

const PROJECT_ID = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!;

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'menu' | 'qr';

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const { connect } = useConnect();
  const { isConnected } = useAccount();
  const [hasInjected, setHasInjected] = useState(false);
  const [wcUri, setWcUri] = useState<string | null>(null);
  const [view, setView] = useState<View>('menu');
  const [wcLoading, setWcLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wcProviderRef = useRef<any>(null);

  useEffect(() => {
    setHasInjected(typeof window !== 'undefined' && !!(window as any).ethereum);
  }, []);

  useEffect(() => {
    if (isConnected) {
      setWcUri(null);
      setView('menu');
      onClose();
    }
  }, [isConnected, onClose]);

  // Clean up WC provider when modal closes
  useEffect(() => {
    if (!isOpen && wcProviderRef.current) {
      wcProviderRef.current.disconnect?.().catch(() => {});
      wcProviderRef.current = null;
      setWcUri(null);
      setWcLoading(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setError(null);
    setView('menu');
    onClose();
  };

  const startWalletConnect = useCallback(async () => {
    setView('qr');
    setWcUri(null);
    setWcLoading(true);
    setError(null);

    try {
      // Use @walletconnect/ethereum-provider directly — wagmi connector
      // does not reliably emit display_uri in all environments.
      const mod = await import('@walletconnect/ethereum-provider');
      const EthereumProvider = (mod as any).EthereumProvider ?? (mod as any).default;

      const provider = await EthereumProvider.init({
        projectId: PROJECT_ID,
        chains: [42161],
        showQrModal: false,
        metadata: {
          name: 'XRain',
          description: 'Prediction markets on Arbitrum',
          url: 'https://xrain.ai',
          icons: ['https://xrain.ai/favicon.ico'],
        },
      });

      wcProviderRef.current = provider;

      provider.on('display_uri', (uri: string) => {
        setWcUri(uri);
        setWcLoading(false);
      });

      provider.on('disconnect', () => {
        wcProviderRef.current = null;
        setWcUri(null);
        setView('menu');
      });

      // connect() resolves once user approves in their wallet
      provider.connect().then(() => {
        // Inject the WC provider as window.ethereum so wagmi injected
        // connector can pick it up transparently.
        (window as any).ethereum = provider;
        connect({ connector: injectedConnector });
      }).catch((err: any) => {
        if (err?.message?.includes('User rejected')) {
          setError('Connection rejected by user');
        } else if (err?.message) {
          setError(err.message);
        }
        setView('menu');
      });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to start WalletConnect');
      setView('menu');
      setWcLoading(false);
    }
  }, [connect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {view === 'qr' && (
              <button
                onClick={() => { setView('menu'); setWcUri(null); }}
                className="text-white/40 hover:text-white mr-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className="text-xl font-bold text-white">
              {view === 'qr' ? 'Scan QR Code' : 'Connect Wallet'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* QR View */}
        {view === 'qr' && (
          <div className="flex flex-col items-center">
            {wcUri ? (
              <>
                <div className="p-4 bg-white rounded-2xl mb-4">
                  <QRCodeSVG value={wcUri} size={220} />
                </div>
                <p className="text-white/60 text-sm text-center mb-2">
                  Scan with MetaMask, Trust Wallet, or any WalletConnect-compatible wallet
                </p>
                <button
                  onClick={() => { navigator.clipboard?.writeText(wcUri); }}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors mt-1"
                >
                  Copy link
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="w-8 h-8 border-2 border-white/20 border-t-[#3B99FC] rounded-full animate-spin" />
                <p className="text-white/50 text-sm">Connecting to relay server…</p>
              </div>
            )}
          </div>
        )}

        {/* Menu View */}
        {view === 'menu' && (
          <div className="space-y-3">
            {/* WalletConnect */}
            <button
              onClick={startWalletConnect}
              disabled={wcLoading}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#3B99FC]/10 hover:bg-[#3B99FC]/20 border border-[#3B99FC]/30 hover:border-[#3B99FC]/50 transition-all disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-[#3B99FC] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
                  <path d="M8.19 14.43c6.52-6.38 17.1-6.38 23.62 0l.79.77a.81.81 0 010 1.16l-2.69 2.63a.43.43 0 01-.6 0l-1.08-1.06c-4.55-4.45-11.93-4.45-16.48 0l-1.16 1.13a.43.43 0 01-.6 0l-2.69-2.63a.81.81 0 010-1.16l.89-.84zm29.18 5.44l2.4 2.34a.81.81 0 010 1.16L28.2 34.5a.85.85 0 01-1.2 0l-7.99-7.82a.21.21 0 00-.3 0l-7.99 7.82a.85.85 0 01-1.2 0L.35 23.37a.81.81 0 010-1.16l2.4-2.34a.85.85 0 011.2 0l7.99 7.82c.08.08.22.08.3 0l7.99-7.82a.85.85 0 011.2 0l7.99 7.82c.08.08.22.08.3 0l7.99-7.82a.85.85 0 011.2 0z" fill="white"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">WalletConnect</div>
                <div className="text-[#3B99FC] text-xs font-medium">Scan QR — MetaMask, Trust & more</div>
              </div>
              <svg className="w-4 h-4 text-white/30 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* MetaMask / browser wallet */}
            <button
              onClick={() => hasInjected
                ? connect({ connector: injectedConnector })
                : startWalletConnect()
              }
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                className="w-10 h-10" alt="MetaMask"
              />
              <div className="text-left">
                <div className="text-white font-semibold">MetaMask</div>
                <div className="text-white/50 text-xs">
                  {hasInjected ? 'Browser extension' : 'Scan QR with MetaMask app'}
                </div>
              </div>
              <svg className="w-4 h-4 text-white/30 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
