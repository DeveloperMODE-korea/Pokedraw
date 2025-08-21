"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw } from "lucide-react"
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

// --- Slot Machine Constants ---
const ITEM_HEIGHT = 64 // h-16
const VISIBLE_ITEMS = 3
const REEL_WINDOW_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS

// Function to create a long, shuffled list for the reel
const createReelItems = () => {
  let items: Nature[] = []
  for (let i = 0; i < 5; i++) {
    // Shuffle NATURES for each segment to make it look more random
    items = [...items, ...[...NATURES].sort(() => Math.random() - 0.5)]
  }
  return items
}

export function NatureRoulette() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<Nature | null>(null)
  const [reelItems, setReelItems] = useState<Nature[]>([])
  const [y, setY] = useState(0)

  useEffect(() => {
    setReelItems(createReelItems())
  }, [])

  const spin = () => {
    if (isSpinning || reelItems.length === 0) return

    setIsSpinning(true)
    setResult(null)

    const targetNature = getRandomNature()

    // Find the index of the target nature in the second to last segment of the reel
    // This ensures a nice long spin effect
    const targetSegmentIndex = reelItems.length - NATURES.length * 2
    const foundIndex = reelItems.findIndex(
      (item, index) => index >= targetSegmentIndex && item.id === targetNature.id
    )

    const finalIndex = foundIndex !== -1 ? foundIndex : reelItems.length - NATURES.length + 5

    // Calculate the final Y position to center the target item in the window
    const finalY = -(finalIndex * ITEM_HEIGHT) + (REEL_WINDOW_HEIGHT - ITEM_HEIGHT) / 2

    setY(finalY)

    setTimeout(() => {
      setIsSpinning(false)
      setResult(targetNature)
    }, 4000) // Corresponds to the animation duration
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <Card className="pixel-box overflow-hidden">
        <CardHeader>
          <CardTitle className="pixel-title text-2xl text-center text-primary">성격 슬롯머신</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {/* Reel Container */}
          <div
            className="relative h-[192px] w-48 border-4 border-foreground bg-background rounded-lg shadow-inner"
            style={{ height: REEL_WINDOW_HEIGHT }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full"
              animate={{ y }}
              transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }} // Custom ease-out
            >
              {reelItems.map((nature, i) => (
                <div
                  key={`${nature.id}-${i}`}
                  className="flex items-center justify-center h-16 text-xl font-bold border-b-2 border-dashed border-foreground/20"
                  style={{ height: ITEM_HEIGHT }}
                >
                  {nature.nameKo}
                </div>
              ))}
            </motion.div>
            {/* Pointer / Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/80 via-transparent to-background/80" />
            <div className="absolute top-1/2 left-0 w-full h-16 -translate-y-1/2 border-y-4 border-primary/70 pointer-events-none rounded-md" />
          </div>

          {/* Spin Button */}
          <Button onClick={spin} disabled={isSpinning} className="pixel-button text-xl px-10 py-4" size="lg">
            {isSpinning ? "돌아가는 중..." : "슬롯 돌리기!"}
          </Button>
        </CardContent>
      </Card>

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
                <CardTitle className="pixel-title text-2xl text-primary">결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <h3 className="pixel-title text-3xl text-foreground">{result.nameKo}</h3>
                <p className="text-muted-foreground text-sm">({result.nameEn})</p>
                <div className="flex justify-center gap-2">
                  {result.up && (
                    <Badge className="text-white px-3 py-1 text-xs" style={{ backgroundColor: '#FF6B6B' }}>
                      {STAT_NAMES[result.up]} ↑
                    </Badge>
                  )}
                  {result.down && (
                    <Badge variant="outline" className="border-blue-500 text-blue-500 px-3 py-1 text-xs">
                      {STAT_NAMES[result.down]} ↓
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-base pt-2">{result.description}</p>
                <Button variant="outline" className="pixel-button bg-transparent text-base mt-4" onClick={spin}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 돌리기
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}