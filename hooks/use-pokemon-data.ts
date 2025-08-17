"use client"

import { useState, useEffect, useCallback } from "react"
import { getPokemonIdsByGeneration, getPokemonIdsByType, fetchPokemonBatch } from "@/services/pokeapi"
import type { PokemonLite, GachaFilter } from "@/types/pokemon"

interface UsePokemonDataReturn {
  pokemon: PokemonLite[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePokemonData(filters: GachaFilter): UsePokemonDataReturn {
  const [pokemon, setPokemon] = useState<PokemonLite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (filters.gens.length === 0) {
      setPokemon([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get Pokemon IDs by generation
      let candidateIds = await getPokemonIdsByGeneration(filters.gens)

      // Filter by type if specified
      if (filters.types.length > 0) {
        const typeIds = await getPokemonIdsByType(filters.types)
        candidateIds = candidateIds.filter((id) => typeIds.includes(id))
      }

      if (candidateIds.length > 800) {
        candidateIds = candidateIds.slice(0, 800) // Increased from 500
      }

      // Fetch Pokemon data
      const pokemonData = await fetchPokemonBatch(candidateIds)

      // Apply BST filter
      const filteredPokemon = pokemonData.filter((p) => p.bst >= filters.bst[0] && p.bst <= filters.bst[1])

      setPokemon(filteredPokemon)
    } catch (err) {
      console.error("Failed to fetch Pokemon data:", err)
      setError("데이터 로딩에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }, [filters.gens, filters.types, filters.bst])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { pokemon, loading, error, refetch }
}
