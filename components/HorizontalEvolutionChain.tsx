// components/HorizontalEvolutionChain.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PokemonSpecies } from '../types/pokemon';
import { getTypeColor } from '../utils/pokemonApi';

// Interface for a processed evolution stage
interface EvolutionStage {
  name: string;
  speciesUrl: string;
  minLevel: number | null;
  trigger: string | null;
  item: string | null;
  sprite?: string;
}

interface HorizontalEvolutionChainProps {
  species: PokemonSpecies;
  loadPokemon: (nameOrId: string | number) => void;
  currentPokemonName: string;
}

// Helper function to recursively parse the evolution chain
const parseEvolutionChain = (chainData: any): EvolutionStage[][] => {
  const stages: EvolutionStage[][] = [];
  
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
      const details = node.evolution_details[0];
      stage.minLevel = details.min_level;
      stage.trigger = details.trigger?.name;
      stage.item = details.item?.name;
    }

    // Add stage to the current level
    if (!stages[level]) {
       stages[level] = [];
    }
    stages[level].push(stage);

    // Recursively parse children
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((nextNode: any) => {
         parseNode(nextNode, level + 1);
      });
    }
  };

  parseNode(chainData, 0);
  return stages.filter(level => level && level.length > 0);
};

// Helper to fetch sprite
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

const HorizontalEvolutionChain: React.FC<HorizontalEvolutionChainProps> = ({ 
  species, 
  loadPokemon, 
  currentPokemonName 
}) => {
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
      setEvolutionStages([]);

      try {
        const response = await axios.get(species.evolution_chain.url);
        const parsedStages = parseEvolutionChain(response.data.chain);
        
        // Fetch sprites for better visualization
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
      } catch (err) {
        console.error('Failed to fetch or process evolution chain:', err);
        setError('Could not load evolution chain.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessChain();
  }, [species.evolution_chain?.url]);

  if (loading) {
    return <p className="text-xs text-gray-400 text-center p-2">Loading Evolution Chain...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 text-center p-2">{error}</p>;
  }

  if (evolutionStages.length === 0 || (evolutionStages.length === 1 && evolutionStages[0].length <= 1)) {
    return <p className="text-xs text-gray-400 text-center p-2">This Pokémon does not evolve.</p>;
  }

  return (
    <div className="flex items-center">
      {evolutionStages.map((level, levelIndex) => (
        <React.Fragment key={`level-${levelIndex}`}>
          {/* Stages within the same level */}
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
                    ? 'bg-gray-700/50 ring-2 ring-gray-500'
                    : 'hover:bg-gray-700/30'
                }`}
                title={`Load ${stage.name}`}
                disabled={stage.name === currentPokemonName}
              >
                {stage.sprite ? (
                  <img src={stage.sprite} alt={stage.name} className="w-16 h-16 object-contain pixelated" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-full text-xs text-gray-400">
                    ?
                  </div>
                )}
                <span className="mt-1 text-xs text-center text-white capitalize">{stage.name}</span>
                {stage.trigger && (
                  <span className="mt-0.5 text-[10px] text-gray-400 capitalize">
                    {stage.trigger.replace('-', ' ')}
                    {stage.minLevel ? ` Lvl ${stage.minLevel}` : ''}
                    {stage.item ? ` w/ ${stage.item.replace('-', ' ')}` : ''}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Arrow connecting levels */}
          {levelIndex < evolutionStages.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: levelIndex * 0.2 }}
              className="text-gray-500 text-2xl font-light mx-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HorizontalEvolutionChain;