import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Press_Start_2P, Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
})

const notoSansKR = Noto_Sans_KR({
  weight: ["700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel-kr",
})

export const metadata: Metadata = {
  title: "Pokedraw - Pokemon Roulette & Gacha",
  description: "Pokemon nature roulette, IV roulette, and gacha with DS-era pixel aesthetics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-pixel: ${pressStart2P.variable};
  --font-pixel-kr: ${notoSansKR.variable};
}
        `}</style>
      </head>
      <body className={`${pressStart2P.variable} ${notoSansKR.variable} antialiased`}>{children}</body>
    </html>
  )
}
