// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PokemonCard from '../components/PokemonCard';
import BentoBoxes from '../components/BentoBoxes';
import { getPokemon, getPokemonSpecies, getRandomPokemon, getTypeColor } from '../utils/pokemonApi';
import { Pokemon, PokemonSpecies } from '../types/pokemon';

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#121212');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{id: number, name: string}>>([]);

  // Load a Pokémon (default: Pikachu)
  const loadPokemon = async (nameOrId: string | number = 25) => {
    setLoading(true);
    setError(null);
    setActiveSection(null);
    
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
    setActiveSection(null);
    
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

  // Handle section selection
  const handleSectionClick = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  // Animations for sections
  const sectionVariants = {
    active: {
      scale: 1.05,
      opacity: 1,
      zIndex: 30,
      transition: { duration: 0.3 }
    },
    inactive: (isActive: boolean) => ({
      scale: isActive ? 0.95 : 1,
      opacity: isActive ? 0.7 : 1,
      zIndex: isActive ? 10 : 20,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div className="min-h-screen flex flex-col overflow-container bg-transition" style={{ backgroundColor: bgColor }}>
      <Header onSearch={handleSearch} onRandom={loadRandomPokemon} />
      
      <main className="flex-1 py-4 sm:py-8 px-3 sm:px-4 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <motion.div
                className="relative w-20 h-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute w-20 h-20 rounded-full"
                  style={{
                    background: "linear-gradient(#ff1a1a 50%, white 50%)",
                    border: "5px solid #333"
                  }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-gray-800 z-10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
              <p className="mt-6 text-lg font-medium text-gray-300">Loading Pokémon data...</p>
            </div>
          ) : error ? (
            <motion.div 
              className="text-center p-6 sm:p-8 bg-gray-900 bg-opacity-80 rounded-2xl shadow-xl max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                alt="Pokéball" 
                className="w-16 h-16 mx-auto mb-4" 
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Left column - Bento boxes */}
              <motion.div 
                className="lg:col-span-1 order-2 lg:order-1"
                variants={sectionVariants}
                animate={activeSection === 'info' ? 'active' : 'inactive'}
                custom={!!activeSection && activeSection !== 'info'}
                onClick={() => handleSectionClick('info')}
              >
                <BentoBoxes pokemon={pokemon} species={species} />
              </motion.div>
              
              {/* Center column - Pokémon card */}
              <motion.div 
                className="lg:col-span-1 order-1 lg:order-2 flex justify-center"
                variants={sectionVariants}
                animate={activeSection === 'card' ? 'active' : 'inactive'}
                custom={!!activeSection && activeSection !== 'card'}
                onClick={() => handleSectionClick('card')}
              >
                <div className="w-full max-w-xs sm:h-96 mb-8 lg:mb-0">
                  <PokemonCard 
                    pokemon={pokemon}
                    species={species}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    typeColor={getTypeColor(pokemon.types[0].type.name)}
                  />
                </div>
              </motion.div>
              
              {/* Right column - More Bento boxes */}
              <motion.div 
                className="lg:col-span-1 order-3"
                variants={sectionVariants}
                animate={activeSection === 'sprites' ? 'active' : 'inactive'}
                custom={!!activeSection && activeSection !== 'sprites'}
                onClick={() => handleSectionClick('sprites')}
              >
                <motion.div 
                  className="bento-box p-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-bold mb-2" style={{ color: getTypeColor(pokemon.types[0].type.name) }}>
                    Sprites
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {pokemon.sprites.front_default && (
                      <motion.div 
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img 
                          src={pokemon.sprites.front_default} 
                          alt={`${pokemon.name} front`} 
                          className="w-16 h-16 object-contain"
                        />
                        <span className="text-xs mt-1">Front</span>
                      </motion.div>
                    )}
                    {pokemon.sprites.back_default && (
                      <motion.div 
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img 
                          src={pokemon.sprites.back_default} 
                          alt={`${pokemon.name} back`} 
                          className="w-16 h-16 object-contain"
                        />
                        <span className="text-xs mt-1">Back</span>
                      </motion.div>
                    )}
                    {pokemon.sprites.front_shiny && (
                      <motion.div 
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img 
                          src={pokemon.sprites.front_shiny} 
                          alt={`${pokemon.name} shiny front`} 
                          className="w-16 h-16 object-contain"
                        />
                        <span className="text-xs mt-1">Shiny Front</span>
                      </motion.div>
                    )}
                    {pokemon.sprites.back_shiny && (
                      <motion.div 
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img 
                          src={pokemon.sprites.back_shiny} 
                          alt={`${pokemon.name} shiny back`} 
                          className="w-16 h-16 object-contain"
                        />
                        <span className="text-xs mt-1">Shiny Back</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bento-box p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-bold mb-2" style={{ color: getTypeColor(pokemon.types[0].type.name) }}>
                    Quick Facts
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <motion.li 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.span 
                        className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
                        style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <span>Pokédex #: {pokemon.id}</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.span 
                        className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
                        style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2 }}
                      />
                      <span>Generation: {Math.ceil(pokemon.id / 151)}</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.span 
                        className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
                        style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4 }}
                      />
                      <span>Base Happiness: {species.base_happiness || 'Unknown'}</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.span 
                        className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
                        style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.6 }}
                      />
                      <span>Capture Rate: {species.capture_rate || 'Unknown'}/255</span>
                    </motion.li>
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          ) : null}
          
          {/* Search History Bar (if not on error screen) */}
          {!error && searchHistory.length > 0 && (
            <motion.div 
              className="mt-8 overflow-x-auto pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
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