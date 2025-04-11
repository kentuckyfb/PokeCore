// components/UniformGridLayout.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { getTypeColor, capitalize, formatStatName } from '../utils/pokemonApi';
import StatRadarChart from './StatRadarChart';
import HorizontalEvolutionChain from './HorizontalEvolutionChain';
import EnhancedPokemonCard from './EnhancedPokemonCard';

interface UniformGridLayoutProps {
    pokemon: Pokemon;
    species: PokemonSpecies;
    loadPokemon: (nameOrId: string | number) => void;
    isFlipped: boolean;
    onFlip: () => void;
}
interface StatsBoxProps {
    pokemon: Pokemon;
    typeColor: string;
}


// --- PLACEHOLDER HELPERS ---
// Helper for ability description
const getAbilityDescription = (abilityName: string): string => {
    const descriptions: { [key: string]: string } = {
        'static': '30% chance to paralyze attacker on contact.',
        'lightning-rod': 'Draws Electric moves, nullifies damage, raises Sp. Atk.',
        'blaze': 'Powers up Fire moves in a pinch.',
        'overgrow': 'Powers up Grass moves in a pinch.',
        'torrent': 'Powers up Water moves in a pinch.',
    };
    return descriptions[abilityName.toLowerCase().replace(' ', '-')] || 'No description available.';
};

// Helper for type effectiveness
const calculateDefensiveEffectiveness = (types: { type: { name: string } }[]): { weak: string[], resist: string[], immune: string[] } => {
    const primaryType = types[0]?.type.name;
    if (primaryType === 'electric') return { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] };
    if (primaryType === 'fire') return { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] };
    if (primaryType === 'water') return { weak: ['grass', 'electric'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] };
    if (primaryType === 'grass') return { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'grass', 'electric', 'ground'], immune: [] };
    return { weak: ['fighting'], resist: [], immune: [] };
}
// --- END PLACEHOLDERS ---

// Component for description box
const DescriptionBox = ({ pokemon, species, typeColor }) => {
    const getEnglishDescription = () => {
        const englishEntry = species.flavor_text_entries?.find(entry => entry.language.name === 'en');
        return englishEntry ? englishEntry.flavor_text.replace(/[\f\n\r\t\v]/g, ' ') : 'No description available.';
    };

    return (
        <motion.div className="bento-box p-4 h-full" layout>
            <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
                <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Description
            </motion.h3>
            <motion.p className="text-white text-sm leading-relaxed" layout>{getEnglishDescription()}</motion.p>
        </motion.div>
    );
};

// Component for physical attributes
const PhysicalBox = ({ pokemon, typeColor }) => (
    <motion.div className="bento-box p-4 h-full" layout>
        <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
            <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Physical
        </motion.h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div><p className="text-gray-400">Height</p><p className="text-white font-medium">{(pokemon.height / 10).toFixed(1)} m</p></div>
            <div><p className="text-gray-400">Weight</p><p className="text-white font-medium">{(pokemon.weight / 10).toFixed(1)} kg</p></div>
        </div>
    </motion.div>
);

