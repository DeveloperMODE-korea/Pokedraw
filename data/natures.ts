import type { Nature } from "@/types/pokemon"

export const NATURES: Nature[] = [
  { id: "hardy", nameKo: "노력", nameEn: "Hardy", description: "모든 능력치가 평균적" },
  {
    id: "lonely",
    nameKo: "외로움",
    nameEn: "Lonely",
    up: "atk",
    down: "def",
    description: "공격력이 높지만 방어력이 낮음",
  },
  {
    id: "brave",
    nameKo: "용감",
    nameEn: "Brave",
    up: "atk",
    down: "spe",
    description: "공격력이 높지만 스피드가 낮음",
  },
  {
    id: "adamant",
    nameKo: "고집",
    nameEn: "Adamant",
    up: "atk",
    down: "spa",
    description: "공격력이 높지만 특수공격이 낮음",
  },
  {
    id: "naughty",
    nameKo: "장난꾸러기",
    nameEn: "Naughty",
    up: "atk",
    down: "spd",
    description: "공격력이 높지만 특수방어가 낮음",
  },

  { id: "bold", nameKo: "대담", nameEn: "Bold", up: "def", down: "atk", description: "방어력이 높지만 공격력이 낮음" },
  { id: "docile", nameKo: "온순", nameEn: "Docile", description: "모든 능력치가 평균적" },
  {
    id: "relaxed",
    nameKo: "무사태평",
    nameEn: "Relaxed",
    up: "def",
    down: "spe",
    description: "방어력이 높지만 스피드가 낮음",
  },
  {
    id: "impish",
    nameKo: "장난꾸러기",
    nameEn: "Impish",
    up: "def",
    down: "spa",
    description: "방어력이 높지만 특수공격이 낮음",
  },
  { id: "lax", nameKo: "촐랑", nameEn: "Lax", up: "def", down: "spd", description: "방어력이 높지만 특수방어가 낮음" },

  {
    id: "timid",
    nameKo: "겁쟁이",
    nameEn: "Timid",
    up: "spe",
    down: "atk",
    description: "스피드가 높지만 공격력이 낮음",
  },
  {
    id: "hasty",
    nameKo: "성급",
    nameEn: "Hasty",
    up: "spe",
    down: "def",
    description: "스피드가 높지만 방어력이 낮음",
  },
  { id: "serious", nameKo: "성실", nameEn: "Serious", description: "모든 능력치가 평균적" },
  {
    id: "jolly",
    nameKo: "명랑",
    nameEn: "Jolly",
    up: "spe",
    down: "spa",
    description: "스피드가 높지만 특수공격이 낮음",
  },
  {
    id: "naive",
    nameKo: "천진난만",
    nameEn: "Naive",
    up: "spe",
    down: "spd",
    description: "스피드가 높지만 특수방어가 낮음",
  },

  {
    id: "modest",
    nameKo: "조심",
    nameEn: "Modest",
    up: "spa",
    down: "atk",
    description: "특수공격이 높지만 공격력이 낮음",
  },
  {
    id: "mild",
    nameKo: "온화",
    nameEn: "Mild",
    up: "spa",
    down: "def",
    description: "특수공격이 높지만 방어력이 낮음",
  },
  {
    id: "quiet",
    nameKo: "냉정",
    nameEn: "Quiet",
    up: "spa",
    down: "spe",
    description: "특수공격이 높지만 스피드가 낮음",
  },
  { id: "bashful", nameKo: "수줍음", nameEn: "Bashful", description: "모든 능력치가 평균적" },
  {
    id: "rash",
    nameKo: "덜렁",
    nameEn: "Rash",
    up: "spa",
    down: "spd",
    description: "특수공격이 높지만 특수방어가 낮음",
  },

  {
    id: "calm",
    nameKo: "차분",
    nameEn: "Calm",
    up: "spd",
    down: "atk",
    description: "특수방어가 높지만 공격력이 낮음",
  },
  {
    id: "gentle",
    nameKo: "얌전",
    nameEn: "Gentle",
    up: "spd",
    down: "def",
    description: "특수방어가 높지만 방어력이 낮음",
  },
  {
    id: "sassy",
    nameKo: "건방",
    nameEn: "Sassy",
    up: "spd",
    down: "spe",
    description: "특수방어가 높지만 스피드가 낮음",
  },
  {
    id: "careful",
    nameKo: "신중",
    nameEn: "Careful",
    up: "spd",
    down: "spa",
    description: "특수방어가 높지만 특수공격이 낮음",
  },
  { id: "quirky", nameKo: "변덕", nameEn: "Quirky", description: "모든 능력치가 평균적" },
]

export const getRandomNature = (): Nature => {
  return NATURES[Math.floor(Math.random() * NATURES.length)]
}

export const getNatureById = (id: string): Nature | undefined => {
  return NATURES.find((nature) => nature.id === id)
}
