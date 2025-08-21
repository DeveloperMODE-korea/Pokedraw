import type { FullPokemonDetails } from '@/types/pokemon';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { typeColors, typeKo } from '@/data/type-data';

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
                    {typeKo[type] || type.toUpperCase()}
                </Badge>
            ))}
        </div>
    </div>
  );
}
