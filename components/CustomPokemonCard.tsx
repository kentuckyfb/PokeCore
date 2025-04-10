// components/CustomPokemonCard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { formatPokemonId, capitalize, formatStatName, getTypeColor } from '../utils/pokemonApi';

interface CustomPokemonCardProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  isFlipped: boolean;
  onFlip: () => void;
  typeColor: string;
}

const CustomPokemonCard: React.FC<CustomPokemonCardProps> = ({ 
  pokemon, 
  species,
  isFlipped,
  onFlip,
  typeColor
}) => {
  // Get HP value
  const hp = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0;
  const attack = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
  const defense = pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0;
  
  // Create background based on type
  const bgColorClass = (() => {
    const type = pokemon.types[0].type.name;
    switch(type) {
      case 'fire': return 'from-yellow-600 to-red-600';
      case 'water': return 'from-blue-400 to-blue-600';
      case 'grass': return 'from-green-400 to-green-600';
      case 'electric': return 'from-yellow-300 to-yellow-500';
      case 'psychic': return 'from-pink-400 to-purple-500';
      case 'ice': return 'from-blue-200 to-blue-400';
      case 'dragon': return 'from-purple-500 to-indigo-700';
      case 'dark': return 'from-gray-700 to-gray-900';
      case 'fairy': return 'from-pink-300 to-pink-500';
      case 'normal': return 'from-gray-400 to-gray-600';
      case 'fighting': return 'from-red-600 to-red-800';
      case 'flying': return 'from-sky-300 to-sky-600';
      case 'poison': return 'from-purple-400 to-purple-600';
      case 'ground': return 'from-amber-500 to-amber-700';
      case 'rock': return 'from-stone-400 to-stone-600';
      case 'bug': return 'from-lime-400 to-lime-600';
      case 'ghost': return 'from-indigo-400 to-indigo-700';
      case 'steel': return 'from-gray-300 to-gray-500';
      default: return 'from-gray-400 to-gray-600';
    }
  })();

  return (
    <div className="flex justify-center items-center" onClick={onFlip}>
      <motion.div 
        className="w-full h-full max-w-xs cursor-pointer preserve-3d"
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 100
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <motion.div
          className="absolute w-full h-full rounded-xl overflow-hidden bg-gray-900 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Card Header */}
          <div className={`p-3 bg-gradient-to-r ${bgColorClass} flex justify-between items-center`}>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{capitalize(pokemon.name)}</h2>
              <span className="text-xs bg-gray-100 bg-opacity-30 px-2 py-0.5 rounded text-white">{pokemon.types[0].type.name}</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-800 bg-opacity-30 p-1 rounded">
              <span className="text-white font-bold">#{formatPokemonId(pokemon.id)}</span>
            </div>
          </div>
          
          {/* Pokémon Image */}
          <div className="relative flex justify-center items-center p-2 pt-8 pb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
            <motion.img 
              src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-48 w-auto object-contain z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Base Stats */}
          <div className="p-3 bg-gray-800">
            <h3 className="text-sm font-bold text-white mb-2">BASE STATS</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-12 text-xs text-gray-400">HP</span>
                <span className="w-6 text-xs text-white mr-2">{hp}</span>
                <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (hp / 255) * 100)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="w-12 text-xs text-gray-400">Attack</span>
                <span className="w-6 text-xs text-white mr-2">{attack}</span>
                <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                  <motion.div 
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (attack / 255) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.1 }}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <span className="w-12 text-xs text-gray-400">Defense</span>
                <span className="w-6 text-xs text-white mr-2">{defense}</span>
                <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (defense / 255) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Back of card */}
        <motion.div
          className="absolute w-full h-full rounded-xl overflow-hidden bg-gray-900 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Back header */}
            <div className={`p-3 bg-gradient-to-r ${bgColorClass} flex justify-between items-center`}>
              <h2 className="text-xl font-bold text-white">{capitalize(pokemon.name)}</h2>
              <div className="text-white font-bold">#{formatPokemonId(pokemon.id)}</div>
            </div>
            
            {/* Description */}
            <div className="p-4 flex-grow">
              <p className="text-sm text-white leading-relaxed mb-4">
                {species.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') || 'No description available.'}
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="text-gray-400 text-xs">Height</h4>
                  <p className="text-white">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs">Weight</h4>
                  <p className="text-white">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs">Species</h4>
                  <p className="text-white">{species.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs">Base Exp</h4>
                  <p className="text-white">{pokemon.base_experience || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-gray-400 text-xs mb-1">Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-gray-800 rounded-full text-xs text-white"
                    >
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && <span className="ml-1 text-yellow-500">★</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bottom info */}
            <div className="p-3 bg-gray-800 text-center">
              <p className="text-xs text-gray-400">Tap to flip card</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomPokemonCard;