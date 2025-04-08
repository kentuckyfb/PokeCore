// utils/pokemonApi.ts
import axios from 'axios';
import { Pokemon, PokemonSpecies, EvolutionChain } from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Get a Pokemon by name or ID
export const getPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    throw new Error('Failed to fetch Pokémon data');
  }
};

// Get Pokemon species data
export const getPokemonSpecies = async (nameOrId: string | number): Promise<PokemonSpecies> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon-species/${nameOrId.toString().toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon species:', error);
    throw new Error('Failed to fetch Pokémon species data');
  }
};

// Get Pokemon evolution chain
export const getEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    throw new Error('Failed to fetch evolution chain data');
  }
};

// Get a random Pokemon (there are 1025 Pokémon in total as of Gen 9)
export const getRandomPokemon = async (): Promise<Pokemon> => {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  return getPokemon(randomId);
};

// Get English flavor text from species data
export const getEnglishFlavorText = (species: PokemonSpecies): string => {
  const englishEntries = species.flavor_text_entries.filter(
    entry => entry.language.name === 'en'
  );
  
  if (englishEntries.length > 0) {
    // Get the most recent entry or a random one
    const entry = englishEntries[0];
    // Clean up the text (remove special characters)
    return entry.flavor_text.replace(/[\f\n\r\t\v]/g, ' ');
  }
  
  return 'No description available.';
};

// Get english genus (category) from species data
export const getEnglishGenus = (species: PokemonSpecies): string => {
  const englishGenus = species.genera.find(
    g => g.language.name === 'en'
  );
  
  return englishGenus ? englishGenus.genus : 'Unknown';
};

// Format Pokemon stats
export const formatStatName = (statName: string): string => {
  const statMap: { [key: string]: string } = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  };
  
  return statMap[statName] || statName;
};

// Format Pokemon height and weight
export const formatHeight = (height: number): string => {
  // Height is in decimeters
  const meters = height / 10;
  const feet = Math.floor(meters * 3.281);
  const inches = Math.round((meters * 3.281 - feet) * 12);
  
  return `${meters.toFixed(1)}m (${feet}'${inches}")`;
};

export const formatWeight = (weight: number): string => {
  // Weight is in hectograms
  const kg = weight / 10;
  const lbs = kg * 2.205;
  
  return `${kg.toFixed(1)}kg (${lbs.toFixed(1)}lbs)`;
};

// Get type color
export const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  
  return typeColors[type] || '#777777';
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format Pokemon ID with leading zeros
export const formatPokemonId = (id: number): string => {
  return id.toString().padStart(3, '0');
};