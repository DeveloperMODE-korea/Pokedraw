'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { PokemonLite } from '@/types/pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PokedexCardProps {
  pokemon: PokemonLite;
}

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export function PokedexCard({ pokemon }: PokedexCardProps) {
  return (
    <Link href={`/pokedex/${pokemon.id}`}>
      <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-2">
            <Image
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xs text-gray-500">#{String(pokemon.id).padStart(4, '0')}</span>
          <h3 className="text-lg font-bold capitalize">{pokemon.name}</h3>
          <div className="flex gap-1 mt-2">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                className={`text-white text-xs ${typeColors[type] || 'bg-gray-400'}`}
              >
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
