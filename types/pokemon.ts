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
}

export interface PokemonStats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}
