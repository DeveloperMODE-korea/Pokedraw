'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { PokemonLite } from '@/types/pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PokedexCardProps {
  pokemon: PokemonLite;
}

import { typeColors, typeKo } from '@/data/type-data';

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
                {typeKo[type] || type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
