// // components/DraggableBentoLayout.tsx
// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence, useDragControls, Reorder } from 'framer-motion';
// import { Pokemon, PokemonSpecies } from '../types/pokemon';
// import PokemonCard from './PokemonCard';
// import BentoBoxes from './BentoBoxes';
// import { getTypeColor } from '../utils/pokemonApi';

// // Add formatStatName function here since it's missing from imports
// const formatStatName = (statName: string): string => {
//   switch (statName) {
//     case 'hp':
//       return 'HP';
//     case 'attack':
//       return 'Attack';
//     case 'defense':
//       return 'Defense';
//     case 'special-attack':
//       return 'Sp. Atk';
//     case 'special-defense':
//       return 'Sp. Def';
//     case 'speed':
//       return 'Speed';
//     default:
//       return statName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
//   }
// };

// interface Position {
//   x: number;
//   y: number;
//   zIndex: number;
// }

// interface BoxState {
//   id: string;
//   position: Position;
//   defaultPosition: Position;
//   content: 'card' | 'info' | 'sprites' | 'quickFacts' | 'description' | 'moves' | 'abilities' | 'stats' | 'details' | 'physical';
//   size: 'small' | 'medium' | 'large';
//   expanded: boolean;
// }

// interface DraggableBentoLayoutProps {
//   pokemon: Pokemon;
//   species: PokemonSpecies;
//   onResetView: () => void;
// }

// const DraggableBentoLayout: React.FC<DraggableBentoLayoutProps> = ({
//   pokemon,
//   species,
//   onResetView
// }) => {
//   // Track positions of all boxes - positions based on the screenshot layout
//   const [boxes, setBoxes] = useState<BoxState[]>([
//     {
//       id: 'card',
//       position: { x: 0, y: 0, zIndex: 100 },
//       defaultPosition: { x: 0, y: 0, zIndex: 100 },
//       content: 'card',
//       size: 'medium',
//       expanded: false
//     },
//     {
//       id: 'description',
//       position: { x: -350, y: -110, zIndex: 10 },
//       defaultPosition: { x: -350, y: -110, zIndex: 10 },
//       content: 'description',
//       size: 'medium',
//       expanded: false
//     },
//     {
//       id: 'physical',
//       position: { x: -350, y: 70, zIndex: 10 },
//       defaultPosition: { x: -350, y: 70, zIndex: 10 },
//       content: 'physical',
//       size: 'small',
//       expanded: false
//     },
//     {
//       id: 'abilities',
//       position: { x: -350, y: 170, zIndex: 10 },
//       defaultPosition: { x: -350, y: 170, zIndex: 10 },
//       content: 'abilities',
//       size: 'small',
//       expanded: false
//     },
//     {
//       id: 'stats',
//       position: { x: -350, y: 280, zIndex: 10 },
//       defaultPosition: { x: -350, y: 280, zIndex: 10 },
//       content: 'stats',
//       size: 'medium',
//       expanded: false
//     },
//     {
//       id: 'details',
//       position: { x: -350, y: 430, zIndex: 10 },
//       defaultPosition: { x: -350, y: 430, zIndex: 10 },
//       content: 'details',
//       size: 'medium',
//       expanded: false
//     },
//     {
//       id: 'sprites',
//       position: { x: 350, y: -40, zIndex: 10 },
//       defaultPosition: { x: 350, y: -40, zIndex: 10 },
//       content: 'sprites',
//       size: 'medium',
//       expanded: false
//     },
//     {
//       id: 'quickFacts',
//       position: { x: 350, y: 170, zIndex: 10 },
//       defaultPosition: { x: 350, y: 170, zIndex: 10 },
//       content: 'quickFacts',
//       size: 'medium',
//       expanded: false
//     }
//   ]);

