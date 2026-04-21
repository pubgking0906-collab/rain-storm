'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useReadContract } from 'wagmi';
import { cn } from '@/lib/utils/cn';
import { formatAddress } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';

const USDT_ARBITRUM = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as const;
const ERC20_BALANCE_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: rawBalance } = useReadContract({
    address: USDT_ARBITRUM,
    abi: ERC20_BALANCE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const navLinks = [
    { label: 'Markets', href: '/markets' },
    ...(isConnected ? [{ label: 'Portfolio', href: '/portfolio' }] : []),
    { label: 'About', href: '/about' },
  ];

  const formattedBalance = rawBalance != null
    ? `$${(Number(rawBalance) / 1e6).toFixed(2)}`
    : null;

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setIsDropdownOpen(false);
    }
  };

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://arbiscan.io/address/${address}`, '_blank');
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[1030] bg-background-card/95 backdrop-blur-lg border-b border-border shadow-md">
      <div style={{ padding: '0 10%' }}>
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-fast">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">Rain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-border rounded-xl px-2 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium px-4 py-2 rounded-lg transition-smooth',
                  pathname === link.href
                    ? 'text-white bg-primary/15 border border-primary/25'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Section */}
          <div className="flex items-center gap-3">
            {!isConnected ? (
              <Button onClick={() => openConnectModal?.()} size="md">
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                {/* USDT Balance */}
                {formattedBalance && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 border border-border rounded-xl">
                    <span className="text-xs text-text-secondary">USDT</span>
                    <span className="text-sm font-semibold text-white">{formattedBalance}</span>
                  </div>
                )}

                {/* Address + Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-border rounded-xl hover:bg-white/8 hover:border-border-hover transition-smooth"
                  >
                    <div className="w-2 h-2 rounded-full bg-positive animate-pulse" />
                    <span className="text-sm font-medium text-white">
                      {formatAddress(address || '')}
                    </span>
                    <svg
                      className={cn('w-4 h-4 text-text-secondary transition-transform', isDropdownOpen && 'rotate-180')}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 p-2 bg-background-elevated border border-border-hover rounded-2xl shadow-xl animate-slide-down z-[1060]">
                      <Link
                        href="/portfolio"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-smooth"
                      >
                        <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-white">View Portfolio</span>
                      </Link>

                      <button
                        onClick={copyAddress}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-smooth"
                      >
                        <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-white">Copy Address</span>
                      </button>

                      <button
                        onClick={viewOnExplorer}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-smooth"
                      >
                        <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-sm font-medium text-white">View on Arbiscan</span>
                      </button>

                      <div className="h-px bg-border my-2" />

                      <button
                        onClick={() => {
                          disconnect();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-negative/10 transition-smooth text-negative"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm font-medium">Disconnect</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-smooth"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background-page-secondary animate-slide-down">
          <nav className="px-5 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-medium transition-smooth',
                  pathname === link.href
                    ? 'text-white bg-primary/10 border border-primary/20'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isConnected && (
              <button
                onClick={() => { openConnectModal?.(); setIsMenuOpen(false); }}
                className="w-full mt-2 px-4 py-3 bg-gradient-primary rounded-xl text-white text-sm font-semibold"
              >
                Connect Wallet
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
