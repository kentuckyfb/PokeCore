// components/EvolutionChainDisplay.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PokemonSpecies } from '../types/pokemon'; // Only species needed initially
import { getTypeColor } from '../utils/pokemonApi'; // For potential styling

// Interface for a processed evolution stage
interface EvolutionStage {
  name: string;
  speciesUrl: string;
  minLevel: number | null;
  trigger: string | null;
  item: string | null;
  sprite?: string; // Optional: To store fetched sprite
}

interface EvolutionChainDisplayProps {
  species: PokemonSpecies;
  loadPokemon: (nameOrId: string | number) => void; // Function to load a selected Pokémon
  currentPokemonName: string; // To highlight the current one
}

// Helper function to recursively parse the API's chain structure
const parseEvolutionChain = (chainData: any): EvolutionStage[][] => {
  const stages: EvolutionStage[][] = [];
  let currentLevelStages: EvolutionStage[] = [];

  const parseNode = (node: any, level: number) => {
    const stage: EvolutionStage = {
      name: node.species.name,
      speciesUrl: node.species.url,
      minLevel: null,
      trigger: null,
      item: null,
    };

    // Extract evolution details if they exist
    if (node.evolution_details && node.evolution_details.length > 0) {
      const details = node.evolution_details[0]; // Usually just one detail set per node
      stage.minLevel = details.min_level;
      stage.trigger = details.trigger?.name;
      stage.item = details.item?.name;
      // Add more details here (time_of_day, gender, location, etc.) if needed
    }

    // Add stage to the current level
    if (!stages[level]) {
       stages[level] = [];
    }
    stages[level].push(stage);


    // Recursively parse children
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((nextNode: any) => {
         parseNode(nextNode, level + 1); // Go to next level
      });
    }
  };

  parseNode(chainData, 0); // Start parsing from the root
  return stages.filter(level => level && level.length > 0); // Remove empty levels
};

// Helper to fetch sprite (optional, can be slow)
const fetchSprite = async (speciesUrl: string): Promise<string | undefined> => {
   try {
      const speciesId = speciesUrl.split('/').filter(Boolean).pop();
      if (!speciesId) return undefined;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesId}`);
      return response.data.sprites?.front_default;
   } catch (error) {
      console.error("Error fetching sprite for evolution chain:", error);
      return undefined;
   }
}

const EvolutionChainDisplay: React.FC<EvolutionChainDisplayProps> = ({ species, loadPokemon, currentPokemonName }) => {
  const [evolutionStages, setEvolutionStages] = useState<EvolutionStage[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessChain = async () => {
      if (!species.evolution_chain?.url) {
        setError('Evolution chain URL not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setEvolutionStages([]); // Clear previous stages

      try {
        const response = await axios.get(species.evolution_chain.url);
        const parsedStages = parseEvolutionChain(response.data.chain);

        // --- OPTIONAL: Fetch sprites for each stage ---
        // This adds multiple API calls, potentially slowing things down.
        // Consider doing this only if needed or adding loading indicators per sprite.
        /*
        const stagesWithSprites = await Promise.all(
          parsedStages.map(async (level) =>
            Promise.all(
              level.map(async (stage) => ({
                ...stage,
                sprite: await fetchSprite(stage.speciesUrl),
              }))
            )
          )
        );
        setEvolutionStages(stagesWithSprites);
        */
        // --- END OPTIONAL ---

        // Use stages without sprites for faster loading:
        setEvolutionStages(parsedStages);

      } catch (err) {
        console.error('Failed to fetch or process evolution chain:', err);
        setError('Could not load evolution chain.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessChain();
  }, [species.evolution_chain?.url]); // Re-run if the evolution chain URL changes

  if (loading) {
    return <p className="text-xs text-gray-400 text-center p-4">Loading Evolution Chain...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 text-center p-4">{error}</p>;
  }

  if (evolutionStages.length === 0 || (evolutionStages.length === 1 && evolutionStages[0].length <= 1) ) {
     return <p className="text-xs text-gray-400 text-center p-4">This Pokémon does not evolve.</p>;
  }


  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 p-2">
      {evolutionStages.map((level, levelIndex) => (
        <React.Fragment key={`level-${levelIndex}`}>
          {/* Arrow connecting levels */}
          {levelIndex > 0 && (
            <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: levelIndex * 0.2 }}
               className="text-gray-500 text-2xl font-light mx-1 sm:mx-2"
             >
               →
             </motion.div>
          )}

          {/* Container for stages within the same level (e.g., Eeveelutions) */}
          <div className={`flex ${level.length > 1 ? 'flex-col gap-y-2' : 'items-center'}`}>
             {level.map((stage) => (
               <motion.button
                 key={stage.name}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: levelIndex * 0.2 + 0.1 }}
                 onClick={() => loadPokemon(stage.name)}
                 className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-150 ${
                    stage.name === currentPokemonName
                       ? 'bg-gray-700/50 ring-2 ring-gray-500' // Highlight current
                       : 'hover:bg-gray-700/30'
                 }`}
                 title={`Load ${stage.name}`}
                 disabled={stage.name === currentPokemonName} // Disable button for current
               >
                 {stage.sprite ? (
                   <img src={stage.sprite} alt={stage.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain pixelated" /> // Added pixelated if using sprites
                 ) : (
                    // Placeholder if no sprite fetched
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-700 rounded-full text-xs text-gray-400">
                       ?
                    </div>
                 )}
                 <span className="mt-1 text-xs text-center text-white capitalize">{stage.name}</span>
                 {/* Optional: Display evolution trigger */}
                 {stage.trigger && (
                    <span className="mt-0.5 text-[10px] text-gray-400 capitalize">
                       ({stage.trigger.replace('-', ' ')}
                       {stage.minLevel ? ` Lvl ${stage.minLevel}` : ''}
                       {stage.item ? ` w/ ${stage.item.replace('-', ' ')}` : ''})
                    </span>
                 )}
               </motion.button>
             ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default EvolutionChainDisplay;