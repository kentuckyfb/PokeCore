// components/QuickFactsBox.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { getTypeColor } from '../utils/pokemonApi';
import AnimatedDot from './MicroInteractions'; // Assuming MicroInteractions.tsx exists

interface QuickFactsBoxProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  isActive: boolean; // To know if it's the focused item
}

const QuickFactsBox: React.FC<QuickFactsBoxProps> = ({ pokemon, species, isActive }) => {
  const typeColor = getTypeColor(pokemon.types[0].type.name);
  const generation = species.generation ? species.generation.name.split('-')[1].toUpperCase() : '?';

  return (
    <motion.div
      className="bento-box p-4 w-full h-full overflow-hidden flex flex-col"
      layout // Enable layout animation
    >
      <motion.h3
        className="text-lg font-bold mb-3 flex items-center flex-shrink-0"
        style={{ color: typeColor }}
        layout="position"
      >
        <AnimatedDot color={typeColor} delay={0.1} />
        <span className="ml-2">Quick Facts</span>
      </motion.h3>
      <motion.ul className="space-y-2 text-sm flex-grow" layout>
        <motion.li className="flex items-start">
          <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} />
          <span>Pokédex #: {pokemon.id}</span>
        </motion.li>
        <motion.li className="flex items-start">
           <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} />
           <span>Species: {species.genera?.find(g => g.language.name === 'en')?.genus ?? 'Unknown'}</span>
        </motion.li>
         <motion.li className="flex items-start">
             <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} />
             <span>Generation: {generation}</span>
         </motion.li>
        <motion.li className="flex items-start">
          <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} />
          <span>Base Happiness: {species.base_happiness ?? 'N/A'}</span>
        </motion.li>
        <motion.li className="flex items-start">
          <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} />
          <span>Capture Rate: {species.capture_rate ?? 'N/A'}/255</span>
        </motion.li>
      </motion.ul>
       {/* Can add expanded content here based on isActive */}
       {isActive && (
           <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="mt-3 pt-2 border-t border-gray-700/50 text-center text-xs text-gray-400"
           >
               Key identifying information.
           </motion.div>
       )}
    </motion.div>
  );
};

export default QuickFactsBox;