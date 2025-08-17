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
      let candidateIds: number[] = []

      // 타입 필터가 있는 경우: 타입별로 포켓몬을 가져온 후 세대 필터 적용
      if (filters.types.length > 0) {
        const typeIds = await getPokemonIdsByType(filters.types)
        const genIds = await getPokemonIdsByGeneration(filters.gens)
        
        // 타입과 세대의 교집합 구하기
        const typeSet = new Set(typeIds)
        candidateIds = genIds.filter(id => typeSet.has(id))
        
        console.log(`타입 필터 적용 후: ${candidateIds.length}마리`)
      } else {
        // 타입 필터가 없는 경우: 세대별로만 가져오기
        candidateIds = await getPokemonIdsByGeneration(filters.gens)
      }

      // 결과가 너무 많은 경우 제한
      if (candidateIds.length > 800) {
        candidateIds = candidateIds.slice(0, 800)
        console.log(`결과 제한: 800마리로 제한됨`)
      }

      // 포켓몬 데이터 가져오기
      const pokemonData = await fetchPokemonBatch(candidateIds)

      // BST 필터 적용
      const filteredPokemon = pokemonData.filter((p) => p.bst >= filters.bst[0] && p.bst <= filters.bst[1])

      console.log(`최종 필터 결과: ${filteredPokemon.length}마리 (세대: ${filters.gens.join(',')}, 타입: ${filters.types.join(',') || '전체'}, BST: ${filters.bst[0]}-${filters.bst[1]})`)

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
