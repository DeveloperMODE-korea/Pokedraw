"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Heart, RotateCcw } from "lucide-react"
import { NATURES, getRandomNature } from "@/data/natures"
import type { Nature, StatKey } from "@/types/pokemon"

const STAT_NAMES: Record<StatKey, string> = {
  hp: "HP",
  atk: "Attack",
  def: "Defense",
  spa: "Sp. Atk",
  spd: "Sp. Def",
  spe: "Speed",
}

const STAT_COLORS: Record<StatKey, string> = {
  hp: "bg-red-500",
  atk: "bg-orange-500",
  def: "bg-yellow-500",
  spa: "bg-blue-500",
  spd: "bg-green-500",
  spe: "bg-pink-500",
}

export function NatureRoulette() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<Nature | null>(null)
  const [rotation, setRotation] = useState(0)
  const [showPointer, setShowPointer] = useState(true)

  const spinRoulette = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult(null)
    setShowPointer(true)

    // Calculate random rotation (multiple full spins + random position)
    const selectedNature = getRandomNature()
    const selectedIndex = NATURES.findIndex((n) => n.id === selectedNature.id)
    const anglePerSlice = 360 / NATURES.length
    const targetAngle = selectedIndex * anglePerSlice
    const fullSpins = 5 + Math.random() * 3 // 5-8 full rotations
    const finalRotation = rotation + fullSpins * 360 + (360 - targetAngle)

    setRotation(finalRotation)

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false)
      setResult(selectedNature)

      // Blink pointer 3 times
      let blinkCount = 0
      const blinkInterval = setInterval(() => {
        setShowPointer((prev) => !prev)
        blinkCount++
        if (blinkCount >= 6) {
          // 3 complete blinks (on/off cycles)
          clearInterval(blinkInterval)
          setShowPointer(true)
        }
      }, 250)
    }, 2200)
  }

  const shareResult = () => {
    if (!result) return
    const text = `I got ${result.nameKo} (${result.nameEn}) nature in Pokedraw! ${result.description}`
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Roulette Wheel */}
      <div className="pixel-box p-8">
        <h2 className="pixel-title text-2xl text-center mb-8 text-primary">Nature Roulette</h2>

        <div className="relative flex justify-center items-center">
          {/* Roulette Wheel */}
          <div className="relative">
            <motion.div
              className="w-80 h-80 rounded-full border-4 border-foreground relative overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{
                duration: isSpinning ? 2.2 : 0,
                ease: isSpinning ? "easeOut" : "linear",
              }}
            >
              {/* Roulette Slices */}
              {NATURES.map((nature, index) => {
                const angle = (360 / NATURES.length) * index
                const nextAngle = (360 / NATURES.length) * (index + 1)
                const midAngle = (angle + nextAngle) / 2

                return (
                  <div
                    key={nature.id}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${
                        50 + 50 * Math.sin((nextAngle * Math.PI) / 180)
                      }%)`,
                    }}
                  >
                    <div
                      className={`w-full h-full flex items-start justify-center pt-4 text-xs font-bold ${
                        index % 2 === 0 ? "bg-accent" : "bg-secondary"
                      } ${index % 2 === 0 ? "text-accent-foreground" : "text-secondary-foreground"}`}
                    >
                      <span
                        className="transform -rotate-90 whitespace-nowrap"
                        style={{ transform: `rotate(${-midAngle}deg)` }}
                      >
                        {nature.nameKo}
                      </span>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* Pointer */}
            <motion.div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 ${
                showPointer ? "opacity-100" : "opacity-0"
              }`}
              transition={{ duration: 0.1 }}
            >
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
            </motion.div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center mt-8">
          <Button onClick={spinRoulette} disabled={isSpinning} className="pixel-button text-lg px-8 py-3" size="lg">
            {isSpinning ? "Spinning..." : "Spin Roulette!"}
          </Button>
        </div>
      </div>

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="pixel-box">
              <CardHeader className="text-center">
                <CardTitle className="pixel-title text-xl text-primary">Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nature Name */}
                <div className="text-center">
                  <h3 className="pixel-title text-2xl text-foreground mb-2">{result.nameKo}</h3>
                  <p className="text-muted-foreground">({result.nameEn})</p>
                </div>

                {/* Stat Modifiers */}
                <div className="flex justify-center gap-4">
                  {result.up && (
                    <Badge className={`${STAT_COLORS[result.up]} text-white px-3 py-1`}>
                      {STAT_NAMES[result.up]} ↑
                    </Badge>
                  )}
                  {result.down && (
                    <Badge variant="outline" className="border-destructive text-destructive px-3 py-1">
                      {STAT_NAMES[result.down]} ↓
                    </Badge>
                  )}
                  {!result.up && !result.down && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Neutral
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div className="text-center">
                  <p className="text-muted-foreground leading-relaxed">{result.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="pixel-button bg-transparent" onClick={shareResult}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="pixel-button bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                  <Button variant="outline" className="pixel-button bg-transparent" onClick={spinRoulette}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Spin Again
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
