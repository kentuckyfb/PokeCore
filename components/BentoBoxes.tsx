// components/BentoBoxes.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { getTypeColor, capitalize, formatStatName } from '../utils/pokemonApi';
// Import new components
import StatRadarChart from './StatRadarChart';
import EvolutionChainDisplay from './EvolutionChainDisplay';

interface BentoBoxesProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  loadPokemon: (nameOrId: string | number) => void; // Receive loadPokemon
}

// --- PLACEHOLDER HELPERS ---
// Replace these with actual implementations or data fetching
const getAbilityDescription = (abilityName: string): string => {
   // In a real app, fetch this from PokeAPI ability endpoint or have a local map
   const descriptions: { [key: string]: string } = {
       'static': '30% chance to paralyze attacker on contact.',
       'lightning-rod': 'Draws Electric moves, nullifies damage, raises Sp. Atk.',
       'blaze': 'Powers up Fire moves in a pinch.',
       'overgrow': 'Powers up Grass moves in a pinch.',
       'torrent': 'Powers up Water moves in a pinch.',
       // Add more common abilities
   };
   return descriptions[abilityName.toLowerCase().replace(' ', '-')] || 'No description available.';
};

// Placeholder for type effectiveness calculation
// In a real app, you'd have a full type chart map
const calculateDefensiveEffectiveness = (types: { type: { name: string } }[]): { weak: string[], resist: string[], immune: string[] } => {
    // THIS IS A VERY SIMPLIFIED EXAMPLE - NEEDS A REAL TYPE CHART
    const primaryType = types[0]?.type.name;
    if (primaryType === 'electric') return { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] };
    if (primaryType === 'fire') return { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] };
    if (primaryType === 'water') return { weak: ['grass', 'electric'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] };
    if (primaryType === 'grass') return { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'grass', 'electric', 'ground'], immune: [] };
    // Default fallback
    return { weak: ['fighting'], resist: [], immune: [] };
}
// --- END PLACEHOLDERS ---


