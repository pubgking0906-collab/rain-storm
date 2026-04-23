'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Markets', href: '/markets' },
    { label: 'About', href: '/about' },
  ];

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

          {/* Wallet — RainbowKit ConnectButton */}
          <div className="flex items-center gap-3">
            <ConnectButton
              showBalance={false}
              chainStatus="none"
              accountStatus="address"
            />

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
          </nav>
        </div>
      )}
    </header>
  );
}
