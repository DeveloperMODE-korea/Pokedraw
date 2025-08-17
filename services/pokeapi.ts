// PokéAPI service layer with caching and error handling
export interface PokeAPISprites {
  front_default: string | null
  other?: {
    "official-artwork"?: {
      front_default: string | null
    }
  }
  versions?: {
    "generation-v"?: {
      "black-white"?: {
        animated?: {
          front_default: string | null
        }
      }
    }
  }
}

export interface PokeAPIStat {
  base_stat: number
  stat: {
    name: string
  }
}

export interface PokeAPIPokemon {
  id: number
  name: string
  sprites: PokeAPISprites
  stats: PokeAPIStat[]
  types: Array<{
    type: {
      name: string
    }
  }>
  species: {
    url: string
  }
}

export interface PokeAPISpecies {
  generation: {
    name: string
  }
}

export interface PokeAPIGeneration {
  pokemon_species: Array<{
    name: string
    url: string
  }>
}

export interface PokeAPIType {
  pokemon: Array<{
    pokemon: {
      name: string
      url: string
    }
  }>
}

const POKEAPI_BASE = "https://pokeapi.co/api/v2"

// Cache for API responses
const cache = new Map<string, any>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCacheKey(url: string): string {
  return url
}

function isExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_DURATION
}

async function fetchWithCache<T>(url: string): Promise<T> {
  const cacheKey = getCacheKey(url)
  const cached = cache.get(cacheKey)

  if (cached && !isExpired(cached.timestamp)) {
    return cached.data
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error)
    // Return cached data if available, even if expired
    if (cached) {
      return cached.data
    }
    throw error
  }
}

export function getPokemonSpriteUrl(sprites: PokeAPISprites): string {
  // Priority: Gen V animated → Official artwork → Default sprite → Placeholder
  if (sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default) {
    return sprites.versions["generation-v"]["black-white"].animated.front_default
  }

  if (sprites.other?.["official-artwork"]?.front_default) {
    return sprites.other["official-artwork"].front_default
  }

  if (sprites.front_default) {
    return sprites.front_default
  }

  return "/diverse-pokemon-gathering.png"
}

export function calculateBST(stats: PokeAPIStat[]): number {
  return stats.reduce((total, stat) => total + stat.base_stat, 0)
}

export function getGenerationNumber(generationName: string): number {
  const match = generationName.match(/generation-(\w+)/)
  if (!match) return 1

  const romanNumerals: Record<string, number> = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
    vii: 7,
    viii: 8,
    ix: 9,
  }

  return romanNumerals[match[1]] || 1
}

export async function fetchPokemon(idOrName: string | number): Promise<PokeAPIPokemon> {
  const url = `${POKEAPI_BASE}/pokemon/${idOrName}`
  return fetchWithCache<PokeAPIPokemon>(url)
}

export async function fetchPokemonSpecies(idOrName: string | number): Promise<PokeAPISpecies> {
  const url = `${POKEAPI_BASE}/pokemon-species/${idOrName}`
  return fetchWithCache<PokeAPISpecies>(url)
}

export async function fetchGeneration(id: number): Promise<PokeAPIGeneration> {
  const url = `${POKEAPI_BASE}/generation/${id}`
  return fetchWithCache<PokeAPIGeneration>(url)
}

export async function fetchType(name: string): Promise<PokeAPIType> {
  const url = `${POKEAPI_BASE}/type/${name}`
  return fetchWithCache<PokeAPIType>(url)
}

// Get Pokemon IDs from generation
export async function getPokemonIdsByGeneration(generations: number[]): Promise<number[]> {
  const allIds: number[] = []

  for (const gen of generations) {
    try {
      const generation = await fetchGeneration(gen)
      const ids = generation.pokemon_species
        .map((species) => {
          const match = species.url.match(/\/(\d+)\/$/)
          return match ? Number.parseInt(match[1]) : 0
        })
        .filter((id) => id > 0)

      allIds.push(...ids)
    } catch (error) {
      console.error(`Failed to fetch generation ${gen}:`, error)
    }
  }

  return [...new Set(allIds)].sort((a, b) => a - b)
}

// Get Pokemon IDs by type
export async function getPokemonIdsByType(types: string[]): Promise<number[]> {
  if (types.length === 0) return []

  const allIds: number[] = []

  for (const type of types) {
    try {
      const typeData = await fetchType(type)
      const ids = typeData.pokemon
        .map((p) => {
          const match = p.pokemon.url.match(/\/(\d+)\/$/)
          return match ? Number.parseInt(match[1]) : 0
        })
        .filter((id) => id > 0)

      allIds.push(...ids)
    } catch (error) {
      console.error(`Failed to fetch type ${type}:`, error)
    }
  }

  return [...new Set(allIds)].sort((a, b) => a - b)
}

// Convert API data to our PokemonLite format
export async function convertToPokemonLite(pokemon: PokeAPIPokemon): Promise<import("@/types/pokemon").PokemonLite> {
  let generation = 1

  try {
    const species = await fetchPokemonSpecies(pokemon.id)
    generation = getGenerationNumber(species.generation.name)
  } catch (error) {
    console.error(`Failed to fetch species for ${pokemon.name}:`, error)
  }

  return {
    id: pokemon.id,
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    types: pokemon.types.map((t) => t.type.name),
    bst: calculateBST(pokemon.stats),
    spriteUrl: getPokemonSpriteUrl(pokemon.sprites),
    generation,
  }
}

// Batch fetch Pokemon with error handling
export async function fetchPokemonBatch(
  ids: number[],
  maxConcurrent = 10,
): Promise<import("@/types/pokemon").PokemonLite[]> {
  const results: import("@/types/pokemon").PokemonLite[] = []

  // Process in batches to avoid overwhelming the API
  for (let i = 0; i < ids.length; i += maxConcurrent) {
    const batch = ids.slice(i, i + maxConcurrent)

    const promises = batch.map(async (id) => {
      try {
        const pokemon = await fetchPokemon(id)
        return await convertToPokemonLite(pokemon)
      } catch (error) {
        console.error(`Failed to fetch Pokemon ${id}:`, error)
        return null
      }
    })

    const batchResults = await Promise.all(promises)
    results.push(...(batchResults.filter((p) => p !== null) as import("@/types/pokemon").PokemonLite[]))

    // Small delay between batches to be respectful to the API
    if (i + maxConcurrent < ids.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return results
}
