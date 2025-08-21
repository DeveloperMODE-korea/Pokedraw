'use client';

import type { FullPokemonDetails } from '@/types/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PokemonEvolutionProps {
  pokemon: FullPokemonDetails;
}

const EvolutionStage = ({ id, name, spriteUrl }: { id: number; name: string; spriteUrl: string; }) => (
    <Link href={`/pokedex/${id}`} className="flex flex-col items-center text-center hover:bg-accent p-2 rounded-lg transition-colors">
        <div className="relative w-24 h-24">
            <Image 
                src={spriteUrl}
                alt={name}
                fill
                sizes="10vw"
                className="object-contain"
            />
        </div>
        <span className="font-bold capitalize">{name}</span>
    </Link>
);

export function PokemonEvolution({ pokemon }: PokemonEvolutionProps) {
  if (pokemon.evolutionChain.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Evolution</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center">This Pokémon does not evolve.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2">
        {pokemon.evolutionChain.map((evo, index) => (
          <div key={index} className="flex items-center justify-around w-full">
            <EvolutionStage {...evo.from} />
            <div className="flex flex-col items-center mx-4">
                <ArrowRight size={32} />
                <span className="text-xs font-semibold mt-1 text-center">{evo.trigger}</span>
            </div>
            <EvolutionStage {...evo.to} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
