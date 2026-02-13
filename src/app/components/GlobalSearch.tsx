import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { mockProducts, mockOrders } from '@/app/data/mockData';

interface SearchResult {
  id: string;
  type: 'product' | 'order';
  title: string;
  subtitle: string;
  badge?: string;
}

export const GlobalSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Wireless Mouse',
    'Low stock items',
    'Pending orders',
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      performSearch(searchQuery);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search products
    mockProducts
      .filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .forEach(product => {
        searchResults.push({
          id: product.id,
          type: 'product',
          title: product.name,
          subtitle: `SKU: ${product.sku} • ${product.category}`,
          badge: product.quantity <= product.minStockLevel ? 'Low Stock' : undefined,
        });
      });

    // Search orders
    mockOrders
      .filter(o => 
        o.orderId.toLowerCase().includes(lowerQuery) ||
        o.status.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 3)
      .forEach(order => {
        searchResults.push({
          id: order.id,
          type: 'order',
          title: order.orderId,
          subtitle: `${order.items.length} items • $${order.total.toFixed(2)}`,
          badge: order.status,
        });
      });

    setResults(searchResults);
  };

  const handleSelectSearch = (query: string) => {
    setSearchQuery(query);
    if (!recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search products, orders, SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 w-full bg-slate-50 border-slate-200 focus:bg-white transition-colors"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase">
                Results ({results.length})
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  className="w-full px-4 py-3 hover:bg-slate-50 transition-colors text-left flex items-center justify-between group"
                  onClick={() => {
                    // Handle navigation based on type
                    setIsOpen(false);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 truncate">{result.title}</p>
                      {result.badge && (
                        <Badge 
                          variant={result.badge === 'Low Stock' ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {result.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{result.subtitle}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {result.type}
                  </Badge>
                </button>
              ))}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900">No results found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-3 py-2 flex items-center justify-between">
                <div className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </div>
                {recentSearches.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setRecentSearches([])}
                  >
                    Clear all
                  </Button>
                )}
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <button
                    className="flex-1 text-left text-sm text-slate-700"
                    onClick={() => handleSelectSearch(search)}
                  >
                    {search}
                  </button>
                  <button
                    onClick={() => removeRecentSearch(search)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-slate-100 mt-2">
                <div className="text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Low stock', 'Pending orders', 'Electronics', 'This month'].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSelectSearch(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
