import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
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
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-pixel: ${pressStart2P.variable};
}
        `}</style>
      </head>
      <body className={`${pressStart2P.variable} antialiased`}>{children}</body>
    </html>
  )
}
