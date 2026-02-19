import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { smartSearch } from '@/app/services/aiService';
import { mockProducts } from '@/app/data/mockData';
import { Product } from '@/app/types';
import {
  Search,
  Sparkles,
  TrendingUp,
  History,
  X,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductSelect?: (product: Product) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  open,
  onOpenChange,
  onProductSelect,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [didYouMean, setDidYouMean] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      setDidYouMean(undefined);
      return;
    }

    setLoading(true);
    try {
      const result = await smartSearch(searchQuery, mockProducts, searchHistory);
      setResults(result.results);
      setSuggestions(result.suggestions);
      setDidYouMean(result.didYouMean);

      // Update search history
      if (searchQuery.length > 2) {
        const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleProductClick = (product: Product) => {
    onProductSelect?.(product);
    onOpenChange(false);
    toast.success(`Selected: ${product.name}`);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search_history');
    toast.success('Search history cleared');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            AI-Powered Smart Search
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              ref={inputRef}
              placeholder="Search products by name, SKU, category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Did You Mean */}
          {didYouMean && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Did you mean:</span>
              <Button
                variant="link"
                size="sm"
                onClick={() => handleSuggestionClick(didYouMean)}
                className="h-auto p-0 text-blue-600 dark:text-blue-400"
              >
                {didYouMean}
              </Button>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && query && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <TrendingUp className="w-4 h-4" />
                <span>Popular suggestions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {!query && searchHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <History className="w-4 h-4" />
                  <span>Recent searches:</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-auto p-1 text-xs"
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {product.sku}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Stock: {product.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No products found for "{query}"
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Try using different keywords or check the suggestions above
                </p>
              </div>
            ) : null}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
