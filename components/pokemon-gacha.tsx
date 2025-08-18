"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, Settings, RotateCcw, Info, Sparkles, AlertCircle, RefreshCw } from "lucide-react"
import { TYPE_COLORS } from "@/data/mock-pokemon"
import { usePokemonData } from "@/hooks/use-pokemon-data"
import type { PokemonLite, GachaFilter } from "@/types/pokemon"
import {
  getRandomAbilityForPokemon,
  getRandomMovesForPokemon,
  getAbilityNameKo,
  getMoveNameKo,
  getEncounterAreasKo,
  getEvolutionChainKoByPokemon,
  getEvolutionChainIdsByPokemon,
  getEvolutionStageInfoByPokemon,
} from "@/services/pokeapi"

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]

const TYPE_TRANSLATIONS: { [key: string]: string } = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  electric: "전기",
  grass: "풀",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
}

interface PokemonCardProps {
  pokemon: PokemonLite
  onClick: () => void
  delay: number
}

function PokemonCard({ pokemon, onClick, delay }: PokemonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="pixel-box hover:shadow-[3px_3px_0px_0px_theme(colors.foreground)] transition-all duration-200">
        <CardContent className="p-4 space-y-3">
          {/* Pokemon Image */}
          <div className="flex justify-center">
            <div className="w-24 h-24 pixel-border bg-muted rounded-md flex items-center justify-center">
              <img
                src={pokemon.spriteUrl || "/placeholder.svg?height=96&width=96&query=pokemon"}
                alt={pokemon.name}
                className="w-20 h-20 pixelated"
                style={{ imageRendering: "pixelated" }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Pokemon Name */}
          <div className="text-center">
            <h3 className="pixel-title text-lg text-foreground">{pokemon.name}</h3>
            <p className="text-xs text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</p>
          </div>

          {/* Types */}
          <div className="flex justify-center gap-1 flex-wrap">
            {pokemon.types.map((type) => (
              <Badge key={type} className={`${TYPE_COLORS[type]} text-white text-xs px-2 py-1`}>
                {TYPE_TRANSLATIONS[type] || type.toUpperCase()}
              </Badge>
            ))}
          </div>

          {/* 종족값 */}
          <div className="text-center">
            <div className="pixel-box p-2 bg-muted">
              <div className="text-sm font-bold text-foreground">종족값: {pokemon.bst}</div>
              <div className="w-full bg-background rounded-full h-2 mt-1">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((pokemon.bst / 720) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Generation */}
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              {pokemon.generation}세대
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface PokemonModalProps {
  pokemon: PokemonLite | null
  isOpen: boolean
  onClose: () => void
}

function PokemonModal({ pokemon, isOpen, onClose }: PokemonModalProps) {
  if (!pokemon) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="pixel-box max-w-md">
        <DialogHeader>
          <DialogTitle className="pixel-title text-xl text-primary text-center">{pokemon.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Large Image */}
          <div className="flex justify-center">
            <div className="w-32 h-32 pixel-border bg-muted rounded-md flex items-center justify-center">
              <img
                src={pokemon.spriteUrl || "/placeholder.svg?height=128&width=128&query=pokemon"}
                alt={pokemon.name}
                className="w-28 h-28 pixelated"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</p>
            </div>

            <div className="flex justify-center gap-2">
              {pokemon.types.map((type) => (
                <Badge key={type} className={`${TYPE_COLORS[type]} text-white px-3 py-1`}>
                  {TYPE_TRANSLATIONS[type] || type.toUpperCase()}
                </Badge>
              ))}
            </div>

            <div className="pixel-box p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">종족값 총합:</span>
                <span className="font-bold">{pokemon.bst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">세대:</span>
                <span className="font-bold">{pokemon.generation}세대</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">등급:</span>
                <span className="font-bold">
                  {pokemon.bst >= 600 ? "전설급" : pokemon.bst >= 500 ? "레어" : "일반"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PokemonGacha() {
  const [results, setResults] = useState<PokemonLite[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonLite | null>(null)
  const [savedTeam, setSavedTeam] = useState<PokemonLite[] | null>(null)
  const [abilityMap, setAbilityMap] = useState<Record<number, string | null>>({})
  const [movesMap, setMovesMap] = useState<Record<number, string[]>>({})
  const [rollingAllAbilities, setRollingAllAbilities] = useState(false)
  const [rollingAllMoves, setRollingAllMoves] = useState(false)
  const [includeHiddenAbility, setIncludeHiddenAbility] = useState(false)
  const [detailExtras, setDetailExtras] = useState<Record<number, { encounters: string[]; evo: string[] }>>({})
  const [filters, setFilters] = useState<GachaFilter>({
    gens: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    types: [],
    generationTypeFilters: [],
    bst: [200, 720],
    count: 6,
    allowDup: false,
    allowEvolutionDup: false,
    evolutionMode: "any",
  })

  const { pokemon: availablePokemon, loading: dataLoading, error: dataError, refetch } = usePokemonData(filters)

  const drawPokemon = async () => {
    if (isDrawing || dataLoading || availablePokemon.length === 0) return

    setIsDrawing(true)
    setResults([])

    // Draw Pokemon from available data
    const drawn: PokemonLite[] = []
    const usedIds = new Set<number>()
    const usedEvolutionIds = new Set<number>()

    let i = 0
    const MAX_ATTEMPTS_PER_SLOT = 300
    while (i < filters.count) {
      let attempts = 0
      let added = false
      while (attempts < MAX_ATTEMPTS_PER_SLOT) {
        attempts++
        const pokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)]

        if (
          !filters.allowDup &&
          (usedIds.has(pokemon.id) || (!filters.allowEvolutionDup && usedEvolutionIds.has(pokemon.id)))
        ) {
          continue
        }

        // evolution stage mode check
        let stageOk = true
        if (filters.evolutionMode !== "any") {
          try {
            const info = await getEvolutionStageInfoByPokemon(pokemon.id)
            if (filters.evolutionMode === "base") stageOk = info.baseId === pokemon.id
            if (filters.evolutionMode === "final") stageOk = info.finalIds.includes(pokemon.id)
            // also cache chain ids for dedupe
            if (!filters.allowDup && !filters.allowEvolutionDup) {
              info.chainIds.forEach((id) => usedEvolutionIds.add(id))
            }
          } catch {
            stageOk = true
          }
        }
        if (!stageOk) continue

        drawn.push(pokemon)
        usedIds.add(pokemon.id)
        if (!filters.allowDup && !filters.allowEvolutionDup && filters.evolutionMode === "any") {
          try {
            const info = await getEvolutionStageInfoByPokemon(pokemon.id)
            info.chainIds.forEach((id) => usedEvolutionIds.add(id))
          } catch {}
        }
        added = true
        break
      }
      if (!added) break
      i++
    }

    // Simulate drawing animation delay
    setTimeout(() => {
      setResults(drawn)
      setIsDrawing(false)
    }, 1000)
  }

  const toggleGeneration = (gen: number) => {
    setFilters((prev) => {
      const newGens = prev.gens.includes(gen) ? prev.gens.filter((g) => g !== gen) : [...prev.gens, gen]
      console.log(`세대 필터 변경: ${newGens.join(', ')}`)
      return {
        ...prev,
        gens: newGens,
      }
    })
  }

  const toggleType = (type: string) => {
    setFilters((prev) => {
      const newTypes = prev.types.includes(type) ? prev.types.filter((t) => t !== type) : [...prev.types, type]
      console.log(`타입 필터 변경: ${newTypes.join(', ')}`)
      return {
        ...prev,
        types: newTypes,
      }
    })
  }

  const saveTeam = () => {
    if (results.length === 0) return
    setSavedTeam(results)
    setAbilityMap({})
    setMovesMap({})
  }

  const rollAbility = async (pokemon: PokemonLite, includeHidden = false) => {
    const abilitySlug = await getRandomAbilityForPokemon(pokemon.id, { includeHidden })
    const ko = abilitySlug ? await getAbilityNameKo(abilitySlug) : null
    setAbilityMap((prev) => ({ ...prev, [pokemon.id]: ko }))
  }

  const rollMoves = async (pokemon: PokemonLite, count = 4) => {
    const moveSlugs = await getRandomMovesForPokemon(pokemon.id, count)
    const koMoves = await Promise.all(moveSlugs.map((m) => getMoveNameKo(m)))
    setMovesMap((prev) => ({ ...prev, [pokemon.id]: koMoves }))
  }

  const loadExtras = async (pokemon: PokemonLite) => {
    const [encounters, evo] = await Promise.all([
      getEncounterAreasKo(pokemon.id, 5),
      getEvolutionChainKoByPokemon(pokemon.id),
    ])
    setDetailExtras((prev) => ({ ...prev, [pokemon.id]: { encounters, evo } }))
  }

  const rollAllTeamAbilities = async () => {
    if (!savedTeam) return
    setRollingAllAbilities(true)
    try {
      const entries = await Promise.all(
        savedTeam.map(async (p) => {
          const slug = await getRandomAbilityForPokemon(p.id, { includeHidden: includeHiddenAbility })
          const ko = slug ? await getAbilityNameKo(slug) : null
          return [p.id, ko] as const
        }),
      )
      const next: Record<number, string | null> = {}
      for (const [id, ability] of entries) next[id] = ability ?? null
      setAbilityMap(next)
    } finally {
      setRollingAllAbilities(false)
    }
  }

  const rollAllTeamMoves = async () => {
    if (!savedTeam) return
    setRollingAllMoves(true)
    try {
      const entries = await Promise.all(
        savedTeam.map(async (p) => {
          const slugs = await getRandomMovesForPokemon(p.id, 4)
          const kos = await Promise.all(slugs.map((m) => getMoveNameKo(m)))
          return [p.id, kos] as const
        }),
      )
      const next: Record<number, string[]> = {}
      for (const [id, moves] of entries) next[id] = moves
      setMovesMap(next)
    } finally {
      setRollingAllMoves(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="pixel-box p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pixel-title text-2xl text-primary">포켓몬 가챠</h2>
          <Button
            variant="outline"
            className="pixel-button bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Settings className="w-4 h-4 mr-2" />
            필터
          </Button>
        </div>

        {dataError && (
          <div className="pixel-box p-4 mb-6 bg-destructive/10 border-destructive">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{dataError}</span>
              <Button variant="outline" size="sm" className="ml-auto pixel-button bg-transparent" onClick={refetch}>
                <RefreshCw className="w-3 h-3 mr-1" />
                다시 시도
              </Button>
            </div>
          </div>
        )}

        {dataLoading && (
          <div className="pixel-box p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>포켓몬 데이터 로딩 중...</span>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pixel-box p-4 mb-6 space-y-6"
            >
              {/* Generation Filter */}
              <div className="space-y-2">
                <Label className="pixel-title text-sm">세대</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
                    <Button
                      key={gen}
                      variant="outline"
                      size="sm"
                      className={`pixel-button transition-opacity ${
                        filters.gens.includes(gen)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent border-muted-foreground opacity-50 hover:opacity-100"
                      }`}
                      onClick={() => toggleGeneration(gen)}
                    >
                      {gen}세대
                    </Button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label className="pixel-title text-sm">타입 (AND)</Label>
                <div className="flex flex-wrap gap-2">
                  {POKEMON_TYPES.map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      className={`pixel-button text-xs transition-opacity ${
                        filters.types.includes(type)
                          ? `${TYPE_COLORS[type]} text-white`
                          : "bg-transparent border-muted-foreground opacity-50 hover:opacity-100"
                      }`}
                      onClick={() => toggleType(type)}
                    >
                      {TYPE_TRANSLATIONS[type] || type.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* BST Range */}
              <div className="space-y-2">
                <Label className="pixel-title text-sm">
                  종족값 범위: {filters.bst[0]} - {filters.bst[1]}
                </Label>
                <Slider
                  value={filters.bst}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, bst: value as [number, number] }))}
                  max={720}
                  min={200}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Draw Count and Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="pixel-title text-sm">뽑기 개수: {filters.count}</Label>
                  <Slider
                    value={[filters.count]}
                    onValueChange={([value]) => setFilters((prev) => ({ ...prev, count: value }))}
                    max={12}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowDup"
                    checked={filters.allowDup}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, allowDup: checked as boolean }))}
                  />
                  <Label htmlFor="allowDup" className="text-sm">
                    중복 허용
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowEvolutionDup"
                    checked={!!filters.allowEvolutionDup}
                    disabled={filters.evolutionMode !== "any"}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, allowEvolutionDup: !!checked }))}
                  />
                  <Label
                    htmlFor="allowEvolutionDup"
                    className={`text-sm ${filters.evolutionMode !== "any" ? "text-muted-foreground" : ""}`}
                    title={filters.evolutionMode !== "any" ? "기본형/최종진화 모드에서는 의미가 없어 비활성화됩니다" : undefined}
                  >
                    진화 라인 중복 허용
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label className="pixel-title text-sm">진화 단계 모드</Label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { k: "any" as const, l: "전체" },
                        { k: "base" as const, l: "기본형만" },
                        { k: "final" as const, l: "최종진화만" },
                      ]
                    ).map((opt) => (
                      <Button
                        key={opt.k}
                        variant="outline"
                        size="sm"
                        className={`pixel-button transition-opacity ${
                          filters.evolutionMode === opt.k
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-transparent border-muted-foreground opacity-50 hover:opacity-100"
                        }`}
                        onClick={() => setFilters((prev) => ({ ...prev, evolutionMode: opt.k }))}
                      >
                        {opt.l}
                      </Button>
                    ))}
                  </div>
                  {filters.evolutionMode !== "any" && (
                    <div className="text-xs text-muted-foreground mt-1">현재 모드에서는 진화 라인 중복 옵션이 비활성화됩니다.</div>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {availablePokemon.length > 0 ? (
                  <span>현재 필터로 {availablePokemon.length}마리의 포켓몬을 뽑을 수 있습니다</span>
                ) : (
                  <span className="text-destructive">현재 필터 조건에 맞는 포켓몬이 없습니다</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draw Button */}
        <div className="text-center">
          <Button
            onClick={drawPokemon}
            disabled={isDrawing || dataLoading || availablePokemon.length === 0}
            className="pixel-button text-lg px-8 py-3"
            size="lg"
          >
            {isDrawing ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                뽑는 중...
              </>
            ) : dataLoading ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                로딩 중...
              </>
            ) : (
              <>
                <Gift className="w-5 h-5 mr-2" />
                포켓몬 {filters.count}마리 뽑기!
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="pixel-box">
              <CardHeader className="text-center">
                <CardTitle className="pixel-title text-xl text-primary">뽑기 결과 ({results.length}마리)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.map((pokemon, index) => (
                    <PokemonCard
                      key={`${pokemon.id}-${index}`}
                      pokemon={pokemon}
                      onClick={() => setSelectedPokemon(pokemon)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    className="pixel-button bg-transparent"
                    disabled={results.length === 0}
                    onClick={saveTeam}
                    title={results.length === 0 ? "뽑기 결과가 있을 때 저장할 수 있습니다" : "팀 저장"}
                  >
                    <Info className="w-4 h-4 mr-2" />팀 저장
                  </Button>
                  <Button variant="outline" className="pixel-button bg-transparent" onClick={drawPokemon}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    다시 뽑기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Team Ability/Moves Gacha */}
      {savedTeam && (
        <Card className="pixel-box">
          <CardHeader className="text-center">
            <CardTitle className="pixel-title text-xl text-primary">팀 특성/기술 가챠</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Checkbox
                id="includeHiddenAbility"
                checked={includeHiddenAbility}
                onCheckedChange={(checked) => setIncludeHiddenAbility(!!checked)}
              />
              <Label htmlFor="includeHiddenAbility" className="text-sm">
                숨겨진 특성 포함
              </Label>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className="pixel-button bg-transparent"
                onClick={rollAllTeamAbilities}
                disabled={rollingAllAbilities}
              >
                <Sparkles className="w-4 h-4 mr-2" />전체 특성 가챠
              </Button>
              <Button
                variant="outline"
                className="pixel-button bg-transparent"
                onClick={rollAllTeamMoves}
                disabled={rollingAllMoves}
              >
                <Sparkles className="w-4 h-4 mr-2" />전체 기술 가챠
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTeam.map((p) => (
                <div key={p.id} className="pixel-box p-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={p.spriteUrl} alt={p.name} className="w-10 h-10 pixelated" />
                    <div>
                      <div className="font-bold text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">#{p.id.toString().padStart(3, "0")}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">특성</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="pixel-button bg-transparent"
                        onClick={() => rollAbility(p, includeHiddenAbility)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />가챠
                      </Button>
                    </div>
                    <div className="text-sm font-medium">
                      {abilityMap[p.id] ?? <span className="text-muted-foreground">아직 없음</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">기술 (4)</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="pixel-button bg-transparent"
                        onClick={() => rollMoves(p)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />가챠
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(movesMap[p.id] ?? []).map((m) => (
                        <Badge key={m} variant="outline" className="text-xs">
                          {m}
                        </Badge>
                      ))}
                      {(movesMap[p.id] ?? []).length === 0 && (
                        <span className="text-sm text-muted-foreground">아직 없음</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">출현 지역</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="pixel-button bg-transparent"
                        onClick={() => loadExtras(p)}
                      >
                        불러오기
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(detailExtras[p.id]?.encounters ?? []).map((n) => (
                        <Badge key={n} variant="secondary" className="text-xs">
                          {n}
                        </Badge>
                      ))}
                      {!(detailExtras[p.id]?.encounters?.length) && (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">진화 체인</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(detailExtras[p.id]?.evo ?? []).map((n) => (
                        <Badge key={n} variant="outline" className="text-xs">
                          {n}
                        </Badge>
                      ))}
                      {!(detailExtras[p.id]?.evo?.length) && (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pokemon Detail Modal */}
      <PokemonModal pokemon={selectedPokemon} isOpen={!!selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}
