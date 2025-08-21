// PokéAPI service layer with caching and error handling
export interface PokeAPISprites {
  front_default: string | null
  front_shiny: string | null
  other?: {
    "official-artwork"?: {
      front_default: string | null
      front_shiny?: string | null
    }
  }
  versions?: {
    "generation-v"?: {
      "black-white"?: {
        animated?: {
          front_default: string | null
          front_shiny?: string | null
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
  abilities?: Array<{
    is_hidden?: boolean
    ability: { name: string; url: string }
  }>
  moves?: Array<{
    move: { name: string; url: string }
  }>
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
  names?: Array<{
    name: string
    language: { name: string }
  }>
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

// Localized name entry
interface PokeAPINameEntry {
  name: string
  language: { name: string }
}

// Ability / Move resources for localization
interface PokeAPIAbilityResource {
  id: number
  name: string
  names?: PokeAPINameEntry[]
}

interface PokeAPIMoveResource {
  id: number
  name: string
  names?: PokeAPINameEntry[]
}

// Encounters
export interface PokeAPIEncounter {
  location_area: { name: string; url: string }
}

// Evolution chain
interface PokeAPIEvolutionChainNode {
  species: { name: string; url: string }
  evolves_to: PokeAPIEvolutionChainNode[]
}
interface PokeAPIEvolutionChain {
  id: number
  chain: PokeAPIEvolutionChainNode
}

// Location area resource for localization
interface PokeAPILocationArea {
  names?: PokeAPINameEntry[]
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

const STORAGE_KEY = "pokedraw_cache"
const STORAGE_VERSION = "1.0"

interface CacheEntry {
  data: any
  timestamp: number
  version: string
}

function getFromStorage(key: string): any | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`)
    if (!stored) return null

    const entry: CacheEntry = JSON.parse(stored)
    if (entry.version !== STORAGE_VERSION || isExpired(entry.timestamp)) {
      localStorage.removeItem(`${STORAGE_KEY}_${key}`)
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

function saveToStorage(key: string, data: any): void {
  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      version: STORAGE_VERSION,
    }
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(entry))
  } catch {
    // Storage full or disabled, ignore
  }
}

async function fetchWithCache<T>(url: string): Promise<T> {
  const cacheKey = getCacheKey(url)

  // Check memory cache first
  const cached = cache.get(cacheKey)
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data
  }

  // Check localStorage cache
  const stored = getFromStorage(cacheKey)
  if (stored) {
    cache.set(cacheKey, { data: stored, timestamp: Date.now() })
    return stored
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Save to both caches
    cache.set(cacheKey, { data, timestamp: Date.now() })
    saveToStorage(cacheKey, data)

    return data
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error)
    // Return cached data if available, even if expired
    if (cached) {
      return cached.data
    }
    if (stored) {
      return stored
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

async function fetchAbilityResource(idOrName: string | number): Promise<PokeAPIAbilityResource> {
  const url = `${POKEAPI_BASE}/ability/${idOrName}`
  return fetchWithCache<PokeAPIAbilityResource>(url)
}

async function fetchMoveResource(idOrName: string | number): Promise<PokeAPIMoveResource> {
  const url = `${POKEAPI_BASE}/move/${idOrName}`
  return fetchWithCache<PokeAPIMoveResource>(url)
}

export async function fetchPokemonEncounters(idOrName: number | string): Promise<PokeAPIEncounter[]> {
  const url = `${POKEAPI_BASE}/pokemon/${idOrName}/encounters`
  return fetchWithCache<PokeAPIEncounter[]>(url)
}

async function fetchEvolutionChainByUrl(url: string): Promise<PokeAPIEvolutionChain> {
  return fetchWithCache<PokeAPIEvolutionChain>(url)
}

async function fetchLocationAreaByUrl(url: string): Promise<PokeAPILocationArea> {
  return fetchWithCache<PokeAPILocationArea>(url)
}

// Get Pokemon IDs from generation
const GENERATION_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
}

export async function getPokemonIdsByGeneration(generations: number[]): Promise<number[]> {
  const allIds: number[] = []

  for (const gen of generations) {
    const range = GENERATION_RANGES[gen]
    if (range) {
      // Use hardcoded ranges instead of API calls
      for (let id = range[0]; id <= range[1]; id++) {
        allIds.push(id)
      }
    }
  }

  const sortedIds = allIds.sort((a, b) => a - b)
  
  console.log(`세대 ${generations.join(', ')} 필터 결과: ${sortedIds.length}마리`)
  
  return sortedIds
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

  // 중복 제거 및 정렬
  const uniqueIds = [...new Set(allIds)].sort((a, b) => a - b)
  
  console.log(`타입 ${types.join(', ')} 필터 결과: ${uniqueIds.length}마리`)
  
  return uniqueIds
}

// Convert API data to our PokemonLite format
function getGenerationFromId(id: number): number {
  for (const [gen, [start, end]] of Object.entries(GENERATION_RANGES)) {
    if (id >= start && id <= end) {
      return Number(gen)
    }
  }
  return 1
}

export async function convertToPokemonLite(pokemon: PokeAPIPokemon): Promise<import("@/types/pokemon").PokemonLite> {
  const generation = getGenerationFromId(pokemon.id)
  let displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  try {
    // Try to localize Pokemon name to Korean via species.names
    const match = pokemon.species.url.match(/\/pokemon-species\/(\d+)\//)
    const speciesId = match ? Number.parseInt(match[1]) : pokemon.id
    const species = await fetchPokemonSpecies(speciesId)
    const ko = species.names?.find((n) => n.language?.name === "ko" || n.language?.name === "ko-Hrkt")?.name
    if (ko) displayName = ko
  } catch (e) {
    // ignore localization failure; fallback to english name
  }

  return {
    id: pokemon.id,
    name: displayName,
    types: pokemon.types.map((t) => t.type.name),
    bst: calculateBST(pokemon.stats),
    spriteUrl: getPokemonSpriteUrl(pokemon.sprites),
    generation,
  }
}

// --- Ability & Moves helpers ---
export async function getRandomAbilityForPokemon(
  idOrName: number | string,
  options?: { includeHidden?: boolean },
): Promise<string | null> {
  try {
    const data = await fetchPokemon(idOrName)
    const abilities = (data.abilities || []).filter((a) => (options?.includeHidden ? true : !a.is_hidden))
    if (abilities.length === 0) return null
    const pick = abilities[Math.floor(Math.random() * abilities.length)]
    return pick.ability.name
  } catch (e) {
    console.error("getRandomAbilityForPokemon failed", e)
    return null
  }
}

export async function getRandomMovesForPokemon(
  idOrName: number | string,
  count = 4,
): Promise<string[]> {
  try {
    const data = await fetchPokemon(idOrName)
    const moves = (data.moves || []).map((m) => m.move.name)
    if (moves.length === 0) return []
    const unique = Array.from(new Set(moves))
    const picked: string[] = []
    const used = new Set<number>()
    const max = Math.min(count, unique.length)
    while (picked.length < max && used.size < unique.length) {
      const idx = Math.floor(Math.random() * unique.length)
      if (used.has(idx)) continue
      used.add(idx)
      picked.push(unique[idx])
    }
    return picked
  } catch (e) {
    console.error("getRandomMovesForPokemon failed", e)
    return []
  }
}

// --- Localization helpers ---
const abilityKoCache = new Map<string | number, string>()
const moveKoCache = new Map<string | number, string>()

function koFallbackFromSlug(slug: string): string {
  // Fallback: prettify english slug if ko not found
  return slug.replace(/-/g, " ")
}

export async function getAbilityNameKo(idOrName: string | number): Promise<string> {
  if (abilityKoCache.has(idOrName)) return abilityKoCache.get(idOrName) as string
  try {
    const res = await fetchAbilityResource(idOrName)
    const ko = res.names?.find((n) => n.language?.name === "ko" || n.language?.name === "ko-Hrkt")?.name
    const name = ko || koFallbackFromSlug(res.name)
    abilityKoCache.set(idOrName, name)
    return name
  } catch (e) {
    console.error("getAbilityNameKo failed", e)
    return typeof idOrName === "string" ? koFallbackFromSlug(idOrName) : String(idOrName)
  }
}

export async function getMoveNameKo(idOrName: string | number): Promise<string> {
  if (moveKoCache.has(idOrName)) return moveKoCache.get(idOrName) as string
  try {
    const res = await fetchMoveResource(idOrName)
    const ko = res.names?.find((n) => n.language?.name === "ko" || n.language?.name === "ko-Hrkt")?.name
    const name = ko || koFallbackFromSlug(res.name)
    moveKoCache.set(idOrName, name)
    return name
  } catch (e) {
    console.error("getMoveNameKo failed", e)
    return typeof idOrName === "string" ? koFallbackFromSlug(idOrName) : String(idOrName)
  }
}

// --- Encounters (Korean where available) ---
const locationAreaKoCache = new Map<string, string>()

const REGION_KO: Record<string, string> = {
  kanto: "관동",
  johto: "성도",
  hoenn: "호연",
  sinnoh: "신오",
  unova: "하나",
  kalos: "칼로스",
  alola: "알로라",
  galar: "가라르",
  paldea: "팔데아",
}

function toTitleCase(input: string): string {
  return input
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
}

function translateLocationAreaSlugToKo(slug: string): string {
  const name = slug.replace(/-/g, " ")

  // Region + Route pattern: e.g., "sinnoh route 202 area"
  const routeMatch = name.match(/^(kanto|johto|hoenn|sinnoh|unova|kalos|alola|galar|paldea)\s+route\s+(\d+)/)
  if (routeMatch) {
    const region = REGION_KO[routeMatch[1]] || toTitleCase(routeMatch[1])
    const no = routeMatch[2]
    return `${region} ${no}번 도로`
  }

  // City/Town pattern: e.g., "castelia city area"
  const cityMatch = name.match(/^(.*)\s+city\s+area$/)
  if (cityMatch) {
    return `${toTitleCase(cityMatch[1])} 시티`
  }
  const townMatch = name.match(/^(.*)\s+town\s+area$/)
  if (townMatch) {
    return `${toTitleCase(townMatch[1])} 타운`
  }

  // Generic keyword replacements
  const map: Record<string, string> = {
    forest: "숲",
    cave: "동굴",
    mountain: "산",
    mt: "산",
    lake: "호수",
    meadow: "초원",
    valley: "계곡",
    bridge: "다리",
    port: "항구",
    harbor: "항구",
    gate: "게이트",
    ruins: "유적",
    desert: "사막",
    park: "공원",
    swamp: "습지",
    marsh: "습지",
    area: "",
    route: "도로",
  }

  const words = name.split(/\s+/).map((w) => map[w] ?? w)
  // If includes a standalone number and 'route', format as 번 도로
  const idxRoute = words.indexOf("도로")
  if (idxRoute > 0 && /^(\d+)$/.test(words[idxRoute - 1])) {
    const num = words[idxRoute - 1]
    words.splice(idxRoute - 1, 2, `${num}번 도로`)
  }
  return words.filter(Boolean).join(" ")
}

export async function getEncounterAreasKo(
  idOrName: number | string,
  limit = 5,
): Promise<string[]> {
  try {
    const data = await fetchPokemonEncounters(idOrName)
    const uniqueAreas: Array<{ name: string; url: string }> = []
    const seen = new Set<string>()
    for (const e of data) {
      if (!seen.has(e.location_area.name)) {
        seen.add(e.location_area.name)
        uniqueAreas.push(e.location_area)
      }
      if (uniqueAreas.length >= limit) break
    }

    const names = await Promise.all(
      uniqueAreas.map(async (a) => {
        if (locationAreaKoCache.has(a.url)) return locationAreaKoCache.get(a.url) as string
        try {
          const res = await fetchLocationAreaByUrl(a.url)
          const ko = res.names?.find((n) => n.language?.name === "ko" || n.language?.name === "ko-Hrkt")?.name
          const pretty = ko || translateLocationAreaSlugToKo(a.name)
          locationAreaKoCache.set(a.url, pretty)
          return pretty
        } catch {
          return translateLocationAreaSlugToKo(a.name)
        }
      }),
    )
    return names
  } catch (e) {
    console.error("getEncounterAreasKo failed", e)
    return []
  }
}

// --- Evolution chain (Korean) ---
const speciesKoCache = new Map<number, string>()

async function getSpeciesKoNameByUrl(url: string): Promise<string> {
  const match = url.match(/\/pokemon-species\/(\d+)\//)
  const id = match ? Number.parseInt(match[1]) : 0
  if (id && speciesKoCache.has(id)) return speciesKoCache.get(id) as string
  try {
    const species = await fetchPokemonSpecies(id || url)
    const ko = species.names?.find((n) => n.language?.name === "ko" || n.language?.name === "ko-Hrkt")?.name
    const name = ko || `#${id}`
    if (id) speciesKoCache.set(id, name)
    return name
  } catch {
    return `#${id}`
  }
}

function flattenEvolutionChain(node: PokeAPIEvolutionChainNode, acc: string[] = []): string[] {
  acc.push(node.species.url)
  if (node.evolves_to && node.evolves_to.length > 0) {
    for (const child of node.evolves_to) flattenEvolutionChain(child, acc)
  }
  return acc
}

export async function getEvolutionChainKoByPokemon(idOrName: number | string): Promise<string[]> {
  try {
    const species = await fetchPokemonSpecies(idOrName)
    const chainUrl = (species as any).evolution_chain?.url as string | undefined
    if (!chainUrl) return []
    const chain = await fetchEvolutionChainByUrl(chainUrl)
    const urls = flattenEvolutionChain(chain.chain, [])
    const names = await Promise.all(urls.map((u) => getSpeciesKoNameByUrl(u)))
    // Deduplicate while preserving order
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const n of names) {
      if (!seen.has(n)) {
        seen.add(n)
        ordered.push(n)
      }
    }
    return ordered
  } catch (e) {
    console.error("getEvolutionChainKoByPokemon failed", e)
    return []
  }
}

export async function getEvolutionChainIdsByPokemon(idOrName: number | string): Promise<number[]> {
  try {
    const species = await fetchPokemonSpecies(idOrName)
    const chainUrl = (species as any).evolution_chain?.url as string | undefined
    if (!chainUrl) return []
    const chain = await fetchEvolutionChainByUrl(chainUrl)
    const urls = flattenEvolutionChain(chain.chain, [])
    const ids = urls
      .map((u) => {
        const m = u.match(/\/pokemon-species\/(\d+)\//)
        return m ? Number.parseInt(m[1]) : 0
      })
      .filter((n) => n > 0)
    return Array.from(new Set(ids)).sort((a, b) => a - b)
  } catch (e) {
    console.error("getEvolutionChainIdsByPokemon failed", e)
    return []
  }
}

export async function getEvolutionStageInfoByPokemon(
  idOrName: number | string,
): Promise<{ chainIds: number[]; baseId: number; finalIds: number[] }> {
  const species = await fetchPokemonSpecies(idOrName)
  const chainUrl = (species as any).evolution_chain?.url as string | undefined
  if (!chainUrl) return { chainIds: [], baseId: typeof idOrName === "number" ? idOrName : 0, finalIds: [] }
  const chain = await fetchEvolutionChainByUrl(chainUrl)

  // collect all species urls and final leaves
  const chainIds: number[] = []
  const finalIds: number[] = []

  function walk(node: PokeAPIEvolutionChainNode) {
    const m = node.species.url.match(/\/pokemon-species\/(\d+)\//)
    const sid = m ? Number.parseInt(m[1]) : 0
    if (sid) chainIds.push(sid)
    if (!node.evolves_to || node.evolves_to.length === 0) {
      if (sid) finalIds.push(sid)
      return
    }
    for (const child of node.evolves_to) walk(child)
  }

  walk(chain.chain)
  const mBase = chain.chain.species.url.match(/\/pokemon-species\/(\d+)\//)
  const baseId = mBase ? Number.parseInt(mBase[1]) : 0
  return { chainIds: Array.from(new Set(chainIds)).sort((a, b) => a - b), baseId, finalIds: Array.from(new Set(finalIds)).sort((a, b) => a - b) }
}

// Batch fetch Pokemon with error handling
export async function getPokemonList({
  page = 1,
  limit = 30,
}: { page?: number; limit?: number }): Promise<{ results: import("@/types/pokemon").PokemonLite[]; count: number }> {
  const offset = (page - 1) * limit;
  const listUrl = `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`;

  const listResponse = await fetchWithCache<{ count: number; results: Array<{ name: string; url: string }> }>(
    listUrl
  );

  const ids = listResponse.results.map((p) => {
    const match = p.url.match(/\/(\d+)\/$/);
    return match ? Number.parseInt(match[1]) : 0;
  }).filter(id => id > 0);

  const pokemonDetails = await fetchPokemonBatch(ids);

  return {
    results: pokemonDetails,
    count: listResponse.count,
  };
}

export async function fetchPokemonBatch(
  ids: number[],
  maxConcurrent = 20, // Increased from 10
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

    if (i + maxConcurrent < ids.length) {
      await new Promise((resolve) => setTimeout(resolve, 50)) // Reduced from 100ms
    }
  }

  return results
}

// --- New function for Pokédex Detail Page ---

// Helper to extract a clean sprite object
function getSpriteUrls(sprites: PokeAPISprites) {
  return {
    default: sprites.other?.['official-artwork']?.front_default || sprites.front_default || '/placeholder.svg',
    shiny: sprites.other?.['official-artwork']?.front_shiny || sprites.front_shiny || '/placeholder.svg',
    animated: sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || sprites.front_default || '/placeholder.svg',
  };
}

// Helper to parse the evolution chain
async function parseEvolutionChain(chainNode: any): Promise<import("@/types/pokemon").EvolutionDetail[]> {
  const evolutions: import("@/types/pokemon").EvolutionDetail[] = [];
  let currentNode = chainNode;

  while (currentNode && currentNode.evolves_to.length > 0) {
    const fromSpecies = await fetchPokemon(currentNode.species.name);
    for (const evolution of currentNode.evolves_to) {
      const toSpecies = await fetchPokemon(evolution.species.name);
      
      // Find the evolution trigger
      const details = evolution.evolution_details[0];
      let trigger = "Unknown";
      if (details) {
        if (details.trigger.name === 'level-up') {
          trigger = `Level ${details.min_level}`;
        } else if (details.trigger.name === 'trade') {
          trigger = 'Trade';
        } else if (details.trigger.name === 'use-item') {
          trigger = `Use ${details.item.name.replace(/-/g, ' ')}`;
        } else if (details.trigger.name === 'shed') {
            trigger = 'Shed';
        } else {
            trigger = details.trigger.name.replace(/-/g, ' ');
        }
      }

      evolutions.push({
        from: { 
          id: fromSpecies.id,
          name: (await getSpeciesKoNameByUrl(fromSpecies.species.url)) || fromSpecies.name,
          spriteUrl: getSpriteUrls(fromSpecies.sprites).default,
        },
        to: { 
          id: toSpecies.id,
          name: (await getSpeciesKoNameByUrl(toSpecies.species.url)) || toSpecies.name,
          spriteUrl: getSpriteUrls(toSpecies.sprites).default,
        },
        trigger,
      });
    }
    currentNode = currentNode.evolves_to[0];
  }
  return evolutions;
}

export async function getFullPokemonDetails(
  idOrName: string | number
): Promise<import("@/types/pokemon").FullPokemonDetails | null> {
  try {
    // 1. Fetch primary and species data in parallel
    const [pokemonData, speciesData] = await Promise.all([
      fetchPokemon(idOrName),
      fetchPokemonSpecies(idOrName),
    ]);

    // 2. Fetch evolution chain
    const evolutionChainUrl = speciesData.evolution_chain?.url;
    const evolutionChainData = evolutionChainUrl ? await fetchWithCache<any>(evolutionChainUrl) : null;

    // 3. Map data to our FullPokemonDetails structure
    const koreanName = speciesData.names?.find(n => n.language.name === 'ko')?.name || pokemonData.name;
    const flavorText = speciesData.flavor_text_entries?.find(ft => ft.language.name === 'ko')?.flavor_text || '';

    const abilities = await Promise.all(
        pokemonData.abilities?.map(async (a) => {
            const abilityData = await fetchWithCache<any>(a.ability.url);
            const koreanEffect = abilityData.flavor_text_entries?.find((ft: any) => ft.language.name === 'ko')?.flavor_text;
            return {
                name: a.ability.name,
                koreanName: abilityData.names?.find((n: any) => n.language.name === 'ko')?.name || a.ability.name,
                isHidden: a.is_hidden,
                effect: koreanEffect || abilityData.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect || '',
            };
        }) || []
    );

    const evolutionChain = evolutionChainData ? await parseEvolutionChain(evolutionChainData.chain) : [];

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      koreanName,
      sprites: getSpriteUrls(pokemonData.sprites),
      types: pokemonData.types.map((t) => t.type.name),
      height: pokemonData.height / 10, // Convert to meters
      weight: pokemonData.weight / 10, // Convert to kg
      stats: pokemonData.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
      abilities,
      flavorText,
      generation: getGenerationNumber(speciesData.generation.name),
      evolutionChain,
      locations: [], // Placeholder
      catchRate: speciesData.capture_rate,
      baseFriendship: speciesData.base_happiness,
      genderRatio: { 
          male: speciesData.gender_rate === -1 ? 0 : (8 - speciesData.gender_rate) * 12.5,
          female: speciesData.gender_rate === -1 ? 0 : speciesData.gender_rate * 12.5,
          genderless: speciesData.gender_rate === -1,
       },
      eggGroups: speciesData.egg_groups.map(g => g.name),
      growthRate: speciesData.growth_rate.name,
      moves: [], // Placeholder
    };
  } catch (error) {
    console.error(`Failed to get full details for ${idOrName}:`, error);
    return null;
  }
}
