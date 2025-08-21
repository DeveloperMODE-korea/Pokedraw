import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dice1, Zap, Gift } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pixel-border border-b-2 bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="pixel-title text-2xl md:text-4xl text-center text-primary mb-2">POKEDRAW</h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="pixel-border border-b-2 bg-muted">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 p-4">
            <Button variant="outline" className="pixel-button bg-accent text-accent-foreground">
              홈
            </Button>
            <Link href="/nature">
              <Button variant="outline" className="pixel-button bg-transparent">
                성격
              </Button>
            </Link>
            <Link href="/iv">
              <Button variant="outline" className="pixel-button bg-transparent">
                개체값 룰렛
              </Button>
            </Link>
            <Link href="/gacha">
              <Button variant="outline" className="pixel-button bg-transparent">
                가챠
              </Button>
            </Link>
            <Link href="/pokedex">
              <Button variant="outline" className="pixel-button bg-transparent">
                도감
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="pixel-box p-6 text-center">
          <h2 className="pixel-title text-xl mb-4 text-primary">Pokedraw에 오신 것을 환영합니다!</h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nature Roulette */}
          <Card className="pixel-box">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary rounded-md flex items-center justify-center mb-2">
                <Dice1 className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="pixel-title text-lg text-primary">성격 룰렛</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Link href="/nature">
                <Button className="pixel-button w-full">성격 뽑기</Button>
              </Link>
            </CardContent>
          </Card>

          {/* IV Roulette */}
          <Card className="pixel-box">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="pixel-title text-lg text-secondary">개체값 룰렛</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Link href="/iv">
                <Button className="pixel-button w-full bg-secondary text-secondary-foreground">개체값 뽑기</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pokemon Gacha */}
          <Card className="pixel-box">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-accent rounded-md flex items-center justify-center mb-2">
                <Gift className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="pixel-title text-lg text-accent-foreground">포켓몬 가챠</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Link href="/gacha">
                <Button className="pixel-button w-full bg-accent text-accent-foreground">포켓몬 뽑기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="pixel-border border-t-2 bg-muted mt-12 p-4">
        <div className="max-w-4xl mx-auto text-center text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Pokedraw</strong>는 비공식 팬메이드 프로젝트입니다. 닌텐도, 크리처스, 게임프리크와는 관련이
            없습니다.
          </p>
          <p>
            포켓몬 데이터는{" "}
            <a href="https://pokeapi.co" className="text-primary hover:underline">
              PokéAPI
            </a>
            에서 제공됩니다
          </p>
          <p>
            개발자:{" "}
            <a
              href="https://github.com/DeveloperMODE-korea"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DeveloperMODE-korea
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