//   const [isFlipped, setIsFlipped] = useState(false);
//   const [focusedBox, setFocusedBox] = useState<string | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const boxRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       // Ensure boxes stay within visible area when window is resized
//       setBoxes(prevBoxes => {
//         const newBoxes = [...prevBoxes];
//         // Logic to adjust positions based on new window size
//         return newBoxes;
//       });
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Reset view to default positions
//   const resetToDefaultPositions = () => {
//     setBoxes(prevBoxes => 
//       prevBoxes.map(box => ({
//         ...box,
//         position: { ...box.defaultPosition },
//         expanded: false
//       }))
//     );
//     setFocusedBox(null);
//   };

//   // Handle card flip
//   const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//   };

//   // Focus a specific box
//   const handleFocusBox = (boxId: string) => {
//     if (focusedBox === boxId) {
//       // If already focused, unfocus
//       setFocusedBox(null);
      
//       // Return boxes to their positions
//       setBoxes(prevBoxes => 
//         prevBoxes.map(box => ({
//           ...box,
//           position: { ...box.position, zIndex: box.id === 'card' ? 100 : 10 }
//         }))
//       );
//     } else {
//       // Focus the selected box
//       setFocusedBox(boxId);
      
//       // Bring the focused box to center and front
//       setBoxes(prevBoxes => 
//         prevBoxes.map(box => ({
//           ...box,
//           position: { 
//             ...box.position, 
//             zIndex: box.id === boxId ? 200 : 10,
//           },
//           expanded: box.id === boxId
//         }))
//       );
//     }
//   };

//   // Handle drag
//   const handleDragEnd = (boxId: string, info: any) => {
//     setBoxes(prevBoxes => 
//       prevBoxes.map(box => {
//         if (box.id === boxId) {
//           return {
//             ...box,
//             position: {
//               x: box.position.x + info.offset.x,
//               y: box.position.y + info.offset.y,
//               zIndex: boxId === focusedBox ? 200 : box.position.zIndex
//             }
//           };
//         }
//         return box;
//       })
//     );
//   };

//   // Calculate connection lines between boxes and main card
//   const getConnectionPoints = () => {
//     if (!containerRef.current || !boxRefs.current['card']) return [];
    
//     const cardBox = boxRefs.current['card'];
//     if (!cardBox) return [];
    
//     const cardRect = cardBox.getBoundingClientRect();
//     const containerRect = containerRef.current.getBoundingClientRect();
    
//     const cardCenterX = cardRect.left + cardRect.width / 2 - containerRect.left;
//     const cardCenterY = cardRect.top + cardRect.height / 2 - containerRect.top;
    
//     return boxes
//       .filter(box => box.id !== 'card')
//       .map(box => {
//         const boxElement = boxRefs.current[box.id];
//         if (!boxElement) return null;
        
//         const boxRect = boxElement.getBoundingClientRect();
//         const boxCenterX = boxRect.left + boxRect.width / 2 - containerRect.left;
//         const boxCenterY = boxRect.top + boxRect.height / 2 - containerRect.top;
        
//         // Calculate angle for line
//         const angle = Math.atan2(boxCenterY - cardCenterY, boxCenterX - cardCenterX);
        
//         // Calculate edge points instead of center points
//         const cardRadius = Math.min(cardRect.width, cardRect.height) / 2;
//         const boxRadius = Math.min(boxRect.width, boxRect.height) / 2;
        
//         const cardEdgeX = cardCenterX + Math.cos(angle) * cardRadius;
//         const cardEdgeY = cardCenterY + Math.sin(angle) * cardRadius;
        
//         const boxEdgeX = boxCenterX - Math.cos(angle) * boxRadius;
//         const boxEdgeY = boxCenterY - Math.sin(angle) * boxRadius;
        
//         return {
//           id: box.id,
//           start: { x: cardEdgeX, y: cardEdgeY },
//           end: { x: boxEdgeX, y: boxEdgeY },
//           zIndex: box.position.zIndex - 1
//         };
//       })
//       .filter(line => line !== null);
//   };

//   // Generate connection lines
//   const connectionLines = getConnectionPoints();

