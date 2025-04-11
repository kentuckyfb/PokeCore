// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UniformGridLayout from '../components/UniformGridLayout'; // Import the new uniform grid layout
import { getPokemon, getPokemonSpecies, getRandomPokemon, getTypeColor } from '../utils/pokemonApi';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import PokeballLoading from '../components/LoadingIcon';

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#121212');
  const [searchHistory, setSearchHistory] = useState<Array<{id: number, name: string}>>([]);

  // Load a Pokémon (default: Pikachu)
  const loadPokemon = async (nameOrId: string | number = 25) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get Pokémon data
      const pokemonData = await getPokemon(nameOrId);
      setPokemon(pokemonData);
      
      // Get species data
      const speciesData = await getPokemonSpecies(pokemonData.id);
      setSpecies(speciesData);
      
      // Set background color based on Pokémon type
      const mainType = pokemonData.types[0].type.name;
      const typeColor = getTypeColor(mainType);
      setBgColor(`${typeColor}22`); // Add transparency
      
      setIsFlipped(false);
      
      // Add to search history if not already there
      setSearchHistory(prev => {
        // Only keep last 5 searches
        const newHistory = [...prev.filter(p => p.id !== pokemonData.id)];
        newHistory.unshift({ id: pokemonData.id, name: pokemonData.name });
        return newHistory.slice(0, 5);
      });
      
      // Log successful load
      console.log(`Successfully loaded Pokémon: ${pokemonData.name} (#${pokemonData.id})`);
    } catch (err) {
      console.error('Error loading Pokémon:', err);
      setError('Could not find that Pokémon. Please try another name or ID.');
    } finally {
      setLoading(false);
    }
  };

  // Load a random Pokémon
  const loadRandomPokemon = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get random Pokémon data
      const pokemonData = await getRandomPokemon();
      setPokemon(pokemonData);
      
      // Get species data
      const speciesData = await getPokemonSpecies(pokemonData.id);
      setSpecies(speciesData);
      
      // Set background color based on Pokémon type
      const mainType = pokemonData.types[0].type.name;
      const typeColor = getTypeColor(mainType);
      setBgColor(`${typeColor}22`); // Add transparency
      
      setIsFlipped(false);
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [...prev.filter(p => p.id !== pokemonData.id)];
        newHistory.unshift({ id: pokemonData.id, name: pokemonData.name });
        return newHistory.slice(0, 5);
      });
    } catch (err) {
      console.error('Error loading random Pokémon:', err);
      setError('Could not load a random Pokémon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load initial Pokémon on mount
  useEffect(() => {
    // Start with Pikachu (ID: 25)
    const initialPokemon = 25;
    console.log("Loading initial Pokémon:", initialPokemon);
    loadPokemon(initialPokemon);
    
    // Add debugging
    const checkLoadStatus = setTimeout(() => {
      if (loading && !pokemon && !error) {
        console.warn("Still loading after timeout - might need to retry");
        loadPokemon(initialPokemon);
      }
    }, 5000);
    
    return () => clearTimeout(checkLoadStatus);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    loadPokemon(query.toLowerCase().trim());
  };

  // Handle flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor }}>
      <Header onSearch={handleSearch} onRandom={loadRandomPokemon} />
      
      <main className="flex-1 py-4 px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <PokeballLoading size={60} message="Loading Pokémon data..." />
            </div>
          ) : error ? (
            <motion.div 
              className="text-center p-6 sm:p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-xl max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 mx-auto mb-4 relative"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                <div
                  className="absolute w-16 h-16 rounded-full"
                  style={{
                    background: "linear-gradient(#ff1a1a 50%, white 50%)",
                    border: "3px solid #333"
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-800 z-10"
                />
              </motion.div>
              <p className="text-red-500 text-lg font-semibold mb-2">{error}</p>
              <p className="text-gray-400 mb-6">Try searching for a Pokémon by name (like "pikachu") or ID number.</p>
              <motion.button
                onClick={() => loadPokemon()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load Default Pokémon (Pikachu)
              </motion.button>
              
              {searchHistory.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm text-gray-400 mb-3">Recent searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {searchHistory.map(item => (
                      <motion.button
                        key={item.id}
                        onClick={() => loadPokemon(item.id)}
                        className="px-3 py-1 bg-gray-800 text-white text-xs rounded-full hover:bg-gray-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : pokemon && species ? (
            // Use the new UniformGridLayout component
            <UniformGridLayout
              pokemon={pokemon}
              species={species}
              loadPokemon={loadPokemon}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
          ) : null}
          
          {/* Search History Bar (if not on error screen) */}
          {!error && !loading && searchHistory.length > 0 && (
            <motion.div 
              className="mt-8 overflow-x-auto pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs text-gray-400">Recent:</span>
                {searchHistory.map(item => (
                  <motion.button
                    key={item.id}
                    onClick={() => loadPokemon(item.id)}
                    className="px-3 py-1 bg-gray-800 bg-opacity-60 text-white text-xs rounded-full hover:bg-opacity-100 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};