'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'react-use';
import { useUIStore } from '@/lib/store';
import { searchApi, API_KEYS } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  query: string;
  type: 'product' | 'category' | 'brand' | 'suggestion';
  category?: string;
  image?: string;
  count?: number;
}

interface SearchBarProps {
  placeholder?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'mobile';
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = "Busque por extensões, mega hair, cores...",
  showSuggestions = true,
  onSearch,
  className = '',
  variant = 'default',
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useUIStore();
  
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query
  useDebounce(
    () => {
      setDebouncedQuery(localQuery.trim());
    },
    300,
    [localQuery]
  );
  
  // Fetch search suggestions
  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: API_KEYS.searchSuggestions(debouncedQuery),
    queryFn: () => searchApi.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2 && showSuggestions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch popular searches
  const { data: popularSearches = [] } = useQuery({
    queryKey: ['popular-searches'],
    queryFn: searchApi.getPopularSearches,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recent_searches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          // Ignore invalid JSON
        }
      }
    }
  }, []);
  
  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      const suggestions = getSuggestionsList();
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (localQuery.trim()) {
            handleSearch(localQuery.trim());
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, localQuery]);
  
  const getSuggestionsList = () => {
    const allSuggestions: SearchSuggestion[] = [];
    
    // Add current query suggestions
    if (suggestions.length > 0) {
      allSuggestions.push(...suggestions);
    }
    
    // Add recent searches if no current suggestions
    if (suggestions.length === 0 && recentSearches.length > 0 && !debouncedQuery) {
      allSuggestions.push(
        ...recentSearches.slice(0, 5).map(query => ({
          id: `recent-${query}`,
          query,
          type: 'suggestion' as const,
        }))
      );
    }
    
    // Add popular searches if no other suggestions
    if (allSuggestions.length === 0 && popularSearches.length > 0) {
      allSuggestions.push(
        ...popularSearches.slice(0, 5).map((query: string) => ({
          id: `popular-${query}`,
          query,
          type: 'suggestion' as const,
        }))
      );
    }
    
    return allSuggestions;
  };
  
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 10);
    
    setRecentSearches(updatedSearches);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
    }
  };
  
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    saveRecentSearch(query.trim());
    setSearchQuery(query.trim());
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      router.push(`/produto/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      router.push(`/categoria/${suggestion.id}`);
    } else {
      handleSearch(suggestion.query);
    }
  };
  
  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setSearchQuery(value);
    
    if (value.trim() && !isOpen) {
      setIsOpen(true);
    }
  };
  
  const handleInputFocus = () => {
    setIsOpen(true);
  };
  
  const allSuggestions = getSuggestionsList();
  const showDropdown = isOpen && (
    allSuggestions.length > 0 || 
    isFetching || 
    recentSearches.length > 0 || 
    popularSearches.length > 0
  );
  
  const inputClasses = {
    default: 'w-full px-4 py-3 pl-12 pr-10 text-base',
    compact: 'w-full px-3 py-2 pl-10 pr-8 text-sm',
    mobile: 'w-full px-4 py-3 pl-12 pr-10 text-base',
  };
  
  const iconSizes = {
    default: 'w-5 h-5',
    compact: 'w-4 h-4',
    mobile: 'w-5 h-5',
  };
  
  const iconPositions = {
    default: 'left-4',
    compact: 'left-3',
    mobile: 'left-4',
  };
  
  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className={cn(
          'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
          iconSizes[variant],
          iconPositions[variant]
        )} />
        
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            inputClasses[variant],
            'border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent',
            'bg-white text-gray-900 placeholder-gray-500',
            'transition-all duration-200'
          )}
        />
        
        {localQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className={iconSizes[variant]} />
          </button>
        )}
      </div>
      
      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 
                     rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
          >
            {isFetching && (
              <div className="px-4 py-3 text-sm text-gray-500 border-b">
                Buscando...
              </div>
            )}
            
            {/* Current Suggestions */}
            {allSuggestions.length > 0 && (
              <div className="py-2">
                {/* Section Header */}
                {debouncedQuery && suggestions.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                    Sugestões para "{debouncedQuery}"
                  </div>
                )}
                
                {!debouncedQuery && recentSearches.length > 0 && allSuggestions.some(s => s.id.startsWith('recent-')) && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Buscas recentes
                  </div>
                )}
                
                {!debouncedQuery && recentSearches.length === 0 && popularSearches.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Buscas populares
                  </div>
                )}
                
                {/* Suggestions List */}
                <div className="max-h-80 overflow-y-auto">
                  {allSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between',
                        'transition-colors duration-150',
                        selectedIndex === index && 'bg-gray-50'
                      )}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {suggestion.type === 'product' && suggestion.image ? (
                            <img
                              src={suggestion.image}
                              alt=""
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : suggestion.id.startsWith('recent-') ? (
                            <Clock className="w-4 h-4 text-gray-400" />
                          ) : suggestion.id.startsWith('popular-') ? (
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Search className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.query}
                          </div>
                          {suggestion.category && (
                            <div className="text-xs text-gray-500">
                              em {suggestion.category}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {suggestion.count && (
                          <span className="text-xs text-gray-400">
                            {suggestion.count} resultados
                          </span>
                        )}
                        
                        {suggestion.type === 'product' && (
                          <ArrowUpRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Results */}
            {!isFetching && allSuggestions.length === 0 && debouncedQuery && (
              <div className="px-4 py-8 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  Nenhuma sugestão encontrada para "{debouncedQuery}"
                </p>
                <button
                  onClick={() => handleSearch(debouncedQuery)}
                  className="mt-2 text-xs text-black hover:underline"
                >
                  Buscar mesmo assim
                </button>
              </div>
            )}
            
            {/* Search All Results */}
            {debouncedQuery && allSuggestions.length > 0 && (
              <div className="border-t">
                <button
                  onClick={() => handleSearch(debouncedQuery)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm font-medium text-black flex items-center justify-between"
                >
                  <span>Ver todos os resultados para "{debouncedQuery}"</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile search overlay component
interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
          
          {/* Search Overlay */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 bg-white z-50 p-4 shadow-lg md:hidden"
          >
            <div className="flex items-center space-x-3">
              <SearchBar
                variant="mobile"
                autoFocus
                onSearch={() => onClose()}
                className="flex-1"
              />
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}