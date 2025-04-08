// components/BentoBoxes.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { getTypeColor, capitalize, formatStatName } from '../utils/pokemonApi';

interface BentoBoxesProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
}

const BentoBoxes: React.FC<BentoBoxesProps> = ({ pokemon, species }) => {
  const [expandedBox, setExpandedBox] = useState<string | null>(null);
  
  // Get English description
  const getEnglishDescription = () => {
    if (!species.flavor_text_entries) return 'No description available.';
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry ? englishEntry.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') : 'No description available.';
  };

  // Calculate evolutionary stage
  const getEvolutionStage = () => {
    // Simple logic based on ID ranges, would be better with actual evolution chain data
    if (pokemon.id <= 151) {
      if ([3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 85, 87, 89, 91, 94, 97, 99, 101, 103, 105, 106, 107, 110, 115, 119, 121, 124, 127, 130, 134, 135, 136, 139, 141, 142, 143, 149].includes(pokemon.id)) {
        return 'Final Stage';
      } else if ([2, 5, 8, 11, 14, 17, 19, 21, 23, 25, 27, 30, 33, 35, 37, 39, 41, 44, 46, 48, 50, 52, 54, 56, 58, 61, 64, 67, 70, 72, 75, 77, 79, 81, 84, 86, 88, 90, 93, 96, 98, 100, 102, 104, 108, 109, 113, 114, 117, 118, 120, 122, 123, 125, 126, 129, 133, 137, 138, 140].includes(pokemon.id)) {
        return 'Mid Stage';
      } else {
        return 'Basic';
      }
    }
    // Default
    return 'Unknown';
  };

  // Handle box toggle
  const handleBoxClick = (boxId: string) => {
    setExpandedBox(expandedBox === boxId ? null : boxId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Description Box */}
      <motion.div 
        className="bento-box p-4 sm:col-span-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => handleBoxClick('description')}
        layout
      >
        <motion.h3 
          className="text-lg font-bold mb-2 flex items-center"
          style={{ color: getTypeColor(pokemon.types[0].type.name) }}
          layout
        >
          <motion.span 
            className="w-2 h-2 mr-2 rounded-full inline-block"
            style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            layout
          />
          Description
        </motion.h3>
        
        <motion.p 
          className="text-white text-sm leading-relaxed"
          layout
        >
          {getEnglishDescription()}
        </motion.p>
        
        <AnimatePresence>
          {expandedBox === 'description' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <p className="text-gray-400 text-xs">
                This Pokémon was introduced in Generation {Math.ceil(pokemon.id / 151)} and has a base experience yield of {pokemon.base_experience || 'Unknown'} points.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Physical Attributes Box */}
      <motion.div 
        className="bento-box p-4"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => handleBoxClick('physical')}
        layout
      >
        <motion.h3 
          className="text-lg font-bold mb-2 flex items-center"
          style={{ color: getTypeColor(pokemon.types[0].type.name) }}
          layout
        >
          <motion.span 
            className="w-2 h-2 mr-2 rounded-full inline-block"
            style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.1 }}
            layout
          />
          Physical
        </motion.h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-400">Height</p>
            <p className="text-white font-medium">{(pokemon.height / 10).toFixed(1)} m</p>
          </div>
          <div>
            <p className="text-gray-400">Weight</p>
            <p className="text-white font-medium">{(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>
        </div>
        
        <AnimatePresence>
          {expandedBox === 'physical' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <p className="text-gray-400 text-xs mb-2">Physical comparison:</p>
              <div className="flex items-end space-x-2">
                <div className="bg-gray-700 rounded-t w-8" style={{ height: `${pokemon.height * 4}px`, maxHeight: '100px' }}></div>
                <div className="bg-blue-500 bg-opacity-50 rounded-t w-8" style={{ height: '50px' }}></div>
                <div className="text-xs text-gray-400">
                  <div>Pokémon</div>
                  <div>Human</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Abilities Box */}
      <motion.div 
        className="bento-box p-4"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => handleBoxClick('abilities')}
        layout
      >
        <motion.h3 
          className="text-lg font-bold mb-2 flex items-center"
          style={{ color: getTypeColor(pokemon.types[0].type.name) }}
          layout
        >
          <motion.span 
            className="w-2 h-2 mr-2 rounded-full inline-block"
            style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
            layout
          />
          Abilities
        </motion.h3>
        
        <ul className="space-y-2">
          {pokemon.abilities.map((ability, index) => (
            <li key={index} className="flex items-center">
              <motion.span
                className="w-1.5 h-1.5 mr-2 rounded-full"
                style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
              />
              <span className="text-white">{capitalize(ability.ability.name.replace('-', ' '))}</span>
              {ability.is_hidden && (
                <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">Hidden</span>
              )}
            </li>
          ))}
        </ul>
        
        <AnimatePresence>
          {expandedBox === 'abilities' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <p className="text-gray-400 text-xs">
                Abilities may have effects both in battles and in the overworld. Some abilities trigger automatically, while others need to be activated.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Stats Box */}
      <motion.div 
        className="bento-box p-4 sm:col-span-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => handleBoxClick('stats')}
        layout
      >
        <motion.h3 
          className="text-lg font-bold mb-2 flex items-center"
          style={{ color: getTypeColor(pokemon.types[0].type.name) }}
          layout
        >
          <motion.span 
            className="w-2 h-2 mr-2 rounded-full inline-block"
            style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.3 }}
            layout
          />
          Base Stats
        </motion.h3>
        
        <div className="space-y-3 mt-1">
          {pokemon.stats.map((stat, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-xs text-gray-400">{formatStatName(stat.stat.name)}</div>
              <div className="w-8 text-xs font-mono text-right text-white mr-3">{stat.base_stat}</div>
              <div className="flex-1">
                <motion.div className="stats-bar">
                  <motion.div 
                    className="stats-bar-fill"
                    style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
        
        <AnimatePresence>
          {expandedBox === 'stats' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <div className="text-xs text-gray-400">
                <p className="mb-2">Total Base Stat: {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}</p>
                <p>These base stats are further modified by level, nature, EVs, and IVs in the games.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Details Box */}
      <motion.div 
        className="bento-box p-4 sm:col-span-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => handleBoxClick('details')}
        layout
      >
        <motion.h3 
          className="text-lg font-bold mb-2 flex items-center"
          style={{ color: getTypeColor(pokemon.types[0].type.name) }}
          layout
        >
          <motion.span 
            className="w-2 h-2 mr-2 rounded-full inline-block"
            style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.4 }}
            layout
          />
          Details
        </motion.h3>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Species</p>
            <p className="text-white font-medium">{species.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-400">Base Exp</p>
            <p className="text-white font-medium">{pokemon.base_experience || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-400">Evolution</p>
            <p className="text-white font-medium">{getEvolutionStage()}</p>
          </div>
        </div>
        
        <AnimatePresence>
          {expandedBox === 'details' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Capture Rate</p>
                  <p className="text-white font-medium">{species.capture_rate || 'Unknown'}/255</p>
                </div>
                <div>
                  <p className="text-gray-400">Base Happiness</p>
                  <p className="text-white font-medium">{species.base_happiness || 'Unknown'}/255</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BentoBoxes;