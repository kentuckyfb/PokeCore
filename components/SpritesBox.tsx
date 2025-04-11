// components/SpritesBox.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Pokemon } from '../types/pokemon';
import { getTypeColor } from '../utils/pokemonApi';
import AnimatedDot from './MicroInteractions'; // Assuming MicroInteractions.tsx exists

interface SpritesBoxProps {
  pokemon: Pokemon;
  isActive: boolean; // To know if it's the focused item
}

const SpritesBox: React.FC<SpritesBoxProps> = ({ pokemon, isActive }) => {
  const typeColor = getTypeColor(pokemon.types[0].type.name);

  return (
    <motion.div
      className="bento-box p-4 w-full h-full overflow-hidden flex flex-col"
      layout // Enable layout animation
    >
      <motion.h3
        className="text-lg font-bold mb-2 flex items-center flex-shrink-0"
        style={{ color: typeColor }}
        layout="position"
      >
        <AnimatedDot color={typeColor} />
        <span className="ml-2">Sprites</span>
      </motion.h3>
      <motion.div className="grid grid-cols-2 gap-2 sm:gap-4 flex-grow items-center justify-center" layout>
        {pokemon.sprites.front_default && (
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={`${pokemon.name} front`}
              className="w-16 h-16 object-contain pixelated" // Added pixelated
              loading="lazy"
            />
            <span className="text-xs mt-1 text-gray-300">Front</span>
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
              className="w-16 h-16 object-contain pixelated" // Added pixelated
              loading="lazy"
            />
            <span className="text-xs mt-1 text-gray-300">Back</span>
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
              className="w-16 h-16 object-contain pixelated" // Added pixelated
              loading="lazy"
            />
            <span className="text-xs mt-1 text-gray-300">Shiny Front</span>
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
              className="w-16 h-16 object-contain pixelated" // Added pixelated
              loading="lazy"
            />
            <span className="text-xs mt-1 text-gray-300">Shiny Back</span>
          </motion.div>
        )}
      </motion.div>
       {/* Can add expanded content here based on isActive */}
       {isActive && (
           <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="mt-3 pt-2 border-t border-gray-700/50 text-center text-xs text-gray-400"
            >
               Official game sprites.
           </motion.div>
       )}
    </motion.div>
  );
};

export default SpritesBox;