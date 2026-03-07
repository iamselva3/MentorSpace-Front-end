import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiClock, FiTrendingUp } from 'react-icons/fi';

const SearchBar = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = 'Search articles...',
  suggestions = [],
  recentSearches = [],
  showSuggestions = false,
  autoFocus = false,
  debounceTime = 300
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onChange) {
        onChange(localValue);
      }
      if (onSearch && localValue.length >= 2) {
        onSearch(localValue);
      }
    }, debounceTime);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [localValue, debounceTime, onChange, onSearch]);

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalValue(suggestion);
    if (onChange) {
      onChange(suggestion);
    }
    if (onSearch) {
      onSearch(suggestion);
    }
    setIsFocused(false);
    setShowRecent(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(localValue);
      setIsFocused(false);
      setShowRecent(false);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      
      <div className={`
        relative flex items-center w-full
        ${isFocused ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}
      `}>
        <FiSearch className="absolute left-3 text-gray-400 text-lg" />
        
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (recentSearches.length > 0) {
              setShowRecent(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-2.5 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-400"
        />
        
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <FiX className="text-lg" />
          </button>
        )}
      </div>

      
      {(isFocused || showRecent) && (showSuggestions || recentSearches.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          
          {recentSearches.length > 0 && showRecent && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <FiClock className="text-sm" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-700/50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiClock className="text-gray-500 text-sm" />
                  <span className="text-sm text-gray-300">{search}</span>
                </button>
              ))}
            </div>
          )}

          {suggestions.length > 0 && showSuggestions && (
            <div className="p-2 border-t border-gray-700">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <FiTrendingUp className="text-sm" />
                Popular Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <span className="text-sm text-gray-300">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          
          {suggestions.length === 0 && recentSearches.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400">
              No suggestions available
            </div>
          )}
        </div>
      )}

      
      {localValue.length > 0 && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          Press Enter to search
        </div>
      )}
    </div>
  );
};


export const ArticleSearchBar = ({ onSearch, totalArticles }) => {
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = (query) => {
    if (query && query.length > 0) {
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
        return updated;
      });
    }
    onSearch?.(query);
  };

  return (
    <div className="space-y-2">
      <SearchBar
        onSearch={handleSearch}
        recentSearches={recentSearches}
        suggestions={['Mathematics', 'Science', 'History', 'English Literature', 'Physics']}
        showSuggestions={true}
        placeholder="Search by title, category, or keywords..."
      />
      {totalArticles !== undefined && (
        <div className="text-sm text-gray-400">
          {totalArticles} articles available
        </div>
      )}
    </div>
  );
};

export const CompactSearchBar = ({ onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
        aria-label="Search"
      >
        <FiSearch className="text-xl" />
      </button>
    );
  }

  return (
    <div className="absolute inset-x-0 top-0 bg-gray-900/95 backdrop-blur-sm p-4 shadow-lg z-50 border-b border-gray-800">
      <SearchBar
        autoFocus
        onSearch={(query) => {
          onSearch?.(query);
          setIsExpanded(false);
        }}
        placeholder="Search..."
      />
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 transition-colors"
      >
        <FiX className="text-xl" />
      </button>
    </div>
  );
};

export default SearchBar;