// components/SwappablePokemonLayout.tsx
'use client';
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import CustomPokemonCard from './CustomPokemonCard';
import { getTypeColor, formatStatName } from '../utils/pokemonApi';

interface Position {
    x: number;
    y: number;
    zIndex: number;
}

interface BoxState {
    id: string;
    position: Position;
    defaultPosition: Position;
    content: 'card' | 'description' | 'physical' | 'abilities' | 'stats' | 'details' | 'sprites' | 'quickFacts';
    size: 'small' | 'medium' | 'large';
    expanded: boolean;
}

interface SwappablePokemonLayoutProps {
    pokemon: Pokemon;
    species: PokemonSpecies;
    onResetView: () => void;
}

const SwappablePokemonLayout = forwardRef<{ resetToDefaultPositions: () => void }, SwappablePokemonLayoutProps>(({
    pokemon,
    species,
    onResetView
}, ref) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeBox, setActiveBox] = useState<string>('card');
    const containerRef = useRef<HTMLDivElement>(null);
    const boxRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Define the initial box positions based on screenshot layout
    const [boxes, setBoxes] = useState<BoxState[]>([
        {
            id: 'card',
            position: { x: 0, y: 0, zIndex: 100 },
            defaultPosition: { x: 0, y: 0, zIndex: 100 },
            content: 'card',
            size: 'medium',
            expanded: false
        },
        {
            id: 'description',
            position: { x: -350, y: -110, zIndex: 10 },
            defaultPosition: { x: -350, y: -110, zIndex: 10 },
            content: 'description',
            size: 'medium',
            expanded: false
        },
        {
            id: 'physical',
            position: { x: -350, y: 70, zIndex: 10 },
            defaultPosition: { x: -350, y: 70, zIndex: 10 },
            content: 'physical',
            size: 'small',
            expanded: false
        },
        {
            id: 'abilities',
            position: { x: -350, y: 170, zIndex: 10 },
            defaultPosition: { x: -350, y: 170, zIndex: 10 },
            content: 'abilities',
            size: 'small',
            expanded: false
        },
        {
            id: 'stats',
            position: { x: -350, y: 280, zIndex: 10 },
            defaultPosition: { x: -350, y: 280, zIndex: 10 },
            content: 'stats',
            size: 'medium',
            expanded: false
        },
        {
            id: 'details',
            position: { x: -350, y: 430, zIndex: 10 },
            defaultPosition: { x: -350, y: 430, zIndex: 10 },
            content: 'details',
            size: 'medium',
            expanded: false
        },
        {
            id: 'sprites',
            position: { x: 350, y: -40, zIndex: 10 },
            defaultPosition: { x: 350, y: -40, zIndex: 10 },
            content: 'sprites',
            size: 'medium',
            expanded: false
        },
        {
            id: 'quickFacts',
            position: { x: 350, y: 170, zIndex: 10 },
            defaultPosition: { x: 350, y: 170, zIndex: 10 },
            content: 'quickFacts',
            size: 'medium',
            expanded: false
        }
    ]);

    // Expose resetToDefaultPositions method to parent component
    useImperativeHandle(ref, () => ({
        resetToDefaultPositions
    }));

    // Reset to default positions
    const resetToDefaultPositions = () => {
        setBoxes(prevBoxes =>
            prevBoxes.map(box => ({
                ...box,
                position: { ...box.defaultPosition },
                expanded: false
            }))
        );
        setActiveBox('card');
    };

    // Handle card flip
    const handleFlip = () => {
        if (activeBox === 'card') {
            setIsFlipped(!isFlipped);
        }
    };

    // Handle box click (for swapping positions)
    const handleBoxClick = (boxId: string) => {
        if (boxId === activeBox) return;

        const activeBoxObj = boxes.find(b => b.id === activeBox);
        const clickedBox = boxes.find(b => b.id === boxId);

        if (!activeBoxObj || !clickedBox) return;

        // Only proceed with swap if card is not flipped or we're clicking to make card active again
        if (!isFlipped || boxId === 'card') {
            // Swap positions between current active box and clicked box
            setBoxes(prevBoxes =>
                prevBoxes.map(box => {
                    if (box.id === activeBox) {
                        // Current active box goes to clicked box position
                        return {
                            ...box,
                            position: { ...clickedBox.position },
                            expanded: false
                        };
                    } else if (box.id === boxId) {
                        // Clicked box goes to center
                        return {
                            ...box,
                            position: { x: 0, y: 0, zIndex: 100 },
                            expanded: true
                        };
                    }
                    return box;
                })
            );

            // Update active box
            setActiveBox(boxId);

            // Reset flip if new active box is not the card
            if (boxId !== 'card') {
                setIsFlipped(false);
            }
        }
    };

    // Calculate connection lines between boxes and the center item
    const getConnectionPoints = () => {
        if (!containerRef.current || !boxRefs.current[activeBox]) return [];

        const centerBox = boxRefs.current[activeBox];
        if (!centerBox) return [];

        const containerRect = containerRef.current.getBoundingClientRect();
        const centerRect = centerBox.getBoundingClientRect();

        const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
        const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

        return boxes
            .filter(box => box.id !== activeBox)
            .map(box => {
                const boxElement = boxRefs.current[box.id];
                if (!boxElement) return null;

                const boxRect = boxElement.getBoundingClientRect();
                const boxCenterX = boxRect.left + boxRect.width / 2 - containerRect.left;
                const boxCenterY = boxRect.top + boxRect.height / 2 - containerRect.top;

                // Calculate angle for line
                const angle = Math.atan2(boxCenterY - centerY, boxCenterX - centerX);

                // Calculate edge points
                const centerRadius = Math.min(centerRect.width, centerRect.height) / 2;
                const boxRadius = Math.min(boxRect.width, boxRect.height) / 2;

                const centerEdgeX = centerX + Math.cos(angle) * centerRadius;
                const centerEdgeY = centerY + Math.sin(angle) * centerRadius;

                const boxEdgeX = boxCenterX - Math.cos(angle) * boxRadius;
                const boxEdgeY = boxCenterY - Math.sin(angle) * boxRadius;

                return {
                    id: box.id,
                    start: { x: centerEdgeX, y: centerEdgeY },
                    end: { x: boxEdgeX, y: boxEdgeY },
                    zIndex: 5
                };
            })
            .filter(line => line !== null);
    };

    // Generate connection lines
    const connectionLines = getConnectionPoints();

    // Render the box content based on type
    const renderBoxContent = (box: BoxState) => {
        const typeColor = getTypeColor(pokemon.types[0].type.name);
        const isActive = box.id === activeBox;

        switch (box.content) {
            case 'card':
                return (
                    <CustomPokemonCard
                        pokemon={pokemon}
                        species={species}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                        typeColor={typeColor}
                    />
                );
                
            case 'description':
                return (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
                            <motion.span
                                className="w-2 h-2 mr-2 rounded-full inline-block"
                                style={{ backgroundColor: typeColor }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                            />
                            Description
                        </h3>
                        <p className="text-white text-sm leading-relaxed">
                            {species.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') || 'No description available.'}
                        </p>

                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700"
                            >
                                <p className="text-gray-400 text-sm">
                                    This Pokémon was introduced in Generation {Math.ceil(pokemon.id / 151)} and has a base experience yield of {pokemon.base_experience || 'Unknown'} points.
                                    Its uniqueness makes it a favorite among trainers and researchers alike.
                                </p>
                                <div className="mt-4">
                                    <h4 className="text-white text-sm font-semibold mb-2">Natural Habitat</h4>
                                    <p className="text-gray-400 text-sm">
                                        {pokemon.name.includes('pikachu')
                                            ? 'Forests and woodlands, often near sources of electricity.'
                                            : pokemon.types[0].type.name === 'water'
                                                ? 'Oceans, lakes, and rivers where it can swim freely.'
                                                : pokemon.types[0].type.name === 'fire'
                                                    ? 'Volcanic regions and hot plains where it can maintain its body temperature.'
                                                    : pokemon.types[0].type.name === 'grass'
                                                        ? 'Lush forests and meadows rich in natural sunlight.'
                                                        : 'Various regions across the Pokémon world.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
                
            case 'physical':
                return (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
                            <motion.span
                                className="w-2 h-2 mr-2 rounded-full inline-block"
                                style={{ backgroundColor: typeColor }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.1 }}
                            />
                            Physical
                        </h3>
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

                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700"
                            >
                                <p className="text-gray-400 text-xs mb-3">Physical comparison:</p>
                                <div className="flex items-end space-x-4 mb-6">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-gray-700 rounded-t w-10" style={{ height: `${pokemon.height * 5}px`, maxHeight: '150px' }}></div>
                                        <div className="text-xs text-gray-400 mt-1">Pokémon</div>
                                        <div className="text-xs text-gray-500">{(pokemon.height / 10).toFixed(1)}m</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 bg-opacity-50 rounded-t w-10" style={{ height: '150px' }}></div>
                                        <div className="text-xs text-gray-400 mt-1">Human</div>
                                        <div className="text-xs text-gray-500">1.7m</div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-white text-sm font-semibold mb-2">Body Composition</h4>
                                    <p className="text-gray-400 text-sm">
                                        {pokemon.types[0].type.name === 'electric'
                                            ? 'This Pokémon stores electricity in its body, creating the distinctive coloration of its fur and cheeks.'
                                            : pokemon.types[0].type.name === 'fire'
                                                ? 'This Pokémon\'s body contains a flame sac that allows it to generate and control fire.'
                                                : pokemon.types[0].type.name === 'water'
                                                    ? 'This Pokémon\'s body is adapted to aquatic life, with specialized gill structures and hydrodynamic features.'
                                                    : 'This Pokémon has a unique physical structure that helps it thrive in its natural environment.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
                
            case 'abilities':
                return (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
                            <motion.span
                                className="w-2 h-2 mr-2 rounded-full inline-block"
                                style={{ backgroundColor: typeColor }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
                            />
                            Abilities
                        </h3>
                        <ul className="space-y-2">
                            {pokemon.abilities.map((ability, index) => (
                                <li key={index} className="flex items-center">
                                    <motion.span
                                        className="w-1.5 h-1.5 mr-2 rounded-full"
                                        style={{ backgroundColor: typeColor }}
                                    />
                                    <span className="text-white capitalize">{ability.ability.name.replace('-', ' ')}</span>
                                    {ability.is_hidden && (
                                        <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">Hidden</span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700"
                            >
                                <div className="space-y-4">
                                    {pokemon.abilities.map((ability, index) => (
                                        <div key={index} className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                            <h4 className="text-white text-sm font-semibold capitalize flex items-center">
                                                <motion.span
                                                    className="w-1.5 h-1.5 mr-2 rounded-full"
                                                    style={{ backgroundColor: typeColor }}
                                                />
                                                {ability.ability.name.replace('-', ' ')}
                                                {ability.is_hidden && (
                                                    <span className="ml-2 text-xs bg-yellow-600 bg-opacity-50 px-2 py-0.5 rounded-full">Hidden</span>
                                                )}
                                            </h4>
                                            <p className="text-gray-400 text-xs mt-2">
                                                {ability.ability.name === 'static'
                                                    ? 'The opponent has a 30% chance of being paralyzed when it makes physical contact with this Pokémon.'
                                                    : ability.ability.name === 'lightning-rod'
                                                        ? 'Electric-type moves are drawn to this Pokémon. Electric-type moves will do no damage and the Pokémons Special Attack is raised one stage.'
                                                        : 'This ability gives the Pokémon special powers or protection during battles. Research is ongoing to understand its full effects.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 text-gray-400 text-xs">
                                    <p>Abilities may have effects both in battles and in the overworld. Some abilities trigger automatically, while others need to be activated.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
                
            case 'stats':
                return (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
                            <motion.span
                                className="w-2 h-2 mr-2 rounded-full inline-block"
                                style={{ backgroundColor: typeColor }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.3 }}
                            />
                            Base Stats
                        </h3>
                        <div className="space-y-3 mt-1">
                            {pokemon.stats.map((stat, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-20 text-xs text-gray-400">{formatStatName(stat.stat.name)}</div>
                                    <div className="w-8 text-xs font-mono text-right text-white mr-3">{stat.base_stat}</div>
                                    <div className="flex-1">
                                        <motion.div className="stats-bar">
                                            <motion.div
                                                className="stats-bar-fill"
                                                style={{ backgroundColor: typeColor }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                            />
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700"
                            >
                                <div className="text-xs text-gray-400">
                                    <p className="mb-2">Total Base Stat: {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}</p>

                                    <div className="mt-4 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                        <h4 className="text-white text-sm font-semibold mb-2">Stat Comparison</h4>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <div>
                                                <p className="text-gray-400 text-xs">Type Average</p>
                                                <p className="text-white text-sm">
                                                    {pokemon.types[0].type.name === 'electric' ? '490' :
                                                        pokemon.types[0].type.name === 'fire' ? '505' :
                                                            pokemon.types[0].type.name === 'water' ? '500' :
                                                                pokemon.types[0].type.name === 'grass' ? '495' : '480'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">Generation Average</p>
                                                <p className="text-white text-sm">{Math.ceil(pokemon.id / 151) === 1 ? '435' : '485'}</p>
                                            </div>
                                            <div className="col-span-2 mt-2">
                                                <p className="text-gray-400 text-xs">Highest Stat</p>
                                                <p className="text-white text-sm capitalize">
                                                    {pokemon.stats.reduce((highest, stat) => highest.base_stat > stat.base_stat ? highest : stat, pokemon.stats[0]).stat.name.replace('-', ' ')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-4">These base stats are further modified by level, nature, EVs, and IVs in the games.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
                
            case 'details':
                return (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
                            <motion.span
                                className="w-2 h-2 mr-2 rounded-full inline-block"
                                style={{ backgroundColor: typeColor }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.4 }}
                            />
                            Details
                        </h3>
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
                                <p className="text-white font-medium">
                                    {pokemon.id <= 151
                                        ? [3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 85, 87, 89, 91, 94, 97, 99, 101, 103, 105, 106, 107, 110, 115, 119, 121, 124, 127, 130, 134, 135, 136, 139, 141, 142, 143, 149].includes(pokemon.id)
                                            ? 'Final Stage'
                                            : [2, 5, 8, 11, 14, 17, 19, 21, 23, 25, 27, 30, 33, 35, 37, 39, 41, 44, 46, 48, 50, 52, 54, 56, 58, 61, 64, 67, 70, 72, 75, 77, 79, 81, 84, 86, 88, 90, 93, 96, 98, 100, 102, 104, 108, 109, 113, 114, 117, 118, 120, 122, 123, 125, 126, 129, 133, 137, 138, 140].includes(pokemon.id)
                                                ? 'Mid Stage'
                                                : 'Basic'
                                        : 'Unknown'
                                    }
                                </p>
                            </div>
                        </div>

                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700"
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

                                <div className="mt-4 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                    <h4 className="text-white text-sm font-semibold mb-2">Evolution Chain</h4>
                                    <div className="flex items-center justify-center space-x-4">
                                        {pokemon.name.includes('pikachu') ? (
                                            <>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xs">Pichu</div>
                                                    <p className="text-xs text-gray-400 mt-1">Basic</p>
                                                </div>
                                                <div className="text-gray-500">→</div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-xs">Pikachu</div>
                                                    <p className="text-xs text-gray-400 mt-1">Mid Stage</p>
                                                </div>
                                                <div className="text-gray-500">→</div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xs">Raichu</div>
                                                    <p className="text-xs text-gray-400 mt-1">Final Stage</p>
                                                </div>
                                            </>
                                        ) : pokemon.types[0].type.name === 'fire' && pokemon.name.includes('char') ? (
                                            <>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xs">Charmander</div>
                                                    <p className="text-xs text-gray-400 mt-1">Basic</p>
                                                </div>
                                                <div className="text-gray-500">→</div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xs">Charmeleon</div>
                                                    <p className="text-xs text-gray-400 mt-1">Mid Stage</p>
                                                </div>
                                                <div className="text-gray-500">→</div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xs">Charizard</div>
                                                    <p className="text-xs text-gray-400 mt-1">Final Stage</p>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-gray-400 text-xs">Evolution data not available for this Pokémon.</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
                
            case 'sprites':
                return (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
                            <motion.span
                                className="w-2 h-2 mr-2 rounded-full inline-block"
                                style={{ backgroundColor: typeColor }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
                            />
                            Sprites
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {pokemon.sprites.front_default && (
                                <motion.div
                                    className="flex flex-col items-center"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <img
                                        src={pokemon.sprites.front_default}
                                        alt={`${pokemon.name} front`}
                                        className="w-16 h-16 object-contain"
                                    />
                                    <span className="text-xs mt-1">Front</span>
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
                                        className="w-16 h-16 object-contain"
                                    />
                                    <span className="text-xs mt-1">Back</span>
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
                                        className="w-16 h-16 object-contain"
                                    />
                                    <span className="text-xs mt-1">Shiny Front</span>
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
                                        className="w-16 h-16 object-contain"
                                    />
                                    <span className="text-xs mt-1">Shiny Back</span>
                                </motion.div>
                            )}
                        </div>

                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {pokemon.sprites.front_female && (
                                        <motion.div
                                            className="flex flex-col items-center"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <img
                                                src={pokemon.sprites.front_female}
                                                alt={`${pokemon.name} female`}
                                                className="w-16 h-16 object-contain"
                                            />
                                            <span className="text-xs mt-1">Female</span>
                                        </motion.div>
                                    )}
                                    {pokemon.sprites.front_shiny_female && (
                                        <motion.div
                                            className="flex flex-col items-center"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <img
                                                src={pokemon.sprites.front_shiny_female}
                                                alt={`${pokemon.name} shiny female`}
                                                className="w-16 h-16 object-contain"
                                            />
                                            <span className="text-xs mt-1">Shiny Female</span>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="mt-4 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                    <h4 className="text-white text-sm font-semibold mb-2">Sprite Evolution</h4>
                                    <p className="text-gray-400 text-xs">
                                        Pokémon sprites have evolved over the different generations of games, from the original 8-bit graphics to the modern detailed sprites and 3D models seen today.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
                
            case 'quickFacts':
                return (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }}>
                            <motion.span
                                className="w-2 h-2 mr-2 rounded-full inline-block"
                                style={{ backgroundColor: typeColor }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.4 }}
                            />
                            Quick Facts
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <motion.li
                                className="flex items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.span
                                    className="w-2 h-2 mt-1.5 mr-2 rounded-full"
                                    style={{ backgroundColor: typeColor }}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                />
                                <span>Pokédex #: {pokemon.id}</span>
                            </motion.li>
                            <motion.li
                                className="flex items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.span
                                    className="w-2 h-2 mt-1.5 mr-2 rounded-full"
                                    style={{ backgroundColor: typeColor }}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2 }}
                                />
                                <span>Generation: {Math.ceil(pokemon.id / 151)}</span>
                            </motion.li>
                            <motion.li
                                className="flex items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.span
                                    className="w-2 h-2 mt-1.5 mr-2 rounded-full"
                                    style={{ backgroundColor: typeColor }}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4 }}
                                />
                                <span>Base Happiness: {species.base_happiness || 'Unknown'}</span>
                            </motion.li>
                            <motion.li
                                className="flex items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <motion.span
                                    className="w-2 h-2 mt-1.5 mr-2 rounded-full"
                                    style={{ backgroundColor: typeColor }}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.6 }}
                                />
                                <span>Capture Rate: {species.capture_rate || 'Unknown'}/255</span>
                            </motion.li>
                        </ul>

                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700"
                            >
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Type Effectiveness</h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {pokemon.types[0].type.name === 'electric' ? (
                                                <>
                                                    <span className="px-2 py-1 bg-red-600 bg-opacity-30 rounded-full text-xs">Weak: Ground</span>
                                                    <span className="px-2 py-1 bg-green-600 bg-opacity-30 rounded-full text-xs">Resist: Electric, Flying, Steel</span>
                                                </>
                                            ) : pokemon.types[0].type.name === 'fire' ? (
                                                <>
                                                    <span className="px-2 py-1 bg-red-600 bg-opacity-30 rounded-full text-xs">Weak: Water, Ground, Rock</span>
                                                    <span className="px-2 py-1 bg-green-600 bg-opacity-30 rounded-full text-xs">Resist: Fire, Grass, Ice, Bug, Steel</span>
                                                </>
                                            ) : pokemon.types[0].type.name === 'water' ? (
                                                <>
                                                    <span className="px-2 py-1 bg-red-600 bg-opacity-30 rounded-full text-xs">Weak: Electric, Grass</span>
                                                    <span className="px-2 py-1 bg-green-600 bg-opacity-30 rounded-full text-xs">Resist: Fire, Water, Ice, Steel</span>
                                                </>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-600 bg-opacity-30 rounded-full text-xs">Data not available</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Growth Rate</h4>
                                        <p className="text-gray-400 text-xs">{species.growth_rate?.name || 'Medium'}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Egg Groups</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {species.egg_groups?.map((egg: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, i: React.Key | null | undefined) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">{egg.name}</span>
                                            )) || <span className="text-gray-400 text-xs">Unknown</span>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full overflow-hidden"
            style={{ background: "radial-gradient(circle at 50% 40%, #6b5a19 0%, #211c00 80%, #000 100%)" }}
        >
            {/* Connection lines */}
            {connectionLines.map((line, index) => (
                <motion.div
                    key={`line-${line.id}`}
                    className="absolute bg-gradient-to-r from-gray-500 to-gray-400 opacity-50"
                    style={{
                        left: line.start.x,
                        top: line.start.y,
                        width: Math.sqrt(
                            Math.pow(line.end.x - line.start.x, 2) +
                            Math.pow(line.end.y - line.start.y, 2)
                        ),
                        height: 2,
                        zIndex: 5,
                        transformOrigin: 'left center',
                        transform: `rotate(${Math.atan2(
                            line.end.y - line.start.y,
                            line.end.x - line.start.x
                        )}rad)`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.5 }}
                />
            ))}

            {/* Boxes */}
            {boxes.map((box) => {
                const isCenter = box.id === activeBox;

                return (
                    <motion.div
                        key={box.id}
                        ref={el => { boxRefs.current[box.id] = el; }}
                        className={`absolute cursor-pointer bento-box 
              ${isCenter ? 'shadow-lg shadow-gray-700/20' : ''} 
              ${box.id === 'card' && activeBox === 'card' ? 'card-box' : ''}`}
                        style={{
                            zIndex: box.position.zIndex,
                            width: isCenter && box.id !== 'card'
                                ? 'auto'
                                : box.size === 'large' ? '400px' : box.size === 'medium' ? '280px' : '220px',
                            maxWidth: isCenter && box.id !== 'card' ? '600px' : 'none',
                            height: 'auto',
                            maxHeight: isCenter ? '80vh' : 'auto',
                        }}
                        initial={{
                            x: box.position.x,
                            y: box.position.y,
                            scale: 1
                        }}
                        animate={{
                            x: box.position.x,
                            y: box.position.y,
                            scale: isCenter ? 1.05 : 1,
                            zIndex: box.position.zIndex
                        }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 100
                        }}
                        onClick={() => handleBoxClick(box.id)}
                        whileHover={{ scale: isCenter ? 1.05 : 1.02 }}
                    >
                        {/* Box Content */}
                        {renderBoxContent(box)}
                    </motion.div>
                );
            })}

            {/* Reset View Button (fixed position) */}
            <motion.button
                className="fixed bottom-20 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg"
                onClick={resetToDefaultPositions}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
            </motion.button>
        </div>
    );
});

// Add display name for debugging
SwappablePokemonLayout.displayName = 'SwappablePokemonLayout';

export default SwappablePokemonLayout;