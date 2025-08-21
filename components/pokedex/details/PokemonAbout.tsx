'use client';

import type { FullPokemonDetails } from '@/types/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PokemonAboutProps {
  pokemon: FullPokemonDetails;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4">
    <dt className="font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-2 font-semibold">{value}</dd>
  </div>
);

const GenderBar = ({ male, female }: { male: number; female: number }) => {
    if (male === 0 && female === 0) {
        return <span className="text-gray-500">Genderless</span>;
    }
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
            <div style={{ width: `${male}%` }} className="bg-blue-500 h-full"></div>
            <div style={{ width: `${female}%` }} className="bg-pink-500 h-full"></div>
        </div>
    );
};

export function PokemonAbout({ pokemon }: PokemonAboutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="italic text-center text-lg text-muted-foreground">
          {pokemon.flavorText}
        </p>
        <dl className="space-y-2 text-lg">
          <InfoRow label="Height" value={`${pokemon.height} m`} />
          <InfoRow label="Weight" value={`${pokemon.weight} kg`} />
          <InfoRow label="Catch Rate" value={pokemon.catchRate} />
          <InfoRow label="Base Friendship" value={pokemon.baseFriendship} />
          <InfoRow label="Growth Rate" value={pokemon.growthRate.replace(/-/g, ' ')} />
          <InfoRow label="Egg Groups" value={pokemon.eggGroups.join(', ')} />
          <InfoRow 
            label="Gender" 
            value={<GenderBar male={pokemon.genderRatio.male} female={pokemon.genderRatio.female} />} 
          />
        </dl>
      </CardContent>
    </Card>
  );
}
