export type StatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe"

export interface Nature {
  id: string
  nameKo: string
  nameEn: string
  up?: StatKey
  down?: StatKey
  description: string
}

export interface IVSet {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

export interface PokemonLite {
  id: number
  name: string
  types: string[]
  bst: number
  spriteUrl: string
  generation: number
}

export interface GenerationTypeFilter {
  generation: number
  types: string[]
}

export interface GachaFilter {
  gens: number[]
  types: string[]
  generationTypeFilters: GenerationTypeFilter[]
  bst: [number, number]
  count: number
  allowDup: boolean
  allowEvolutionDup?: boolean
  evolutionMode?: "any" | "base" | "final"
}

export interface PokemonStats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

// --- New Types for Pokédex Detail Page ---

export interface PokemonAbility {
  name: string;
  koreanName: string;
  isHidden: boolean;
  effect: string;
}

export interface PokemonMove {
  name: string;
  koreanName: string;
  learnMethod: string;
  levelLearnedAt?: number;
  type: string;
  power?: number;
  accuracy?: number;
  pp?: number;
}

export interface EvolutionDetail {
  from: { name: string; id: number; spriteUrl: string; };
  to: { name: string; id: number; spriteUrl: string; };
  trigger: string; // e.g., "Level 16", "Use Moon Stone"
}

export interface FullPokemonDetails {
  id: number;
  name: string;
  koreanName: string;
  sprites: {
    default: string;
    shiny: string;
    artwork: string;
  };
  types: string[];
  height: number; // in meters
  weight: number; // in kg
  stats: { name: string; value: number; }[];
  abilities: PokemonAbility[];
  flavorText: string;
  generation: number;
  evolutionChain: EvolutionDetail[];
  locations: string[];
  catchRate: number; // 0-255
  baseFriendship: number; // 0-255
  genderRatio: { male: number; female: number; genderless: boolean }; // male/female are percentages
  eggGroups: string[];
  growthRate: string;
  moves: PokemonMove[];
}
