// components/InteractivePokemonLayout.tsx
'use client';
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import EnhancedPokemonCard from './EnhancedPokemonCard';
import BentoBoxes from './BentoBoxes';
import { getTypeColor } from '../utils/pokemonApi';
// Import the new components
import PokemonRelationshipGraph from './PokemonRelationshipGraph';

// Define the structure for each layout item
interface LayoutItemState {
  id: string;
  position: { x: string; y: string; zIndex: number };
  defaultPosition: { x: string; y: string; zIndex: number };
  component: React.ReactNode;
  isCenter: boolean;
}

interface InteractivePokemonLayoutProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  loadPokemon: (nameOrId: string | number) => void; // Add loadPokemon prop
}

export interface InteractiveLayoutRef {
  resetToDefaultPositions: () => void;
}

// --- Separate Helper Components (Moved from previous implementation for clarity) ---
// SpritesBox Component (ensure this exists or paste code here)
const SpritesBox: React.FC<{ pokemon: Pokemon; typeColor: string }> = ({ pokemon, typeColor }) => (
    <motion.div className="bento-box p-4 w-full h-full" /* ... */ >
        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>{/* ... icon */} Sprites</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {/* ... sprite images ... */}
            {pokemon.sprites.front_default && (<motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}><img src={pokemon.sprites.front_default} className="w-16 h-16 obj-contain" alt="front"/><span className="text-xs mt-1 text-gray-300">Front</span></motion.div>)}
            {pokemon.sprites.back_default && (<motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}><img src={pokemon.sprites.back_default} className="w-16 h-16 obj-contain" alt="back"/><span className="text-xs mt-1 text-gray-300">Back</span></motion.div>)}
            {pokemon.sprites.front_shiny && (<motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}><img src={pokemon.sprites.front_shiny} className="w-16 h-16 obj-contain" alt="shiny front"/><span className="text-xs mt-1 text-gray-300">Shiny Front</span></motion.div>)}
            {pokemon.sprites.back_shiny && (<motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}><img src={pokemon.sprites.back_shiny} className="w-16 h-16 obj-contain" alt="shiny back"/><span className="text-xs mt-1 text-gray-300">Shiny Back</span></motion.div>)}
        </div>
    </motion.div>
);

// QuickFactsBox Component (ensure this exists or paste code here)
const QuickFactsBox: React.FC<{ pokemon: Pokemon; species: PokemonSpecies; typeColor: string }> = ({ pokemon, species, typeColor }) => (
    <motion.div className="bento-box p-4 w-full h-full" /* ... */ >
        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>{/* ... icon */} Quick Facts</h3>
        <ul className="space-y-2 text-sm">
            {/* ... fact list items ... */}
             <motion.li className="flex items-start"><motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} /*...*/ /><span>Pokédex #: {pokemon.id}</span></motion.li>
             <motion.li className="flex items-start"><motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} /*...*/ /><span>Generation: {Math.ceil(pokemon.id / 151)}</span></motion.li>
             <motion.li className="flex items-start"><motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} /*...*/ /><span>Base Happiness: {species.base_happiness ?? 'N/A'}</span></motion.li>
             <motion.li className="flex items-start"><motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{backgroundColor: typeColor}} /*...*/ /><span>Capture Rate: {species.capture_rate ?? 'N/A'}/255</span></motion.li>
        </ul>
    </motion.div>
);
// --- End Helper Components ---

