'use client';

import type { FullPokemonDetails } from '@/types/pokemon';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

// Re-using type colors from PokedexCard for consistency
const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-400 text-white',
    fire: 'bg-red-500 text-white',
    water: 'bg-blue-500 text-white',
    electric: 'bg-yellow-400 text-black',
    grass: 'bg-green-500 text-white',
    ice: 'bg-blue-200 text-black',
    fighting: 'bg-red-700 text-white',
    poison: 'bg-purple-500 text-white',
    ground: 'bg-yellow-600 text-white',
    flying: 'bg-indigo-400 text-white',
    psychic: 'bg-pink-500 text-white',
    bug: 'bg-lime-500 text-white',
    rock: 'bg-yellow-700 text-white',
    ghost: 'bg-purple-700 text-white',
    dragon: 'bg-indigo-700 text-white',
    dark: 'bg-gray-700 text-white',
    steel: 'bg-gray-500 text-white',
    fairy: 'bg-pink-300 text-black',
};

interface PokemonHeaderProps {
  pokemon: FullPokemonDetails;
}

export function PokemonHeader({ pokemon }: PokemonHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
        <div className="relative w-48 h-48 md:w-64 md:h-64">
            <Image 
                src={pokemon.sprites.artwork}
                alt={pokemon.koreanName}
                fill
                priority
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain"
            />
        </div>
        <span className="text-xl text-muted-foreground">#{String(pokemon.id).padStart(4, '0')}</span>
        <h1 className="text-4xl md:text-5xl font-bold capitalize">{pokemon.koreanName}</h1>
        <div className="flex gap-2 mt-2">
            {pokemon.types.map(type => (
                <Badge key={type} className={`${typeColors[type] || 'bg-gray-400 text-white'} text-lg px-4 py-1`}>
                    {type.toUpperCase()}
                </Badge>
            ))}
        </div>
    </div>
  );
}
