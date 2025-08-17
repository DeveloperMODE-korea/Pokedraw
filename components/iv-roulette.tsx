"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Share2, Settings, RotateCcw, TrendingUp, Dices } from "lucide-react"
import type { IVSet, StatKey } from "@/types/pokemon"

const STAT_NAMES: Record<StatKey, string> = {
  hp: "HP",
  atk: "ATK",
  def: "DEF",
  spa: "SPA",
  spd: "SPD",
  spe: "SPE",
}

const STAT_COLORS: Record<StatKey, string> = {
  hp: "bg-red-500",
  atk: "bg-orange-500",
  def: "bg-yellow-500",
  spa: "bg-blue-500",
  spd: "bg-green-500",
  spe: "bg-pink-500",
}

interface IVOptions {
  minValue: number
  maxValue: number
  seed?: string
}

interface SlotReelProps {
  stat: StatKey
  finalValue: number
  isRolling: boolean
  delay: number
  onComplete: () => void
  onIndividualRoll: (stat: StatKey) => void
  options: IVOptions
}

function SlotReel({ stat, finalValue, isRolling, delay, onComplete, onIndividualRoll, options }: SlotReelProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isIndividualRolling, setIsIndividualRolling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if ((isRolling || isIndividualRolling) && !isAnimating) {
      const startTime = Date.now()
      setIsAnimating(true)

      // Start rolling animation after delay (only for group roll)
      const actualDelay = isIndividualRolling ? 0 : delay
      setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setCurrentValue(Math.floor(Math.random() * 32))
        }, 50)

        // Stop after animation duration
        setTimeout(
          () => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            setCurrentValue(finalValue)
            setIsAnimating(false)
            if (isIndividualRolling) {
              setIsIndividualRolling(false)
            } else {
              onComplete()
            }
          },
          1600 + Math.random() * 400,
        ) // 1.6s - 2.0s
      }, actualDelay)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRolling, isIndividualRolling, finalValue, delay, onComplete, isAnimating])

  const handleIndividualRoll = () => {
    if (isAnimating || isRolling) return
    setIsIndividualRolling(true)
    onIndividualRoll(stat)
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Label className="pixel-title text-sm text-muted-foreground">{STAT_NAMES[stat]}</Label>
      <div className="pixel-box w-20 h-24 flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="text-2xl font-bold text-foreground"
          animate={
            isAnimating
              ? {
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1],
                }
              : {
                  y: 0,
                  scale: 1,
                }
          }
          transition={{
            duration: isAnimating ? 0.1 : 0.3,
            repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          {currentValue}
        </motion.div>
        {/* Perfect IV indicator */}
        {!isAnimating && currentValue === 31 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-accent-foreground font-bold">★</span>
          </motion.div>
        )}
      </div>
      <div className={`w-16 h-2 rounded-full ${STAT_COLORS[stat]} opacity-60`}>
        <div
          className={`h-full rounded-full ${STAT_COLORS[stat]} transition-all duration-300`}
          style={{ width: `${(currentValue / 31) * 100}%` }}
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        className="pixel-button bg-transparent text-xs h-6 px-2"
        onClick={handleIndividualRoll}
        disabled={isAnimating || isRolling}
      >
        <Dices className="w-3 h-3" />
      </Button>
    </div>
  )
}

