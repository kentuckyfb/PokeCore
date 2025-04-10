// components/Header.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onSearch: (query: string) => void;
  onRandom: () => void;
  onResetView?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onRandom, onResetView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Popular Pokémon suggestions
  const popularPokemon = [
    'pikachu', 'charizard', 'bulbasaur', 'squirtle', 'eevee',
    'mewtwo', 'gengar', 'snorlax', 'jigglypuff', 'gyarados'
  ];

  // Filter suggestions based on input
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = popularPokemon.filter(p =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
      setSuggestions([]);
      searchInputRef.current?.blur(); // Blur input on submit
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    onSearch(suggestion);
    setSearchQuery('');
    setSuggestions([]);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  return (
    // REMOVED bg-gray-950 from here
    <header className="sticky top-0 z-50 py-3 px-3 sm:py-4">
      {/* This inner div now provides the floating, blurred background */}
      <div className="max-w-6xl mx-auto bg-gray-900 bg-opacity-75 backdrop-blur-lg rounded-2xl py-3 sm:py-4 px-4 sm:px-6 border border-gray-700/50 shadow-lg">
        {/* Slightly increased blur, reduced opacity, lighter border, added shadow */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex items-center space-x-2 cursor-pointer" // Added cursor pointer
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()} // Optional: Reload on logo click
              title="PokéCore - Home"
            >
              {/* Pokéball Icon */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                 <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(#ff1a1a 50%, white 50%)", border: "2px solid #333" }} />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white border-2 border-gray-800 z-10" />
              </div>
              {/* Title */}
              <h1 className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap">
                PokéCore
              </h1>
            </motion.div>
          </motion.div>

          {/* Search form */}
          <motion.form
            className="relative w-full max-w-md"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <motion.input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay blur to allow suggestion click
                placeholder="Search Pokémon..." // Slightly shorter placeholder
                className="w-full px-4 py-2 pl-10 pr-12 rounded-full bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600/80 border border-gray-700/60 transition-shadow duration-200" // Added transition
                animate={{
                  boxShadow: isSearchFocused
                    ? '0 0 0 3px rgba(96, 108, 128, 0.4)' // Adjusted focus ring color slightly
                    : '0 0 0 0 rgba(96, 108, 128, 0)'
                }}
                // Removed explicit transition prop, handled by className transition
              />
              {/* Search Icon */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              {/* Random button inside input for small screens */}
              <motion.button
                type="button"
                onClick={onRandom}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-gray-700/80 hover:bg-gray-600/90 text-white" // Show only on small screens
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Random Pokémon"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </motion.button>
            </div>

            {/* Search suggestions */}
            <AnimatePresence>
              {isSearchFocused && suggestions.length > 0 && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700/50" // Added slight blur to suggestions
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <motion.li
                        key={suggestion}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-700/80 text-white transition-colors duration-150" // Faster transition
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Action buttons (only shown on larger screens) */}
          <div className="hidden sm:flex space-x-2 flex-shrink-0">
            {/* Random button */}
            <motion.button
              className="flex items-center px-4 py-2 rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white font-medium shadow-md hover:shadow-lg border border-gray-700/60 transition-colors duration-150"
              onClick={onRandom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              title="Get Random Pokémon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Random
            </motion.button>

            {/* Reset View button */}
            {onResetView && (
              <motion.button
                className="flex items-center px-4 py-2 rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white font-medium shadow-md hover:shadow-lg border border-gray-700/60 transition-colors duration-150"
                onClick={onResetView}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                title="Reset Layout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Reset
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;