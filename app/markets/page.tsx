'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MarketCard } from '@/components/market/MarketCard';
import { Button } from '@/components/ui/Button';
import { fetchMarketsFromApi } from '@/lib/data/marketApi';
import { Market, MarketCategory, MarketStatus } from '@/types/market';

type SortOption = 'volume' | 'active' | 'closing' | 'newest' | 'probability' | 'liquidity';

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<MarketCategory[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MarketStatus[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('volume');
  const [showFilters, setShowFilters] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    fetchMarketsFromApi(50)
      .then(setMarkets)
      .catch(() => setMarkets([]));
  }, []);

  const categories: MarketCategory[] = ['sports', 'crypto', 'politics', 'finance', 'entertainment', 'world-events', 'science-tech', 'other'];
  const statuses: MarketStatus[] = ['live', 'upcoming', 'resolved', 'cancelled'];

  const toggleCategory = (category: MarketCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleStatus = (status: MarketStatus) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const filteredMarkets = useMemo(() => {
    let filtered = markets;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(market =>
        market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(market =>
        selectedCategories.includes(market.category)
      );
    }

    // Status filter
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(market =>
        selectedStatus.includes(market.status)
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume - a.volume;
        case 'active':
          return b.totalTraders - a.totalTraders;
        case 'closing':
          return a.closesAt.getTime() - b.closesAt.getTime();
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'probability':
          return b.yesPrice - a.yesPrice;
        case 'liquidity':
          return b.liquidity - a.liquidity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [markets, searchQuery, selectedCategories, selectedStatus, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  return (
    <div className="min-h-screen bg-background-page">
      <Header />

      <div className="max-w-container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Explore Markets</h1>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-background-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-border bg-background-input accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-white capitalize transition-fast">
                        {category.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="bg-background-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Market Status</h3>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatus.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 rounded border-border bg-background-input accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-white capitalize transition-fast">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="bg-background-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'volume', label: 'Most Volume' },
                    { value: 'active', label: 'Most Active' },
                    { value: 'closing', label: 'Closing Soon' },
                    { value: 'newest', label: 'Newest' },
                    { value: 'probability', label: 'Highest Probability' },
                    { value: 'liquidity', label: 'Highest Liquidity' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="w-4 h-4 border-border bg-background-input accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-white transition-fast">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategories.length > 0 || selectedStatus.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search & Mobile Filter Toggle */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-background-input border border-border rounded-xl text-white placeholder-text-secondary focus:border-border-focus focus:outline-none transition-smooth"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                Filters
              </Button>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-secondary">
                {filteredMarkets.length} markets found
              </p>
            </div>

            {/* Markets Grid */}
            {filteredMarkets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMarkets.map((market) => (
                  <MarketCard key={market.id} market={market} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No markets found</h3>
                <p className="text-text-secondary mb-6">Try adjusting your filters or search terms</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-modal lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto bg-background-card rounded-t-2xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-fast"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Same filters as sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-border bg-background-input accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-white capitalize transition-fast">
                        {category.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-white mb-4">Market Status</h3>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatus.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 rounded border-border bg-background-input accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-white capitalize transition-fast">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <Button
                fullWidth
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>

              {(selectedCategories.length > 0 || selectedStatus.length > 0) && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    clearFilters();
                    setShowFilters(false);
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
