"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Heart, RotateCcw } from "lucide-react"
import { NATURES, getRandomNature } from "@/data/natures"
import type { Nature, StatKey } from "@/types/pokemon"

const STAT_NAMES: Record<StatKey, string> = {
  hp: "HP",
  atk: "공격",
  def: "방어",
  spa: "특공",
  spd: "특방",
  spe: "스피드",
}

const STAT_COLORS: Record<StatKey, string> = {
  hp: "bg-red-500",
  atk: "bg-orange-500",
  def: "bg-yellow-500",
  spa: "bg-blue-500",
  spd: "bg-green-500",
  spe: "bg-pink-500",
}

// Roulette sizing constants for better readability
const WHEEL_SIZE = 420 // px
const WHEEL_CENTER = WHEEL_SIZE / 2
const WHEEL_RADIUS = 195
const TEXT_RADIUS = 135
const SLICE_STROKE_WIDTH = 2

const ROULETTE_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
  "#A9DFBF",
  "#F9E79F",
  "#D5A6BD",
  "#AED6F1",
  "#A3E4D7",
  "#FAD7A0",
  "#D2B4DE",
  "#A9CCE3",
  "#ABEBC6",
  "#F5B7B1",
]

export function NatureRoulette() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<Nature | null>(null)
  const [rotation, setRotation] = useState(0)
  const [showPointer, setShowPointer] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const spinRoulette = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult(null)
    setShowPointer(true)

    const anglePerSlice = 360 / NATURES.length
    
    // 1. Pick a random target index for visual spinning effect
    const targetIndex = Math.floor(Math.random() * NATURES.length)
    const targetAngle = targetIndex * anglePerSlice
    const fullSpins = 5 + Math.random() * 3
    
    // We still use the formula to try and land near the target, but it doesn't need to be perfect.
    const finalRotation = rotation + fullSpins * 360 + (270 - targetAngle - anglePerSlice / 2)

    setRotation(finalRotation)

    // 2. After animation, determine the result from the final rotation
    setTimeout(() => {
      // The pointer is at 270 degrees. Find which angle of the wheel is under it.
      const wheelAngleAtPointer = (360 - (finalRotation % 360) + 270) % 360
      
      // Determine which slice this angle falls into.
      const resultIndex = Math.floor(wheelAngleAtPointer / anglePerSlice)
      const actualResult = NATURES[resultIndex]

      setIsSpinning(false)
      setResult(actualResult) // 3. Set the result to what the user actually sees

      // Blink pointer 3 times
      let blinkCount = 0
      const blinkInterval = setInterval(() => {
        setShowPointer((prev) => !prev)
        blinkCount++
        if (blinkCount >= 6) {
          clearInterval(blinkInterval)
          setShowPointer(true)
        }
      }, 250)
    }, 2200) // This must match the animation duration
  }

  const shareResult = () => {
    if (!result) return
    const text = `포케드로우에서 ${result.nameKo} (${result.nameEn}) 성격을 뽑았어요! ${result.description}`
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Roulette Wheel */}
      <div className="pixel-box p-8">
        <h2 className="pixel-title text-3xl text-center mb-8 text-primary">성격 룰렛</h2>

        <div className="relative flex justify-center items-center">
          <div className="relative">
            <motion.div
              style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
              animate={{ rotate: rotation }}
              transition={{
                duration: isSpinning ? (prefersReducedMotion ? 0.6 : 2.2) : 0,
                ease: isSpinning ? "easeOut" : "linear",
              }}
            >
              <svg
                width={WHEEL_SIZE}
                height={WHEEL_SIZE}
                viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
                className="border-4 border-foreground rounded-full"
              >
                {NATURES.map((nature, index) => {
                  const anglePerSlice = 360 / NATURES.length
                  const startAngle = index * anglePerSlice
                  const endAngle = (index + 1) * anglePerSlice

                  // Convert angles to radians
                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180

                  // Calculate path coordinates
                  const centerX = WHEEL_CENTER
                  const centerY = WHEEL_CENTER
                  const radius = WHEEL_RADIUS

                  const x1 = centerX + radius * Math.cos(startRad)
                  const y1 = centerY + radius * Math.sin(startRad)
                  const x2 = centerX + radius * Math.cos(endRad)
                  const y2 = centerY + radius * Math.sin(endRad)

                  const largeArcFlag = anglePerSlice > 180 ? 1 : 0

                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ")

                  // Text position
                  const textAngle = startAngle + anglePerSlice / 2
                  const textRad = (textAngle * Math.PI) / 180
                  const textRadius = TEXT_RADIUS
                  const textX = centerX + textRadius * Math.cos(textRad)
                  const textY = centerY + textRadius * Math.sin(textRad)

                  return (
                    <g key={nature.id}>
                      <path
                        d={pathData}
                        fill={ROULETTE_COLORS[index % ROULETTE_COLORS.length]}
                        stroke="#000000"
                        strokeWidth={SLICE_STROKE_WIDTH}
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#111111"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        paintOrder="stroke"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      >
                        {nature.nameKo}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </motion.div>

            {/* Pointer (Pokéball) */}
            <motion.div
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 ${
                showPointer ? "opacity-100" : "opacity-0"
              }`}
              animate={isSpinning && !prefersReducedMotion ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, repeat: isSpinning && !prefersReducedMotion ? Infinity : 0 }}
            >
              <div className="pokeball-pointer" />
            </motion.div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center mt-8">
          <Button onClick={spinRoulette} disabled={isSpinning} className="pixel-button text-xl px-10 py-4" size="lg">
            {isSpinning ? "돌리는 중..." : "룰렛 돌리기!"}
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
            <Card className="pixel-box" aria-live="polite">
              <CardHeader className="text-center">
                <CardTitle className="pixel-title text-2xl text-primary">결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nature Name */}
                <div className="text-center">
                  <h3 className="pixel-title text-3xl text-foreground mb-2">{result.nameKo}</h3>
                  <p className="text-muted-foreground text-sm">({result.nameEn})</p>
                </div>

                {/* Stat Modifiers */}
                <div className="flex justify-center gap-4">
                  {result.up && (
                    <Badge className={`${STAT_COLORS[result.up]} text-white px-4 py-2 text-sm`}>
                      {STAT_NAMES[result.up]} ↑
                    </Badge>
                  )}
                  {result.down && (
                    <Badge variant="outline" className="border-destructive text-destructive px-4 py-2 text-sm">
                      {STAT_NAMES[result.down]} ↓
                    </Badge>
                  )}
                  {!result.up && !result.down && (
                    <Badge variant="secondary" className="px-4 py-2 text-sm">
                      중립
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div className="text-center">
                  <p className="text-muted-foreground leading-relaxed text-base">{result.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  
                  
                  <Button variant="outline" className="pixel-button bg-transparent text-base px-6 py-3" onClick={spinRoulette}>
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