export function IVRoulette() {
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<IVSet | null>(null)
  const [completedReels, setCompletedReels] = useState(0)
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState<IVOptions>({
    minValue: 0,
    maxValue: 31,
  })

  const generateIVs = (): IVSet => {
    const { minValue, maxValue } = options
    return {
      hp: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
      atk: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
      def: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
      spa: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
      spd: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
      spe: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
    }
  }

  const generateSingleIV = (): number => {
    const { minValue, maxValue } = options
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
  }

  const rollIVs = () => {
    if (isRolling) return

    setIsRolling(true)
    setResult(null)
    setCompletedReels(0)

    const newIVs = generateIVs()
    setResult(newIVs)
  }

  const handleIndividualRoll = (stat: StatKey) => {
    const newValue = generateSingleIV()
    setResult((prev) =>
      prev
        ? { ...prev, [stat]: newValue }
        : {
            hp: stat === "hp" ? newValue : 0,
            atk: stat === "atk" ? newValue : 0,
            def: stat === "def" ? newValue : 0,
            spa: stat === "spa" ? newValue : 0,
            spd: stat === "spd" ? newValue : 0,
            spe: stat === "spe" ? newValue : 0,
          },
    )
  }

  const handleReelComplete = () => {
    setCompletedReels((prev) => {
      const newCount = prev + 1
      if (newCount === 6) {
        setIsRolling(false)
      }
      return newCount
    })
  }

  const calculateStats = (ivs: IVSet) => {
    const total = Object.values(ivs).reduce((sum, iv) => sum + iv, 0)
    const perfectCount = Object.values(ivs).filter((iv) => iv === 31).length
    const averagePercent = Math.round((total / (31 * 6)) * 100)

    let grade = "F"
    if (averagePercent >= 95) grade = "S+"
    else if (averagePercent >= 90) grade = "S"
    else if (averagePercent >= 80) grade = "A"
    else if (averagePercent >= 70) grade = "B"
    else if (averagePercent >= 60) grade = "C"
    else if (averagePercent >= 50) grade = "D"

    return { total, perfectCount, averagePercent, grade }
  }

  const shareResult = () => {
    if (!result) return
    const stats = calculateStats(result)
    const text = `My IV Roll: ${stats.total}/186 (${stats.perfectCount} perfect IVs, Grade: ${stats.grade}) - Pokedraw`
    navigator.clipboard.writeText(text)
  }

  const statKeys: StatKey[] = ["hp", "atk", "def", "spa", "spd", "spe"]

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="pixel-box p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pixel-title text-2xl text-primary">개체값 룰렛</h2>
          <Button
            variant="outline"
            className="pixel-button bg-transparent"
            onClick={() => setShowOptions(!showOptions)}
          >
            <Settings className="w-4 h-4 mr-2" />
            옵션
          </Button>
        </div>

        {/* Options Panel */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pixel-box p-4 mb-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>최소값: {options.minValue}</Label>
                  <Slider
                    value={[options.minValue]}
                    onValueChange={([value]) => setOptions((prev) => ({ ...prev, minValue: value }))}
                    max={31}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>최대값: {options.maxValue}</Label>
                  <Slider
                    value={[options.maxValue]}
                    onValueChange={([value]) => setOptions((prev) => ({ ...prev, maxValue: value }))}
                    max={31}
                    min={options.minValue}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slot Reels */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {statKeys.map((stat, index) => (
            <SlotReel
              key={stat}
              stat={stat}
              finalValue={result?.[stat] || 0}
              isRolling={isRolling}
              delay={index * 200} // Stagger the start times
              onComplete={handleReelComplete}
              onIndividualRoll={handleIndividualRoll}
              options={options}
            />
          ))}
        </div>

        {/* Roll Button */}
        <div className="text-center">
          <Button onClick={rollIVs} disabled={isRolling} className="pixel-button text-lg px-8 py-3" size="lg">
            {isRolling ? `돌리는 중... (${completedReels}/6)` : "전체 돌리기!"}
          </Button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && !isRolling && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="pixel-box">
              <CardHeader className="text-center">
                <CardTitle className="pixel-title text-xl text-primary">개체값 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Summary */}
                {(() => {
                  const stats = calculateStats(result)
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="pixel-box p-3">
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <div className="text-xs text-muted-foreground">총합</div>
                      </div>
                      <div className="pixel-box p-3">
                        <div className="text-2xl font-bold text-accent-foreground">{stats.perfectCount}</div>
                        <div className="text-xs text-muted-foreground">완벽한 개체값</div>
                      </div>
                      <div className="pixel-box p-3">
                        <div className="text-2xl font-bold text-secondary">{stats.averagePercent}%</div>
                        <div className="text-xs text-foreground">평균</div>
                      </div>
                      <div className="pixel-box p-3">
                        <div className="text-2xl font-bold text-foreground">{stats.grade}</div>
                        <div className="text-xs text-muted-foreground">등급</div>
                      </div>
                    </div>
                  )
                })()}

                {/* Individual IVs */}
                <div className="space-y-2">
                  <h4 className="pixel-title text-sm text-center text-muted-foreground">개별 개체값</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    {statKeys.map((stat) => (
                      <div key={stat} className="text-center">
                        <Badge
                          className={`${STAT_COLORS[stat]} text-white w-full justify-center ${
                            result[stat] === 31 ? "ring-2 ring-accent" : ""
                          }`}
                        >
                          {STAT_NAMES[stat]}: {result[stat]}
                          {result[stat] === 31 && " ★"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="pixel-button bg-transparent" onClick={shareResult}>
                    <Share2 className="w-4 h-4 mr-2" />
                    공유
                  </Button>
                  <Button variant="outline" className="pixel-button bg-transparent">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    분석
                  </Button>
                  <Button variant="outline" className="pixel-button bg-transparent" onClick={rollIVs}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    다시 돌리기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
