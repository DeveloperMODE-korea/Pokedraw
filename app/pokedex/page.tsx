'use client';

import { useState, useEffect } from 'react';
import type { PokemonLite } from '@/types/pokemon';
import { getPokemonList } from '@/services/pokeapi';
import { PokedexCard } from '@/components/pokedex/pokedex-card';
import { Pagination } from '@/components/pokedex/pagination';

const POKEMON_PER_PAGE = 30;

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<PokemonLite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPokedex = async () => {
      setIsLoading(true);
      try {
        const { results, count } = await getPokemonList({ page: currentPage, limit: POKEMON_PER_PAGE });
        setPokemon(results);
        setTotalPages(Math.ceil(count / POKEMON_PER_PAGE));
      } catch (error) {
        console.error("Failed to fetch Pokédex:", error);
        // Handle error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokedex();
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Pokédex</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {pokemon.map((p) => (
              <PokedexCard key={p.id} pokemon={p} />
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