//   // Render the box content based on type
//   const renderBoxContent = (box: BoxState) => {
//     const typeColor = getTypeColor(pokemon.types[0].type.name);
    
//     switch (box.content) {
//       case 'card':
//         return (
//           <PokemonCard 
//             pokemon={pokemon}
//             species={species}
//             isFlipped={isFlipped}
//             onFlip={handleFlip}
//             typeColor={typeColor}
//           />
//         );
//       case 'sprites':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
//               <motion.span 
//                 className="w-2 h-2 mr-2 rounded-full inline-block"
//                 style={{ backgroundColor: typeColor }}
//                 animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.3 }}
//               />
//               Sprites
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               {pokemon.sprites.front_default && (
//                 <motion.div 
//                   className="flex flex-col items-center"
//                   whileHover={{ scale: 1.1 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <img 
//                     src={pokemon.sprites.front_default} 
//                     alt={`${pokemon.name} front`} 
//                     className="w-16 h-16 object-contain"
//                   />
//                   <span className="text-xs mt-1">Front</span>
//                 </motion.div>
//               )}
//               {pokemon.sprites.back_default && (
//                 <motion.div 
//                   className="flex flex-col items-center"
//                   whileHover={{ scale: 1.1 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <img 
//                     src={pokemon.sprites.back_default} 
//                     alt={`${pokemon.name} back`} 
//                     className="w-16 h-16 object-contain"
//                   />
//                   <span className="text-xs mt-1">Back</span>
//                 </motion.div>
//               )}
//               {pokemon.sprites.front_shiny && (
//                 <motion.div 
//                   className="flex flex-col items-center"
//                   whileHover={{ scale: 1.1 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <img 
//                     src={pokemon.sprites.front_shiny} 
//                     alt={`${pokemon.name} shiny front`} 
//                     className="w-16 h-16 object-contain"
//                   />
//                   <span className="text-xs mt-1">Shiny Front</span>
//                 </motion.div>
//               )}
//               {pokemon.sprites.back_shiny && (
//                 <motion.div 
//                   className="flex flex-col items-center"
//                   whileHover={{ scale: 1.1 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <img 
//                     src={pokemon.sprites.back_shiny} 
//                     alt={`${pokemon.name} shiny back`} 
//                     className="w-16 h-16 object-contain"
//                   />
//                   <span className="text-xs mt-1">Shiny Back</span>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         );
//       case 'quickFacts':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
//               <motion.span 
//                 className="w-2 h-2 mr-2 rounded-full inline-block"
//                 style={{ backgroundColor: typeColor }}
//                 animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.4 }}
//               />
//               Quick Facts
//             </h3>
//             <ul className="space-y-2 text-sm">
//               <motion.li 
//                 className="flex items-start"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <motion.span 
//                   className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
//                   style={{ backgroundColor: typeColor }}
//                   animate={{ scale: [1, 1.5, 1] }}
//                   transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
//                 />
//                 <span>Pokédex #: {pokemon.id}</span>
//               </motion.li>
//               <motion.li 
//                 className="flex items-start"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <motion.span 
//                   className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
//                   style={{ backgroundColor: typeColor }}
//                   animate={{ scale: [1, 1.5, 1] }}
//                   transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2 }}
//                 />
//                 <span>Generation: {Math.ceil(pokemon.id / 151)}</span>
//               </motion.li>
//               <motion.li 
//                 className="flex items-start"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <motion.span 
//                   className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
//                   style={{ backgroundColor: typeColor }}
//                   animate={{ scale: [1, 1.5, 1] }}
//                   transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4 }}
//                 />
//                 <span>Base Happiness: {species.base_happiness || 'Unknown'}</span>
//               </motion.li>
//               <motion.li 
//                 className="flex items-start"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <motion.span 
//                   className="w-2 h-2 mt-1.5 mr-2 rounded-full" 
//                   style={{ backgroundColor: typeColor }}
//                   animate={{ scale: [1, 1.5, 1] }}
//                   transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.6 }}
//                 />
//                 <span>Capture Rate: {species.capture_rate || 'Unknown'}/255</span>
//               </motion.li>
//             </ul>
//           </div>
//         );
//       case 'description':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
//               <motion.span 
//                 className="w-2 h-2 mr-2 rounded-full inline-block"
//                 style={{ backgroundColor: typeColor }}
//                 animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
//               />
//               Description
//             </h3>
//             <p className="text-white text-sm leading-relaxed">
//               {species.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') || 'No description available.'}
//             </p>
//           </div>
//         );
//       case 'physical':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
//               <motion.span 
//                 className="w-2 h-2 mr-2 rounded-full inline-block"
//                 style={{ backgroundColor: typeColor }}
//                 animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.1 }}
//               />
//               Physical
//             </h3>
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div>
//                 <p className="text-gray-400">Height</p>
//                 <p className="text-white font-medium">{(pokemon.height / 10).toFixed(1)} m</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Weight</p>
//                 <p className="text-white font-medium">{(pokemon.weight / 10).toFixed(1)} kg</p>
//               </div>
//             </div>
//           </div>
//         );
//       case 'abilities':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
//               <motion.span 
//                 className="w-2 h-2 mr-2 rounded-full inline-block"
//                 style={{ backgroundColor: typeColor }}
//                 animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
//               />
//               Abilities
//             </h3>
//             <ul className="space-y-2">
//               {pokemon.abilities.map((ability, index) => (
//                 <li key={index} className="flex items-center">
//                   <motion.span
//                     className="w-1.5 h-1.5 mr-2 rounded-full"
//                     style={{ backgroundColor: typeColor }}
//                   />
//                   <span className="text-white">{ability.ability.name.replace('-', ' ')}</span>
//                   {ability.is_hidden && (
//                     <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">Hidden</span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         );
//       case 'stats':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
//               <motion.span 
//                 className="w-2 h-2 mr-2 rounded-full inline-block"
//                 style={{ backgroundColor: typeColor }}
//                 animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.3 }}
//               />
//               Base Stats
//             </h3>
//             <div className="space-y-3 mt-1">
//               {pokemon.stats.map((stat, index) => (
//                 <div key={index} className="flex items-center">
//                   <div className="w-20 text-xs text-gray-400">{formatStatName(stat.stat.name)}</div>
//                   <div className="w-8 text-xs font-mono text-right text-white mr-3">{stat.base_stat}</div>
//                   <div className="flex-1">
//                     <motion.div className="stats-bar">
//                       <motion.div 
//                         className="stats-bar-fill"
//                         style={{ backgroundColor: typeColor }}
//                         initial={{ width: 0 }}
//                         animate={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
//                         transition={{ duration: 0.8, delay: index * 0.1 }}
//                       />
//                     </motion.div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case 'details':
//         return (
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
//               <motion.span 
//                 className="w-2 h-2 mr-2 rounded-full inline-block"
//                 style={{ backgroundColor: typeColor }}
//                 animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.4 }}
//               />
//               Details
//             </h3>
//             <div className="grid grid-cols-3 gap-4 text-sm">
//               <div>
//                 <p className="text-gray-400">Species</p>
//                 <p className="text-white font-medium">{species.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown'}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Base Exp</p>
//                 <p className="text-white font-medium">{pokemon.base_experience || 'Unknown'}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Evolution</p>
//                 <p className="text-white font-medium">
//                   {pokemon.id <= 151 
//                     ? [3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 85, 87, 89, 91, 94, 97, 99, 101, 103, 105, 106, 107, 110, 115, 119, 121, 124, 127, 130, 134, 135, 136, 139, 141, 142, 143, 149].includes(pokemon.id)
//                       ? 'Final Stage'
//                       : [2, 5, 8, 11, 14, 17, 19, 21, 23, 25, 27, 30, 33, 35, 37, 39, 41, 44, 46, 48, 50, 52, 54, 56, 58, 61, 64, 67, 70, 72, 75, 77, 79, 81, 84, 86, 88, 90, 93, 96, 98, 100, 102, 104, 108, 109, 113, 114, 117, 118, 120, 122, 123, 125, 126, 129, 133, 137, 138, 140].includes(pokemon.id)
//                         ? 'Mid Stage'
//                         : 'Basic'
//                     : 'Unknown'
//                   }
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div 
//       ref={containerRef}
//       className="relative h-full w-full overflow-hidden"
//       style={{ background: "radial-gradient(circle at 50% 40%, #6b5a19 0%, #211c00 80%, #000 100%)" }}
//     >
//       {/* Connection lines */}
//       {connectionLines.map((line, index) => (
//         <motion.div
//           key={`line-${line.id}`}
//           className="absolute bg-gradient-to-r from-gray-700 to-gray-500 opacity-30"
//           style={{
//             left: line.start.x,
//             top: line.start.y,
//             width: Math.sqrt(
//               Math.pow(line.end.x - line.start.x, 2) + 
//               Math.pow(line.end.y - line.start.y, 2)
//             ),
//             height: 2,
//             zIndex: line.zIndex,
//             transformOrigin: 'left center',
//             transform: `rotate(${Math.atan2(
//               line.end.y - line.start.y,
//               line.end.x - line.start.x
//             )}rad)`
//           }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.3 }}
//           transition={{ duration: 0.5 }}
//         />
//       ))}

//       {/* Draggable Boxes */}
//       {boxes.map((box) => (
//         <motion.div
//           key={box.id}
//           ref={el => boxRefs.current[box.id] = el}
//           className={`absolute cursor-grab active:cursor-grabbing bento-box 
//             ${box.expanded ? 'shadow-lg shadow-gray-700/20' : ''} 
//             ${box.id === 'card' ? 'card-box' : ''}`}
//           style={{
//             zIndex: box.position.zIndex,
//             width: box.size === 'large' ? '400px' : box.size === 'medium' ? '300px' : '220px',
//             height: box.size === 'large' ? 'auto' : box.size === 'medium' ? 'auto' : 'auto',
//             maxHeight: box.expanded ? '80vh' : 'auto',
//           }}
//           drag
//           dragConstraints={containerRef}
//           dragElastic={0.1}
//           dragMomentum={false}
//           onDragEnd={(_, info) => handleDragEnd(box.id, info)}
//           initial={{
//             x: box.position.x,
//             y: box.position.y,
//             scale: 1
//           }}
//           animate={{
//             x: focusedBox === box.id ? 0 : box.position.x,
//             y: focusedBox === box.id ? 0 : box.position.y,
//             scale: focusedBox === box.id ? 1.1 : 1,
//             zIndex: box.position.zIndex
//           }}
//           transition={{
//             type: 'spring',
//             damping: 20,
//             stiffness: 100
//           }}
//           onClick={(e) => {
//             if (box.id !== 'card' || !isFlipped) {
//               e.stopPropagation();
//               handleFocusBox(box.id);
//             }
//           }}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           {/* Box Content */}
//           {renderBoxContent(box)}
          
//           {/* Minimize button when focused */}
//           {focusedBox === box.id && (
//             <motion.button
//               className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 text-white opacity-70 hover:opacity-100"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleFocusBox(box.id);
//               }}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.7 }}
//               whileHover={{ opacity: 1 }}
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
//               </svg>
//             </motion.button>
//           )}
//         </motion.div>
//       ))}

//       {/* Reset View Button (fixed position) */}
//       <motion.button
//         className="fixed bottom-20 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg"
//         onClick={resetToDefaultPositions}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//           <polyline points="9 22 9 12 15 12 15 22"></polyline>
//         </svg>
//       </motion.button>
//     </div>
//   );
// };

// export default DraggableBentoLayout;