// Component for abilities
const AbilitiesBox = ({ pokemon, typeColor }) => {
    const [hoveredAbility, setHoveredAbility] = useState<string | null>(null);

    return (
        <motion.div className="bento-box p-4 h-full" layout>
            <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
                <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Abilities
            </motion.h3>
            <ul className="space-y-2">
                {pokemon.abilities.map((abilityInfo) => (
                    <motion.li
                        key={abilityInfo.ability.name}
                        className="relative flex items-center cursor-help"
                        onHoverStart={() => setHoveredAbility(abilityInfo.ability.name)}
                        onHoverEnd={() => setHoveredAbility(null)}
                    >
                        <motion.span className="w-1.5 h-1.5 mr-2 rounded-full" style={{ backgroundColor: typeColor }} />
                        <span className="text-white">{capitalize(abilityInfo.ability.name.replace('-', ' '))}</span>
                        {abilityInfo.is_hidden && <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">Hidden</span>}
                        <AnimatePresence>
                            {hoveredAbility === abilityInfo.ability.name && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-950 text-xs text-white rounded-md shadow-lg z-20 w-max max-w-[200px] border border-gray-700 text-center pointer-events-none"
                                >
                                    {getAbilityDescription(abilityInfo.ability.name)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

// Component for type matchups
const TypeMatchupsBox = ({ pokemon, typeColor }) => {
    const effectiveness = calculateDefensiveEffectiveness(pokemon.types);

    return (
        <motion.div className="bento-box p-4 h-full" layout>
            <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
                <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Type Matchups
            </motion.h3>
            <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                    <h4 className="font-semibold mb-1 text-red-400">Weak To (x2):</h4>
                    {effectiveness.weak.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {effectiveness.weak.map(type => (
                                <span key={type} className="px-1.5 py-0.5 rounded text-white text-[10px] shadow"
                                    style={{ backgroundColor: getTypeColor(type) }}>{capitalize(type)}</span>
                            ))}
                        </div>
                    ) : <span className="text-gray-400">None</span>}
                </div>
                <div>
                    <h4 className="font-semibold mb-1 text-green-400">Resists (x0.5):</h4>
                    {effectiveness.resist.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {effectiveness.resist.map(type => (
                                <span key={type} className="px-1.5 py-0.5 rounded text-white text-[10px] shadow"
                                    style={{ backgroundColor: getTypeColor(type) }}>{capitalize(type)}</span>
                            ))}
                        </div>
                    ) : <span className="text-gray-400">None</span>}
                </div>
                <div>
                    <h4 className="font-semibold mb-1 text-gray-300">Immune To (x0):</h4>
                    {effectiveness.immune.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {effectiveness.immune.map(type => (
                                <span key={type} className="px-1.5 py-0.5 rounded text-white text-[10px] shadow"
                                    style={{ backgroundColor: getTypeColor(type) }}>{capitalize(type)}</span>
                            ))}
                        </div>
                    ) : <span className="text-gray-400">None</span>}
                </div>
            </div>
        </motion.div>
    );
};

// Component for evolution chain (now moved to Pokémon Details box)
// Updated PokemonDetailsBox Component
const PokemonDetailsBox = ({ pokemon, species, typeColor }) => (
    <motion.div className="bento-box p-4 h-full flex flex-col" layout>
        <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
            <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Pokémon Details
        </motion.h3>

        {/* Make this section scrollable if needed */}
        <div className="overflow-y-auto flex-grow">
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-400">Species</p>
                    <p className="text-white font-medium">{species.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Base Exp</p>
                    <p className="text-white font-medium">{pokemon.base_experience || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Growth Rate</p>
                    <p className="text-white font-medium capitalize">{species.growth_rate?.name?.replace('-', ' ') || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Egg Groups</p>
                    <p className="text-white font-medium">
                        {species.egg_groups?.map(group => capitalize(group.name)).join(', ') || 'Unknown'}
                    </p>
                </div>

                {/* Move these inside the scrollable area */}
                <div>
                    <p className="text-gray-400">Habitat</p>
                    <p className="text-white font-medium capitalize">{species.habitat?.name?.replace('-', ' ') || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Shape</p>
                    <p className="text-white font-medium capitalize">{species.shape?.name?.replace('-', ' ') || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Color</p>
                    <p className="text-white font-medium capitalize">{species.color?.name || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Generation</p>
                    <p className="text-white font-medium">Generation {Math.ceil(pokemon.id / 151)}</p>
                </div>
            </div>
        </div>
    </motion.div>
);

const StatsBox: React.FC<StatsBoxProps> = ({ pokemon, typeColor }) => {
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    return (
        <motion.div className="bento-box p-2 h-full flex flex-col" layout>
            {/* Title */}
            <motion.h3 className="text-lg font-bold mb-0 flex items-center flex-shrink-0" style={{ color: typeColor }} layout> {/* Added flex-shrink-0 */}
                <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Base Stats
            </motion.h3>

            {/* Chart Container - Takes remaining space, content aligned top */}
            {/* --- KEY CHANGE: Removed items-center --- */}
            <div className="flex-grow flex justify-center relative min-h-0 overflow-hidden"> {/* Added overflow-hidden for safety, removed items-center */}
                {/* Inner div now takes full height of the flex-grow container */}
                {/* --- KEY CHANGE: Removed explicit height style, added h-full class --- */}
                <div className="w-full h-full">
                    <StatRadarChart pokemon={pokemon} typeColor={typeColor} />
                </div>
            </div>

            {/* Total stats at bottom */}
            <div className="text-xs text-right text-gray-400 mt-0 pr-1 pb-0.5 flex-shrink-0"> {/* Added flex-shrink-0 */}
                Total: {totalStats}
            </div>
        </motion.div>
    );
};


// Component for sprites
const SpritesBox = ({ pokemon, typeColor }) => (
    <motion.div className="bento-box p-4 h-full" layout>
        <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
            <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Sprites
        </motion.h3>
        <div className="grid grid-cols-2 gap-2">
            {pokemon.sprites.front_default && (
                <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
                    <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`} className="w-16 h-16 object-contain" />
                    <span className="text-xs mt-1 text-gray-300">Front</span>
                </motion.div>
            )}
            {pokemon.sprites.back_default && (
                <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
                    <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} className="w-16 h-16 object-contain" />
                    <span className="text-xs mt-1 text-gray-300">Back</span>
                </motion.div>
            )}
            {pokemon.sprites.front_shiny && (
                <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
                    <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny front`} className="w-16 h-16 object-contain" />
                    <span className="text-xs mt-1 text-gray-300">Shiny</span>
                </motion.div>
            )}
            {pokemon.sprites.back_shiny && (
                <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
                    <img src={pokemon.sprites.back_shiny} alt={`${pokemon.name} shiny back`} className="w-16 h-16 object-contain" />
                    <span className="text-xs mt-1 text-gray-300">Shiny Back</span>
                </motion.div>
            )}
        </div>
    </motion.div>
);

// Component for quick facts
const QuickFactsBox = ({ pokemon, species, typeColor }) => (
    <motion.div className="bento-box p-4 h-full" layout>
        <motion.h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: typeColor }} layout>
            <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Quick Facts
        </motion.h3>
        <ul className="space-y-2 text-sm">
            <motion.li className="flex items-start">
                <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                <span>Pokédex #: {pokemon.id}</span>
            </motion.li>
            <motion.li className="flex items-start">
                <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                <span>Generation: {Math.ceil(pokemon.id / 151)}</span>
            </motion.li>
            <motion.li className="flex items-start">
                <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                <span>Base Happiness: {species.base_happiness ?? 'N/A'}</span>
            </motion.li>
            <motion.li className="flex items-start">
                <motion.span className="w-2 h-2 mt-1.5 mr-2 rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                <span>Capture Rate: {species.capture_rate ?? 'N/A'}/255</span>
            </motion.li>
        </ul>
    </motion.div>
);

// Main component
const UniformGridLayout: React.FC<UniformGridLayoutProps> = ({
    pokemon,
    species,
    loadPokemon,
    isFlipped,
    onFlip
}) => {
    const typeColor = getTypeColor(pokemon.types[0].type.name);

    return (
        <div className="uniform-grid-container">
            {/* Central grid with 3-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left column */}
                <div className="flex flex-col gap-4">
                    <DescriptionBox pokemon={pokemon} species={species} typeColor={typeColor} />
                    <div className="grid grid-cols-2 gap-4">
                        <PhysicalBox pokemon={pokemon} typeColor={typeColor} />
                        <AbilitiesBox pokemon={pokemon} typeColor={typeColor} />
                    </div>
                    <TypeMatchupsBox pokemon={pokemon} typeColor={typeColor} />
                    <PokemonDetailsBox pokemon={pokemon} species={species} typeColor={typeColor} />
                </div>

                {/* Middle column - Pokémon card and additional info */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center items-start">
                        <div className="w-full max-w-xs">
                            <EnhancedPokemonCard
                                pokemon={pokemon}
                                species={species}
                                isFlipped={isFlipped}
                                onFlip={onFlip}
                                typeColor={typeColor}
                            />
                        </div>
                    </div>

                    {/* Additional Middle Bottom Content */}


                    <motion.div className="bento-box p-3 h-full flex flex-col" layout>
                        <motion.h3 className="text-lg font-bold mb-1 flex items-center" style={{ color: typeColor }} layout>
                            <motion.span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: typeColor }} layout /> Evolution Chain
                        </motion.h3>
                        <div className="overflow-x-auto pb-2 evolution-scroll-container flex-grow flex items-center">
                            <div className="min-w-max w-full">
                                <HorizontalEvolutionChain
                                    species={species}
                                    loadPokemon={loadPokemon}
                                    currentPokemonName={pokemon.name}
                                />
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                    <SpritesBox pokemon={pokemon} typeColor={typeColor} />
                    <QuickFactsBox pokemon={pokemon} species={species} typeColor={typeColor} />
                    <StatsBox pokemon={pokemon} typeColor={typeColor} />
                </div>
            </div>
        </div>
    );
};

export default UniformGridLayout;