const InteractivePokemonLayout = forwardRef<InteractiveLayoutRef, InteractivePokemonLayoutProps>(({
  pokemon,
  species,
  loadPokemon // Receive loadPokemon prop
}, ref) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string>('card');
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Define Layout Items with Fixed Positions (using rem) ---
  const cardWidthEstimateRem = 20;
  const bentoWidthEstimateRem = 32;
  const sideBoxWidthEstimateRem = 20;
  const graphWidthEstimateRem = 30; // Estimate for graph container

  const horizontalOffsetCardToBento = `-${(cardWidthEstimateRem / 2 + bentoWidthEstimateRem / 2 + 3)}rem`; // Increased gap
  const horizontalOffsetCardToSide = `${(cardWidthEstimateRem / 2 + sideBoxWidthEstimateRem / 2 + 3)}rem`;
  // Position graph above Bento
  const horizontalOffsetCardToGraph = horizontalOffsetCardToBento;
  const verticalOffsetGraph = '-26rem'; // Adjust as needed
  const verticalOffsetSide = '13rem'; // Increased gap

  const initialLayoutItems: Omit<LayoutItemState, 'component' | 'isCenter'>[] = [
    {
      id: 'card',
      position: { x: '0rem', y: '0rem', zIndex: 100 },
      defaultPosition: { x: '0rem', y: '0rem', zIndex: 100 },
    },
    {
      id: 'bento',
      position: { x: horizontalOffsetCardToBento, y: '0rem', zIndex: 10 },
      defaultPosition: { x: horizontalOffsetCardToBento, y: '0rem', zIndex: 10 },
    },
     { // NEW: Graph Item
      id: 'graph',
      position: { x: horizontalOffsetCardToGraph, y: verticalOffsetGraph, zIndex: 5 },
      defaultPosition: { x: horizontalOffsetCardToGraph, y: verticalOffsetGraph, zIndex: 5 },
    },
    {
      id: 'sprites',
      position: { x: horizontalOffsetCardToSide, y: `-${verticalOffsetSide}`, zIndex: 10 },
      defaultPosition: { x: horizontalOffsetCardToSide, y: `-${verticalOffsetSide}`, zIndex: 10 },
    },
    {
      id: 'facts',
      position: { x: horizontalOffsetCardToSide, y: verticalOffsetSide, zIndex: 10 },
      defaultPosition: { x: horizontalOffsetCardToSide, y: verticalOffsetSide, zIndex: 10 },
    },
  ];

  // Function to create components
  const createComponent = useCallback((
    id: string,
    currentPokemon: Pokemon,
    currentSpecies: PokemonSpecies,
    currentTypeColor: string,
    currentActiveId: string,
    currentFlipState: boolean,
    loadPokemonFn: (nameOrId: string | number) => void // Ensure loadPokemon is passed
  ) => {
    switch (id) {
      case 'card':
        const shouldBeFlipped = id === currentActiveId ? currentFlipState : false;
        return (
          <EnhancedPokemonCard
            pokemon={currentPokemon} species={currentSpecies} isFlipped={shouldBeFlipped}
            onFlip={() => { if (currentActiveId === 'card') setIsCardFlipped(f => !f); }}
            typeColor={currentTypeColor}
          /> );
      case 'bento':
        // Pass loadPokemon down to BentoBoxes
        return <BentoBoxes pokemon={currentPokemon} species={currentSpecies} loadPokemon={loadPokemonFn} />;
      case 'graph': // NEW: Render Graph
        return <PokemonRelationshipGraph pokemon={currentPokemon} species={currentSpecies} loadPokemon={loadPokemonFn} />;
      case 'sprites':
        return <SpritesBox pokemon={currentPokemon} typeColor={currentTypeColor} />;
      case 'facts':
        return <QuickFactsBox pokemon={currentPokemon} species={currentSpecies} typeColor={currentTypeColor} />;
      default: return null;
    }
  }, []); // Empty dependency array for useCallback, as internal logic depends on args

  // State for Layout Items
  const [layoutItems, setLayoutItems] = useState<LayoutItemState[]>(() => {
    const initialTypeColor = getTypeColor(pokemon.types[0].type.name);
    return initialLayoutItems.map(item => ({
      ...item,
      isCenter: item.id === 'card',
      component: createComponent(item.id, pokemon, species, initialTypeColor, 'card', false, loadPokemon)
    }));
  });

  // Update components if pokemon/species changes
   useEffect(() => {
    const newTypeColor = getTypeColor(pokemon.types[0].type.name);
    setLayoutItems(prevItems =>
      initialLayoutItems.map(itemConfig => ({
        ...itemConfig,
        isCenter: itemConfig.id === 'card',
        component: createComponent(itemConfig.id, pokemon, species, newTypeColor, 'card', false, loadPokemon)
      }))
    );
    setActiveItemId('card');
    setIsCardFlipped(false);
  }, [pokemon, species, createComponent, loadPokemon]); // Add dependencies


  // Reset Function
  const resetToDefaultPositions = useCallback(() => {
    const currentTypeColor = getTypeColor(pokemon.types[0].type.name);
    setLayoutItems(
      initialLayoutItems.map(itemConfig => ({
        ...itemConfig,
        isCenter: itemConfig.id === 'card',
        component: createComponent(itemConfig.id, pokemon, species, currentTypeColor, 'card', false, loadPokemon)
      }))
    );
    setActiveItemId('card');
    setIsCardFlipped(false);
  }, [pokemon, species, createComponent, loadPokemon]); // Add dependencies

  useImperativeHandle(ref, () => ({
    resetToDefaultPositions
  }));

  // Handle Click/Swap
  const handleItemClick = (clickedItemId: string) => {
    if (clickedItemId === activeItemId) {
       if (clickedItemId === 'card') setIsCardFlipped(f => !f);
       return;
    }
    const activeItem = layoutItems.find(item => item.id === activeItemId);
    const clickedItem = layoutItems.find(item => item.id === clickedItemId);
    if (!activeItem || !clickedItem) return;

    setLayoutItems(prevItems =>
      prevItems.map(item => {
        if (item.id === activeItemId) return { ...item, position: clickedItem.defaultPosition, isCenter: false };
        if (item.id === clickedItemId) return { ...item, position: activeItem.defaultPosition, isCenter: true };
        return item;
      })
    );
    setActiveItemId(clickedItemId);
    if (clickedItemId !== 'card') setIsCardFlipped(false);
  };

  // Render Layout
  return (
    <div ref={containerRef} className="relative w-full h-full">
      <AnimatePresence>
        {layoutItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            className={`absolute cursor-pointer flex justify-center items-center
                        ${item.id === 'card' ? 'w-full max-w-xs' : ''}
                        ${item.id === 'bento' ? 'w-[90%] max-w-lg' : ''}
                        ${item.id === 'graph' ? 'w-[90%] max-w-md h-80' : ''} /* Specific size for graph */
                        ${item.id === 'sprites' || item.id === 'facts' ? 'w-[90%] max-w-xs' : ''}
                       `}
            initial={false}
            animate={{
              x: item.position.x, y: item.position.y, zIndex: item.position.zIndex,
              opacity: item.isCenter ? 1 : 0.85, filter: item.isCenter ? 'brightness(1)' : 'brightness(0.9)',
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            onClick={() => handleItemClick(item.id)}
            whileHover={!item.isCenter ? { scale: 1.03, opacity: 1, filter: 'brightness(1)', zIndex: item.position.zIndex + 5 } : {}}
            style={{ left: '50%', top: '50%' }}
          >
            <div className="w-full h-full">
              {item.component}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

InteractivePokemonLayout.displayName = 'InteractivePokemonLayout';
export default InteractivePokemonLayout;