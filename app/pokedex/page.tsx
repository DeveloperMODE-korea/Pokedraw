'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import type { PokemonLite } from '@/types/pokemon';
import { getPokemonList } from '@/services/pokeapi';
import { PokedexCard } from '@/components/pokedex/pokedex-card';

const POKEMON_PER_PAGE = 30;

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<PokemonLite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, { once: true });

  const fetchPokedex = async (page: number) => {
    setIsLoading(true);
    try {
      const { results, count } = await getPokemonList({ page, limit: POKEMON_PER_PAGE });
      setPokemon((prev) => [...prev, ...results]);
      if (totalPages === 0) {
        setTotalPages(Math.ceil(count / POKEMON_PER_PAGE));
      }
    } catch (error) {
      console.error("Failed to fetch Pokédex:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPokedex(1);
  }, []);

  // Infinite scroll load
  useEffect(() => {
    if (isInView && !isLoading && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [isInView, isLoading, totalPages]);

  useEffect(() => {
    if (currentPage > 1) {
        fetchPokedex(currentPage);
    }
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="pixel-title text-3xl md:text-5xl text-center mb-8 tracking-wider">POKEDEX</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {pokemon.map((p) => (
          <PokedexCard key={p.id} pokemon={p} />
        ))}
      </div>

      {/* Sentinel and Loading Spinner */}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isLoading && currentPage > 1 && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        )}
        {currentPage >= totalPages && pokemon.length > 0 && (
            <p className="text-muted-foreground">End of Pokédex.</p>
        )}
      </div>
    </div>
  );
}
