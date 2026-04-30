'use client';

import { useEffect, useRef, useState } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { formatAddress } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const { connect, isPending, error } = useConnect();
  const { isConnected } = useAccount();
  const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!;

  useEffect(() => {
    if (isConnected) onClose();
  }, [isConnected, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {/* MetaMask / injected */}
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" className="w-9 h-9" alt="MetaMask" />
            <div className="text-left">
              <div className="text-white font-semibold">MetaMask</div>
              <div className="text-white/50 text-xs">Browser extension</div>
            </div>
          </button>

          {/* WalletConnect — QR code */}
          <button
            onClick={() => connect({ connector: walletConnect({ projectId, showQrModal: true }) })}
            disabled={isPending}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
          >
            <div className="w-9 h-9 rounded-lg bg-[#3B99FC] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
                <path d="M8.19 14.43c6.52-6.38 17.1-6.38 23.62 0l.79.77a.81.81 0 010 1.16l-2.69 2.63a.43.43 0 01-.6 0l-1.08-1.06c-4.55-4.45-11.93-4.45-16.48 0l-1.16 1.13a.43.43 0 01-.6 0l-2.69-2.63a.81.81 0 010-1.16l.89-.84zm29.18 5.44l2.4 2.34a.81.81 0 010 1.16L28.2 34.5a.85.85 0 01-1.2 0l-7.99-7.82a.21.21 0 00-.3 0l-7.99 7.82a.85.85 0 01-1.2 0L.35 23.37a.81.81 0 010-1.16l2.4-2.34a.85.85 0 011.2 0l7.99 7.82c.08.08.22.08.3 0l7.99-7.82a.85.85 0 011.2 0l7.99 7.82c.08.08.22.08.3 0l7.99-7.82a.85.85 0 011.2 0z" fill="white"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">WalletConnect</div>
              <div className="text-white/50 text-xs">Scan QR with any wallet</div>
            </div>
          </button>
        </div>

        {isPending && (
          <div className="mt-4 text-center text-white/50 text-sm flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Connecting…
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
