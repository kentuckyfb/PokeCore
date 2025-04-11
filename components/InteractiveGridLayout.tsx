// components/InteractiveGridLayout.tsx
'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';

// Import the components that will be placed in the grid
import EnhancedPokemonCard from './EnhancedPokemonCard';
import BentoBoxes from './BentoBoxes';
import SpritesBox from './SpritesBox';
import QuickFactsBox from './QuickFactsBox';
import { getTypeColor } from '@/utils/pokemonApi';

interface InteractiveGridLayoutProps {
  pokemon: Pokemon;
  species: PokemonSpecies;
  loadPokemon: (nameOrId: string | number) => void;
}

interface GridItemConfig {
  id: string;
  component: React.FC<{ pokemon: Pokemon; species: PokemonSpecies; isActive: boolean; loadPokemon: (nameOrId: string | number) => void }>; // Component type
  defaultArea: string; // CSS Grid Area name
}

// Define Grid Areas (must match CSS)
const gridAreas = {
  center: 'center',
  topLeft: 'topLeft',
  bottomLeft: 'bottomLeft',
  topRight: 'topRight',
  bottomRight: 'bottomRight',
};

const InteractiveGridLayout: React.FC<InteractiveGridLayoutProps> = ({ pokemon, species, loadPokemon }) => {
  const [activeItemId, setActiveItemId] = useState<string>('card');
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false); // State for card flip, managed here

  // Function to handle card flip, only works if card is active
  const handleCardFlip = useCallback(() => {
    if (activeItemId === 'card') {
      setIsCardFlipped(prev => !prev);
    }
  }, [activeItemId]);


  // Define the items that will populate the grid
  // Use useMemo to prevent redefining components on every render unless pokemon/species changes
  const gridItems = useMemo<GridItemConfig[]>(() => [
    {
      id: 'card',
      // Wrap EnhancedPokemonCard to accept consistent props and handle flip state
      component: ({ pokemon, species, isActive }) => (
        <EnhancedPokemonCard
          pokemon={pokemon}
          species={species}
          isFlipped={isActive ? isCardFlipped : false} // Use local flip state only when active
          onFlip={handleCardFlip} // Use the layout's flip handler
          typeColor={getTypeColor(pokemon.types[0].type.name)}
        />
      ),
      defaultArea: gridAreas.center,
    },
    {
      id: 'bento',
      component: ({ pokemon, species, isActive, loadPokemon }) => <BentoBoxes pokemon={pokemon} species={species} loadPokemon={loadPokemon} /* Pass isActive if Bento needs it */ />,
      defaultArea: gridAreas.topLeft,
    },
    {
      id: 'sprites',
      component: ({ pokemon, species, isActive }) => <SpritesBox pokemon={pokemon} isActive={isActive} />,
      defaultArea: gridAreas.topRight,
    },
    {
      id: 'facts',
      component: ({ pokemon, species, isActive }) => <QuickFactsBox pokemon={pokemon} species={species} isActive={isActive} />,
      defaultArea: gridAreas.bottomRight,
    },
     {
      id: 'placeholder', // Add a placeholder if you only have 4 items for a 3x3-like grid
      component: () => <div className="bento-box opacity-50 flex items-center justify-center text-gray-600 text-sm h-full">Empty Slot</div>,
      defaultArea: gridAreas.bottomLeft,
     },
  ], [isCardFlipped, handleCardFlip]); // Re-memoize if flip state/handler changes

   // Reset active item and flip state when pokemon changes
   useEffect(() => {
      setActiveItemId('card');
      setIsCardFlipped(false);
   }, [pokemon]);


  // Determine the current grid area for each item based on the active item
  const getItemGridArea = useCallback((itemId: string): string => {
    const activeItemConfig = gridItems.find(item => item.id === activeItemId);
    const currentItemConfig = gridItems.find(item => item.id === itemId);

    if (!activeItemConfig || !currentItemConfig) return gridAreas.center; // Should not happen

    if (itemId === activeItemId) {
      return gridAreas.center; // The active item always goes to the center
    }
    if (itemId === activeItemConfig.id) {
        // This case should be covered by the one above, but for clarity:
        return gridAreas.center;
    }
    // If the current item's default position *was* the center, it needs to move to where the *new* active item came from.
    if (currentItemConfig.defaultArea === gridAreas.center) {
      return activeItemConfig.defaultArea;
    }
    // Otherwise, the item stays in its default position
    return currentItemConfig.defaultArea;
  }, [activeItemId, gridItems]);

  // Handle clicking an item to make it active
  const handleItemClick = (clickedItemId: string) => {
     // If clicking the already active card, trigger flip
     if (clickedItemId === 'card' && activeItemId === 'card') {
       handleCardFlip();
       return; // Don't change active item
     }
     // If clicking any other item (or the inactive card)
    if (clickedItemId !== activeItemId) {
      setActiveItemId(clickedItemId);
      // If the card is no longer active, ensure it's not flipped
      if (clickedItemId !== 'card') {
         setIsCardFlipped(false);
      }
    }
    // If clicking an active non-card item, do nothing for now (could toggle internal expansion)
  };

  const spring = {
    type: "spring",
    stiffness: 150, // Slightly stiffer for quicker response
    damping: 20,   // Good damping to avoid oscillation
    // mass: 0.5 // Optional: Adjust mass
  };

  return (
    <div
      className="interactive-grid-layout p-4" // Add class for styling
      style={{
        display: 'grid',
        gridTemplateAreas: `
          "topLeft    topLeft     topRight"
          "center     center      center"
          "bottomLeft bottomLeft  bottomRight"
        `,
        gridTemplateColumns: '1fr 1.2fr 1fr', // Center column slightly wider
        gridTemplateRows: 'auto 1fr auto', // Center row takes remaining space
        gap: '1rem', // Gap between grid items
        height: 'calc(100vh - 180px)', // Adjust height based on Header/Footer approx height
        maxHeight: '800px', // Max height to prevent excessive stretching
        minHeight: '600px', // Min height
        perspective: '1500px', // For 3D effects if needed later
      }}
    >
      <AnimatePresence>
        {gridItems.map((item) => {
          const Component = item.component;
          const isActive = item.id === activeItemId;
          const currentGridArea = getItemGridArea(item.id);

          // Conditional scaling and opacity
           const scale = isActive ? 1 : 0.95;
           const opacity = isActive ? 1 : 0.75;
           const zIndex = isActive ? 100 : 10;
           const filter = isActive ? 'brightness(1)' : 'brightness(0.85)';

          return (
            <motion.div
              key={item.id}
              layout // THIS IS KEY for the animation
              transition={spring}
              className={`grid-item ${isActive ? 'active' : ''}`} // Add classes for potential styling
              style={{
                gridArea: currentGridArea, // Assign to CSS grid area
                cursor: 'pointer',
                position: 'relative', // Needed for zIndex to work reliably with layout animations
                zIndex: zIndex,
                // Contain the component within the grid cell, allow overflow if needed
                // minHeight: 0, // Helps flexbox/grid calculation in children
              }}
              onClick={() => handleItemClick(item.id)}
              initial={false} // Don't animate on initial load unless needed
               animate={{ scale, opacity, filter }}
               whileHover={!isActive ? { scale: 0.98, opacity: 0.9, filter: 'brightness(0.95)', zIndex: 50 } : {}} // Hover effect for inactive items
            >
              {/* Render the actual component */}
              <Component
                pokemon={pokemon}
                species={species}
                isActive={isActive} // Pass active state down
                loadPokemon={loadPokemon} // Pass loadPokemon down
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveGridLayout;