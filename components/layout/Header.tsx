'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { cn } from '@/lib/utils/cn';
import { formatAddress } from '@/lib/utils/format';
import { ConnectModal } from '@/components/wallet/ConnectModal';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const navLinks = [
    { label: 'Markets', href: '/markets' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
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

            {/* Wallet */}
            <div className="flex items-center gap-3">
              {!isConnected ? (
                <button
                  onClick={() => setIsConnectOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-border rounded-xl hover:bg-white/10 transition-smooth"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-white">{formatAddress(address || '')}</span>
                    <svg className={cn('w-4 h-4 text-white/40 transition-transform', isDropdownOpen && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 p-2 bg-[#0f1117] border border-white/10 rounded-2xl shadow-xl z-[1060]">
                      <Link href="/portfolio" onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-smooth text-sm text-white">
                        Portfolio
                      </Link>
                      <button onClick={() => { disconnect(); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-smooth text-sm text-red-400">
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-white/5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background-page-secondary">
            <nav className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
                  className={cn('block px-4 py-3 rounded-xl text-sm font-medium',
                    pathname === link.href ? 'text-white bg-primary/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>
                  {link.label}
                </Link>
              ))}
              {!isConnected && (
                <button onClick={() => { setIsConnectOpen(true); setIsMenuOpen(false); }}
                  className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-sm font-semibold">
                  Connect Wallet
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <ConnectModal isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
    </>
  );
}