const BentoBoxes: React.FC<BentoBoxesProps> = ({ pokemon, species, loadPokemon }) => {
  const [expandedBox, setExpandedBox] = useState<string | null>(null);
  const [hoveredAbility, setHoveredAbility] = useState<string | null>(null); // State for tooltip

  // Get English description
  const getEnglishDescription = () => {
    const englishEntry = species.flavor_text_entries?.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') : 'No description available.';
  };

  // Calculate type effectiveness (using placeholder)
  const effectiveness = calculateDefensiveEffectiveness(pokemon.types);

  const handleBoxClick = (boxId: string) => {
    setExpandedBox(expandedBox === boxId ? null : boxId);
  };

  const typeColor = getTypeColor(pokemon.types[0].type.name);

  return (
    // Increased gap for better spacing
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">

      {/* Description Box */}
      <motion.div className="bento-box p-4 sm:col-span-2" /* ... */ layout>
        <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
          <motion.span className="w-2 h-2 mr-2 rounded-full" style={{backgroundColor: typeColor}} /*...*/ layout/> Description
        </motion.h3>
        <motion.p className="text-white text-sm leading-relaxed" layout> {getEnglishDescription()} </motion.p>
        {/* Optional expanded section remains the same */}
      </motion.div>

      {/* Physical Attributes Box */}
      <motion.div className="bento-box p-4" /* ... */ layout>
         <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
           <motion.span className="w-2 h-2 mr-2 rounded-full" style={{backgroundColor: typeColor}} /*...*/ layout/> Physical
         </motion.h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><p className="text-gray-400">Height</p><p className="text-white font-medium">{(pokemon.height / 10).toFixed(1)} m</p></div>
          <div><p className="text-gray-400">Weight</p><p className="text-white font-medium">{(pokemon.weight / 10).toFixed(1)} kg</p></div>
        </div>
         {/* Optional expanded section remains the same */}
      </motion.div>

      {/* Abilities Box w/ Tooltips */}
      <motion.div className="bento-box p-4" /* ... */ layout>
         <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
            <motion.span className="w-2 h-2 mr-2 rounded-full" style={{backgroundColor: typeColor}} /*...*/ layout/> Abilities
         </motion.h3>
        <ul className="space-y-2">
          {pokemon.abilities.map((abilityInfo) => (
            <motion.li
              key={abilityInfo.ability.name}
              className="relative flex items-center cursor-help" // Added cursor-help
              onHoverStart={() => setHoveredAbility(abilityInfo.ability.name)}
              onHoverEnd={() => setHoveredAbility(null)}
            >
              <motion.span className="w-1.5 h-1.5 mr-2 rounded-full" style={{ backgroundColor: typeColor }} />
              <span className="text-white">{capitalize(abilityInfo.ability.name.replace('-', ' '))}</span>
              {abilityInfo.is_hidden && <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">Hidden</span>}
              {/* Tooltip */}
              <AnimatePresence>
                {hoveredAbility === abilityInfo.ability.name && (
                  <motion.div
                    layout // Animate layout changes for tooltip
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-950 text-xs text-white rounded-md shadow-lg z-20 w-max max-w-[200px] border border-gray-700 text-center pointer-events-none" // Ensure pointer-events none
                  >
                    {getAbilityDescription(abilityInfo.ability.name)}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
         {/* Optional expanded section remains the same */}
      </motion.div>

      {/* Stats Box (Using Radar Chart) */}
      <motion.div className="bento-box p-4 sm:col-span-2" /* ... */ layout>
        <motion.h3 className="text-lg font-bold mb-1 flex items-center" style={{ color: typeColor }} layout>
           <motion.span className="w-2 h-2 mr-2 rounded-full" style={{backgroundColor: typeColor}} /*...*/ layout/> Base Stats
        </motion.h3>
        {/* Replace linear bars with Radar Chart */}
        <div className="mt-0 h-64"> {/* Give radar chart container height */}
          <StatRadarChart pokemon={pokemon} typeColor={typeColor} />
        </div>
         {/* Optional expanded section remains the same - maybe show total stat here */}
         <AnimatePresence>
           {expandedBox === 'stats' && (
             <motion.div /* ... */ className="mt-1 pt-1 border-t border-gray-700/50">
               <p className="text-xs text-gray-400 text-center">Total: {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}</p>
             </motion.div>
           )}
         </AnimatePresence>
      </motion.div>

      {/* Evolution Chain Box (Replaces Details) */}
      <motion.div className="bento-box p-3 sm:col-span-2" /* ... */ layout>
         <motion.h3 className="text-lg font-bold mb-1 flex items-center" style={{ color: typeColor }} layout>
             <motion.span className="w-2 h-2 mr-2 rounded-full" style={{backgroundColor: typeColor}} /*...*/ layout/> Evolution Chain
         </motion.h3>
         <EvolutionChainDisplay
            species={species}
            loadPokemon={loadPokemon} // Pass the function down
            currentPokemonName={pokemon.name}
         />
      </motion.div>

       {/* NEW: Type Effectiveness Box (Conceptual) */}
       <motion.div className="bento-box p-4 sm:col-span-2" /* ... */ layout>
         <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
           <motion.span className="w-2 h-2 mr-2 rounded-full" style={{backgroundColor: typeColor}} /*...*/ layout/> Type Matchups
         </motion.h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
             {/* Weaknesses */}
             <div>
                 <h4 className="font-semibold mb-1 text-red-400">Weak To (x2):</h4>
                 {effectiveness.weak.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {effectiveness.weak.map(type => <span key={type} className="px-1.5 py-0.5 rounded text-white text-[10px] shadow" style={{backgroundColor: getTypeColor(type)}}>{capitalize(type)}</span>)}
                    </div>
                 ) : <span className="text-gray-400">None</span>}
             </div>
              {/* Resistances */}
             <div>
                 <h4 className="font-semibold mb-1 text-green-400">Resists (x0.5):</h4>
                 {effectiveness.resist.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {effectiveness.resist.map(type => <span key={type} className="px-1.5 py-0.5 rounded text-white text-[10px] shadow" style={{backgroundColor: getTypeColor(type)}}>{capitalize(type)}</span>)}
                    </div>
                 ) : <span className="text-gray-400">None</span>}
             </div>
             {/* Immunities */}
              <div>
                 <h4 className="font-semibold mb-1 text-gray-300">Immune To (x0):</h4>
                 {effectiveness.immune.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {effectiveness.immune.map(type => <span key={type} className="px-1.5 py-0.5 rounded text-white text-[10px] shadow" style={{backgroundColor: getTypeColor(type)}}>{capitalize(type)}</span>)}
                    </div>
                 ) : <span className="text-gray-400">None</span>}
             </div>
         </div>
          <p className="text-[10px] text-gray-500 mt-2">*Based on primary type only (simplified example).</p>
       </motion.div>

    </div> // End grid
  );
};

export default BentoBoxes;