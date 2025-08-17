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
    const text = `포케드로우에서 ${result.nameKo} (${result.nameEn}) 성격을 뽑았어요! ${result.description}`
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Roulette Wheel */}
      <div className="pixel-box p-8">
        <h2 className="pixel-title text-2xl text-center mb-8 text-primary">성격 룰렛</h2>

        <div className="relative flex justify-center items-center">
          <div className="relative">
            <motion.div
              className="w-80 h-80"
              animate={{ rotate: rotation }}
              transition={{
                duration: isSpinning ? 2.2 : 0,
                ease: isSpinning ? "easeOut" : "linear",
              }}
            >
              <svg width="320" height="320" viewBox="0 0 320 320" className="border-4 border-foreground rounded-full">
                {NATURES.map((nature, index) => {
                  const anglePerSlice = 360 / NATURES.length
                  const startAngle = index * anglePerSlice
                  const endAngle = (index + 1) * anglePerSlice

                  // Convert angles to radians
                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180

                  // Calculate path coordinates
                  const centerX = 160
                  const centerY = 160
                  const radius = 150

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
                  const textRadius = 100
                  const textX = centerX + textRadius * Math.cos(textRad)
                  const textY = centerY + textRadius * Math.sin(textRad)

                  return (
                    <g key={nature.id}>
                      <path
                        d={pathData}
                        fill={ROULETTE_COLORS[index % ROULETTE_COLORS.length]}
                        stroke="#000000"
                        strokeWidth="2"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#000000"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      >
                        {nature.nameKo}
                      </text>
                    </g>
                  )
                })}
              </svg>
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
            <Card className="pixel-box">
              <CardHeader className="text-center">
                <CardTitle className="pixel-title text-xl text-primary">결과</CardTitle>
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
                      중립
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
                    공유
                  </Button>
                  <Button variant="outline" className="pixel-button bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    즐겨찾기
                  </Button>
                  <Button variant="outline" className="pixel-button bg-transparent" onClick={spinRoulette}>
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
