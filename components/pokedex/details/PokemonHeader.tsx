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
        <div className="relative w-48 h-48 md:w-64 md:h-64 pdx-round-soft overflow-hidden">
            <Image 
                src={pokemon.sprites.artwork}
                alt={pokemon.koreanName}
                fill
                priority
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain"
            />
            {/* Glossy overlay */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                {/* top-left diagonal gloss */}
                <div className="absolute -top-10 -left-10 w-[160%] h-1/2 rotate-[-20deg] bg-gradient-to-b from-white/35 via-white/10 to-transparent" />
                {/* subtle inner vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.08)_100%)]" />
            </div>
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
