// types/pokemon.ts
export {};
export interface PokemonType {
    type: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonAbility {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }
  
  export interface PokemonSprites {
    front_default: string;
    back_default: string;
    front_shiny?: string;
    back_shiny?: string;
    other: {
      'official-artwork'?: {
        front_default: string;
        front_shiny?: string;
      };
      dream_world?: {
        front_default: string;
      };
      home?: {
        front_default: string;
      };
    };
  }
  
  export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: PokemonType[];
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    sprites: PokemonSprites;
    species: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonSpecies {
    hatch_counter: string;
    varieties: any;
    growth_rate: any;
    shape: any;
    color: any;
    capture_rate: string;
    base_happiness: string;
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
        url: string;
      };
      version: {
        name: string;
        url: string;
      };
    }[];
    genera: {
      genus: string;
      language: {
        name: string;
        url: string;
      };
    }[];
    habitat: {
      name: string;
      url: string;
    } | null;
    is_legendary: boolean;
    is_mythical: boolean;
  }
  
  export interface EvolutionChain {
    chain: {
      species: {
        name: string;
        url: string;
      };
      evolves_to: Array<{
        species: {
          name: string;
          url: string;
        };
        evolves_to: Array<{
          species: {
            name: string;
            url: string;
          };
        }>;
      }>;
    };
  }
  
  export type PokemonTypeColors = {
    [key: string]: string;
  };