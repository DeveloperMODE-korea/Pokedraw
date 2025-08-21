'use client';

import type { FullPokemonDetails } from '@/types/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PokemonStatsProps {
  pokemon: FullPokemonDetails;
}

const statNameMapping: { [key: string]: string } = {
    hp: 'HP',
    attack: '공격',
    defense: '방어',
    'special-attack': '특공',
    'special-defense': '특방',
    speed: '스피드',
};

const statColorMapping: { [key: string]: string } = {
    hp: 'bg-red-500',
    attack: 'bg-orange-500',
    defense: 'bg-yellow-500',
    'special-attack': 'bg-blue-500',
    'special-defense': 'bg-green-500',
    speed: 'bg-pink-500',
};

const StatRow = ({ name, value }: { name: string; value: number }) => {
  const MAX_STAT = 255;
  const percentage = (value / MAX_STAT) * 100;

  return (
    <div className="grid grid-cols-6 gap-2 items-center">
      <dt className="col-span-2 font-medium text-muted-foreground text-right">{statNameMapping[name] || name}</dt>
      <dd className="col-span-1 font-semibold text-center">{value}</dd>
      <dd className="col-span-3">
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div 
            className={`h-4 rounded-full ${statColorMapping[name] || 'bg-gray-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </dd>
    </div>
  );
};

export function PokemonStats({ pokemon }: PokemonStatsProps) {
  const bst = pokemon.stats.reduce((total, stat) => total + stat.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 능력치</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {pokemon.stats.map(stat => (
          <StatRow key={stat.name} name={stat.name} value={stat.value} />
        ))}
        <div className="grid grid-cols-6 gap-2 items-center pt-2 border-t-2">
                        <dt className="col-span-2 font-bold text-muted-foreground text-right">총합</dt>
            <dd className="col-span-1 font-bold text-center">{bst}</dd>
            <dd className="col-span-3"></dd>
        </div>
      </CardContent>
    </Card>
  );
}

