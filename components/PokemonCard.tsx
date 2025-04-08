// components/PokemonCard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { formatPokemonId, capitalize, formatStatName } from '../utils/pokemonApi';

interface PokemonCardProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  isFlipped: boolean;
  onFlip: () => void;
  typeColor: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
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
  
  // Get the RGB values from hex color for CSS variables
  const getRgbFromHex = (hex: string): string => {
    // Default to a safe value if typeColor is empty
    if (!hex || hex.length < 7) return "255, 83, 80";
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Get English description
  const getEnglishDescription = () => {
    if (!species.flavor_text_entries) return 'No description available.';
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry ? englishEntry.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') : 'No description available.';
  };

  // Smoother card flip animation
  return (
    <div className="pokemon-card-container w-full h-full max-w-xs mx-auto my-2 sm:my-0">
      <motion.div 
        className="pokemon-card relative w-full h-[480px] cursor-pointer preserve-3d"
        initial={false}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          transition: { 
            type: "spring", 
            stiffness: 80, 
            damping: 12 
          }
        }}
        onClick={onFlip}
        style={{ 
          '--card-color-rgb': getRgbFromHex(typeColor),
          transformStyle: 'preserve-3d'
        } as React.CSSProperties}
      >
        {/* Front of the card */}
        <motion.div 
          className="card-side absolute w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-800 bg-gray-900 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            rotateY: 0 
          }}
        >
          {/* Card header with color based on type */}
          <div 
            className="p-4 sm:p-5 flex justify-between items-center relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${typeColor || '#FF5350'}, ${typeColor ? `${typeColor}88` : '#FF535088'})`,
            }}
          >
            <div className="z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate max-w-[160px]">{capitalize(pokemon.name)}</h2>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                {pokemon.types.map((typeInfo, index) => (
                  <span 
                    key={index} 
                    className="text-xs font-medium px-2 sm:px-3 py-1 rounded-full bg-black bg-opacity-30 text-white backdrop-blur-sm"
                  >
                    {capitalize(typeInfo.type.name)}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-lg sm:text-xl font-mono text-white bg-black bg-opacity-30 px-2 sm:px-3 py-1 rounded-md backdrop-blur-sm z-10">
              #{formatPokemonId(pokemon.id)}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white opacity-10"></div>
            <div className="absolute right-12 bottom-0 w-12 h-12 rounded-full bg-white opacity-10"></div>
          </div>
          
          {/* Pokemon image */}
          <div 
            className="relative flex justify-center items-center p-4 sm:p-6 h-48 sm:h-56 bg-gray-900" 
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{ 
                background: `radial-gradient(circle, ${typeColor || '#FF5350'}66 0%, transparent 70%)` 
              }}
            ></div>
            
            <motion.img 
              src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-full w-auto object-contain z-10 drop-shadow-lg"
              style={{ filter: `drop-shadow(0 0 10px ${typeColor || '#FF5350'}66)` }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Sparkle effects */}
            {sparkles.map((sparkle) => (
              <div
                key={sparkle.id}
                className="sparkle absolute"
                style={{
                  top: `${sparkle.y}%`,
                  left: `${sparkle.x}%`,
                  width: `${sparkle.size}px`,
                  height: `${sparkle.size}px`,
                  animationDelay: `${sparkle.delay}s`,
                }}
              />
            ))}
          </div>
          
          {/* Stats - HP, Attack, Defense only */}
          <div className="p-4 sm:p-5 bg-gray-900 space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2 sm:mb-3">Base Stats</h3>
            
            <div className="space-y-2 sm:space-y-3">
              {/* Only include first 3 stats (HP, Attack, Defense) */}
              {pokemon.stats.slice(0, 3).map((stat, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 sm:w-20 text-xs text-gray-400">{formatStatName(stat.stat.name)}</div>
                  <div className="w-6 sm:w-8 text-xs font-mono text-right text-white mr-2 sm:mr-3">{stat.base_stat}</div>
                  <div className="flex-1">
                    <motion.div 
                      className="stats-bar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                    >
                      <motion.div 
                        className="stats-bar-fill"
                        style={{ backgroundColor: typeColor || '#FF5350' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                        transition={{ 
                          duration: 1,
                          delay: 0.3 + (index * 0.1),
                          ease: "easeOut"
                        }}
                      ></motion.div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Back of the card */}
        <motion.div 
          className="card-side absolute w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-800 bg-gray-900 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            rotateY: 180
          }}
        >
          <div className="h-full flex flex-col">
            {/* Card back header */}
            <div 
              className="p-4 sm:p-5 flex justify-between items-center relative"
              style={{ 
                background: `linear-gradient(135deg, ${typeColor || '#FF5350'}, ${typeColor ? `${typeColor}88` : '#FF535088'})`,
              }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate max-w-[160px]">{capitalize(pokemon.name)}</h2>
              <div className="text-lg sm:text-xl font-mono text-white bg-black bg-opacity-30 px-2 sm:px-3 py-1 rounded-md backdrop-blur-sm">
                #{formatPokemonId(pokemon.id)}
              </div>
            </div>
            
            {/* Pokemon description */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col bg-gray-900 overflow-y-auto scroll-thin">
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2 sm:mb-3">About</h3>
                <p className="text-white text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed max-h-20 overflow-y-auto scroll-thin">
                  {getEnglishDescription()}
                </p>
              
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
                  <div>
                    <h4 className="text-xs text-gray-400 mb-1">Height</h4>
                    <p className="text-white font-medium">{(pokemon.height / 10).toFixed(1)} m</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 mb-1">Weight</h4>
                    <p className="text-white font-medium">{(pokemon.weight / 10).toFixed(1)} kg</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 mb-1">Category</h4>
                    <p className="text-white font-medium truncate">
                      {species.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 mb-1">Abilities</h4>
                    <p className="text-white font-medium truncate">
                      {pokemon.abilities[0]?.ability.name.replace('-', ' ') || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-xs sm:text-sm text-gray-500 mt-2 pb-1">
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                  Tap to see stats
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PokemonCard;