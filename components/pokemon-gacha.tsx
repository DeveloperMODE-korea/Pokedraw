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

          {/* BST */}
          <div className="text-center">
            <div className="pixel-box p-2 bg-muted">
              <div className="text-sm font-bold text-foreground">BST: {pokemon.bst}</div>
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
  const [filters, setFilters] = useState<GachaFilter>({
    gens: [1, 2, 3, 4, 5],
    types: [],
    generationTypeFilters: [],
    bst: [200, 720],
    count: 6,
    allowDup: false,
  })

  const { pokemon: availablePokemon, loading: dataLoading, error: dataError, refetch } = usePokemonData(filters)

  const drawPokemon = () => {
    if (isDrawing || dataLoading || availablePokemon.length === 0) return

    setIsDrawing(true)
    setResults([])

    // Draw Pokemon from available data
    const drawn: PokemonLite[] = []
    const usedIds = new Set<number>()

    for (let i = 0; i < filters.count; i++) {
      let attempts = 0
      let pokemon: PokemonLite

      do {
        pokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)]
        attempts++
      } while (!filters.allowDup && usedIds.has(pokemon.id) && attempts < 50)

      if (filters.allowDup || !usedIds.has(pokemon.id)) {
        drawn.push(pokemon)
        usedIds.add(pokemon.id)
      }
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
                  {[1, 2, 3, 4, 5].map((gen) => (
                    <Button
                      key={gen}
                      variant="outline"
                      size="sm"
                      className={`pixel-button ${
                        filters.gens.includes(gen) 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-transparent border-muted-foreground hover:bg-muted"
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
                      className={`pixel-button text-xs ${
                        filters.types.includes(type)
                          ? `${TYPE_COLORS[type]} text-white`
                          : "bg-transparent border-muted-foreground"
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
                  <Button variant="outline" className="pixel-button bg-transparent">
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

      {/* Pokemon Detail Modal */}
      <PokemonModal pokemon={selectedPokemon} isOpen={!!selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}
