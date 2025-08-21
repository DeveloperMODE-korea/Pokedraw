'use client';

import type { FullPokemonDetails } from '@/types/pokemon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PokemonAbilitiesProps {
  pokemon: FullPokemonDetails;
}

export function PokemonAbilities({ pokemon }: PokemonAbilitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>특성</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pokemon.abilities.map(ability => (
          <div key={ability.name}>
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{ability.koreanName}</h3>
                {ability.isHidden && (
                    <Badge variant="outline">Hidden</Badge>
                )}
            </div>
            <p className="text-muted-foreground mt-1">
              {ability.effect}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
