// components/EnhancedPokemonCard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { formatPokemonId, capitalize, formatStatName, getTypeColor } from '../utils/pokemonApi';

interface EnhancedPokemonCardProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  isFlipped: boolean;
  onFlip: () => void;
  typeColor: string;
}

const EnhancedPokemonCard: React.FC<EnhancedPokemonCardProps> = ({ 
  pokemon, 
  species,
  isFlipped,
  onFlip,
  typeColor
}) => {
  // State for sparkle effects
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  // Create sparkle effects for the card
  useEffect(() => {
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
    }));
    setSparkles(newSparkles);
  }, [pokemon.id]);
  
  // Get English description
  const getEnglishDescription = () => {
    if (!species.flavor_text_entries) return 'No description available.';
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry ? englishEntry.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') : 'No description available.';
  };

  // Calculate total stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  
  // Get HP for card header
  const hp = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || '?';
  
  // Get main move for card
  const mainMove = pokemon.moves[0]?.move.name.replace('-', ' ') || 'No moves';

  return (
    <div className="pokemon-card-container w-full max-w-xs mx-auto perspective-1000">
      <motion.div 
        className="pokemon-card relative w-full aspect-[2.5/3.5] rounded-xl cursor-pointer preserve-3d"
        initial={{ rotateY: 0 }}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 70, 
          damping: 15,
          duration: 0.6
        }}
        onClick={onFlip}
        style={{ 
          transformStyle: 'preserve-3d',
          boxShadow: `0 0 20px rgba(0,0,0,0.2), 0 0 8px ${typeColor}33`
        }}
      >
        {/* Front of the card */}
        <motion.div 
          className="card-side absolute w-full h-full rounded-xl overflow-hidden backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            background: `radial-gradient(circle at 50% 50%, ${typeColor}22, ${typeColor}44)`,
            border: `1px solid ${typeColor}44`,
            boxShadow: `inset 0 0 20px rgba(255,255,255,0.1)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Card border with texture */}
          <div className="absolute inset-[3px] rounded-lg border border-white border-opacity-10 z-10"></div>
          
          {/* Card header with Pokémon name and HP */}
          <div className="p-3 pb-1 flex justify-between items-center relative">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white drop-shadow-md">{capitalize(pokemon.name)}</h2>
              {pokemon.types.map((typeInfo, index) => (
                <div 
                  key={index}
                  className="ml-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
                >
                  <span className="text-white text-xs font-bold">{typeInfo.type.name.charAt(0).toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div className="text-xl font-bold text-white drop-shadow-md">
              HP {hp}
            </div>
          </div>
          
          {/* Pokémon image with holographic effect */}
          <div 
            className="relative flex justify-center items-center p-2 h-40 overflow-hidden"
          >
            {/* Holographic effect */}
            <div className="absolute inset-0 opacity-30 hologram-effect" style={{ 
              background: `
                linear-gradient(140deg, transparent 20%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0) 60%),
                radial-gradient(circle at 50% 50%, ${typeColor}44, transparent 100%)
              `
            }}></div>
            
            <motion.img 
              src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-full w-auto object-contain z-10 drop-shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Subtle sparkle effects */}
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${sparkle.y}%`,
                  left: `${sparkle.x}%`,
                  width: `${sparkle.size}px`,
                  height: `${sparkle.size}px`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: sparkle.delay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 4
                }}
              />
            ))}
          </div>
          
          {/* Species and stats info */}
          <div className="px-3 py-1.5 bg-gradient-to-r from-black/30 to-black/10">
            <div className="text-xs text-white opacity-80">
              {species.genera?.find(g => g.language.name === 'en')?.genus || 'Pokémon'} • #{formatPokemonId(pokemon.id)} • {(pokemon.weight / 10).toFixed(1)}kg
            </div>
          </div>
          
          {/* Abilities/Moves section */}
          <div className="p-3 space-y-2 flex-grow">
            {/* First ability/move as main attack */}
            <div className="bg-gradient-to-r from-gray-800/70 to-gray-700/50 p-2 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium capitalize">{pokemon.abilities[0]?.ability.name.replace('-', ' ') || 'No ability'}</span>
                <div className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center bg-yellow-500 rounded-full">
                    <span className="text-white text-xs font-bold">⚡</span>
                  </div>
                  <span className="ml-1 text-white text-sm">x{Math.floor(Math.random() * 3) + 1}</span>
                </div>
              </div>
              <p className="text-gray-300 text-xs mt-1">
                This Pokémon's special ability gives it unique powers in battle.
              </p>
            </div>
            
            {/* Secondary move */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-2 rounded-lg">
              <div className="flex justify-between">
                <span className="text-white font-medium capitalize">{mainMove}</span>
                <div className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center bg-red-500 rounded-full">
                    <span className="text-white text-xs font-bold">🔥</span>
                  </div>
                  <span className="ml-1 text-white text-sm">{Math.floor(Math.random() * 90) + 30}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with weakness/resistance */}
          <div className="mt-auto p-3 pt-0 text-xs text-white">
            <div className="flex justify-between items-center">
              <div>
                <span className="opacity-70">Weakness:</span>
                <div className="inline-flex ml-1">
                  {pokemon.types.length > 0 && (
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: getTypeColor(
                          pokemon.types[0].type.name === 'fire' ? 'water' :
                          pokemon.types[0].type.name === 'water' ? 'electric' :
                          pokemon.types[0].type.name === 'grass' ? 'fire' :
                          pokemon.types[0].type.name === 'electric' ? 'ground' : 'fighting'
                        ) 
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                <span className="opacity-70">Resistance:</span>
                <div className="inline-flex ml-1">
                  {pokemon.types.length > 0 && (
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: getTypeColor(
                          pokemon.types[0].type.name === 'fire' ? 'grass' :
                          pokemon.types[0].type.name === 'water' ? 'fire' :
                          pokemon.types[0].type.name === 'grass' ? 'water' :
                          pokemon.types[0].type.name === 'electric' ? 'flying' : 'normal'
                        ) 
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                <span className="opacity-70">Retreat:</span>
                <span className="ml-1">⚪⚪</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Back of the card */}
        <motion.div 
          className="card-side absolute w-full h-full rounded-xl overflow-hidden backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            background: `url('/pokeball-pattern.png'), radial-gradient(circle at 50% 25%, ${typeColor}22, ${typeColor}66)`,
            border: `1px solid ${typeColor}44`,
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
            {/* Pokémon logo */}
            <div className="w-full flex justify-center items-center my-4">
              <motion.div 
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300">
                  POKÉMON
                </span>
              </motion.div>
            </div>
            
            {/* Pokémon info */}
            <div className="w-full bg-black/40 backdrop-blur-sm rounded-lg p-4 text-white">
              <h3 className="text-lg font-bold mb-2">
                {capitalize(pokemon.name)} <span className="text-sm opacity-70">#{formatPokemonId(pokemon.id)}</span>
              </h3>
              <p className="text-sm mb-3">{getEnglishDescription()}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                <div>
                  <span className="opacity-70">Height:</span> {(pokemon.height / 10).toFixed(1)}m
                </div>
                <div>
                  <span className="opacity-70">Weight:</span> {(pokemon.weight / 10).toFixed(1)}kg
                </div>
                <div>
                  <span className="opacity-70">Category:</span> {species.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown'}
                </div>
                <div>
                  <span className="opacity-70">Total Stats:</span> {totalStats}
                </div>
              </div>
            </div>
            
            {/* Pokéball icon */}
            <div className="mt-4 opacity-60">
              <div 
                className="w-12 h-12 rounded-full mx-auto"
                style={{
                  background: "linear-gradient(#ff1a1a 50%, white 50%)",
                  border: "3px solid #333"
                }}
              >
                <div className="w-full h-full relative">
                  <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-800"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-800"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedPokemonCard;