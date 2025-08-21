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
        return <span className="text-gray-500">무성별</span>;
    }
    return (
        <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
            <div style={{ width: `${male}%` }} className="bg-blue-500 h-full"></div>
            <div style={{ width: `${female}%` }} className="bg-pink-500 h-full"></div>
        </div>
    );
};

export function PokemonAbout({ pokemon }: PokemonAboutProps) {
  // 영어 값을 한국어로 변환하는 간단한 매핑들
  const growthRateKo: Record<string, string> = {
    slow: '느림',
    medium: '보통',
    fast: '빠름',
    'medium-slow': '보통-느림',
    'slow-then-very-fast': '느림-매우빠름',
    'fast-then-very-slow': '빠름-매우느림',
  };

  const eggGroupKo: Record<string, string> = {
    monster: '괴수',
    water1: '수중1',
    water2: '수중2',
    water3: '수중3',
    bug: '벌레',
    flying: '비행',
    ground: '육상',
    fairy: '요정',
    plant: '식물',
    'human-like': '인간형',
    humanshape: '인간형',
    mineral: '광물',
    amorphous: '부정형',
    indeterminate: '부정형',
    ditto: '메타몽',
    dragon: '드래곤',
    'no-eggs': '미발견',
  };

  const growthRateText = growthRateKo[pokemon.growthRate] || pokemon.growthRate;
  const eggGroupsText = pokemon.eggGroups
    .map((g) => eggGroupKo[g] || g)
    .join(', ');
  return (
    <Card>
      <CardHeader>
        <CardTitle>소개</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="italic text-center text-lg text-muted-foreground">
          {pokemon.flavorText}
        </p>
        <dl className="space-y-2 text-lg">
          <InfoRow label="키" value={`${pokemon.height} m`} />
          <InfoRow label="몸무게" value={`${pokemon.weight} kg`} />
          <InfoRow label="포획률" value={pokemon.catchRate} />
          <InfoRow label="기본 친밀도" value={pokemon.baseFriendship} />
          <InfoRow label="성장률" value={growthRateText} />
          <InfoRow label="알 그룹" value={eggGroupsText} />
          <InfoRow 
            label="성별" 
            value={<GenderBar male={pokemon.genderRatio.male} female={pokemon.genderRatio.female} />} 
          />
        </dl>
      </CardContent>
    </Card>
  );
}

