'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { FullPokemonDetails } from '@/types/pokemon';
import { getFullPokemonDetails } from '@/services/pokeapi';

// Import detail components
import { PokemonHeader } from '@/components/pokedex/details/PokemonHeader';
import { PokemonAbout } from '@/components/pokedex/details/PokemonAbout';
import { PokemonStats } from '@/components/pokedex/details/PokemonStats';
import { PokemonEvolution } from '@/components/pokedex/details/PokemonEvolution';
import { PokemonAbilities } from '@/components/pokedex/details/PokemonAbilities';

export default function PokemonDetailPage() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<FullPokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await getFullPokemonDetails(id as string);
        if (details) {
          setPokemon(details);
        } else {
          setError('Pokémon not found.');
        }
      } catch (err) {
        setError('Failed to fetch Pokémon details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;
  }

  if (!pokemon) {
    return null; // Should be covered by error state, but as a fallback
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-8">
      <PokemonHeader pokemon={pokemon} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PokemonAbout pokemon={pokemon} />
        <PokemonStats pokemon={pokemon} />
        <PokemonAbilities pokemon={pokemon} />
        <PokemonEvolution pokemon={pokemon} />
      </div>
    </div>
  );
}
