# 🎮 Pokedraw

포켓몬 팬들을 위한 랜덤 도구 모음집입니다. 성격 룰렛, 개체값 룰렛, 포켓몬 가챠 기능을 제공합니다.

## ✨ 주요 기능

### 🎲 성격 룰렛
- 포켓몬 성격을 랜덤으로 뽑아보세요
- 스탯 보정 정보와 함께 표시됩니다
- 애니메이션 효과로 재미있는 경험을 제공합니다

### ⚡ 개체값 룰렛
- 슬롯머신 애니메이션으로 개체값을 생성합니다
- HP, 공격, 방어, 특수공격, 특수방어, 속도 스탯을 랜덤 생성
- 평균값과 등급 정보를 함께 확인할 수 있습니다

### 🎁 포켓몬 가챠
- 세대별, 타입별, 스탯별 필터링으로 원하는 포켓몬을 뽑아보세요
- 1~5세대 포켓몬 지원
- 세대별 타입 필터 기능
- 종족값(BST) 범위 설정 가능
- 중복 허용/비허용 옵션

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Animation**: Framer Motion
- **API**: PokéAPI
- **Deployment**: Vercel

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- pnpm (권장) 또는 npm

### 설치
```bash
# 저장소 클론
git clone https://github.com/DeveloperMODE-korea/pokedraw.git
cd pokedraw

# 의존성 설치
pnpm install
# 또는
npm install
```

### 개발 서버 실행
```bash
pnpm dev
# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드
```bash
pnpm build
# 또는
npm run build
```

## 📁 프로젝트 구조

```
pokedraw/
├── app/                    # Next.js App Router
│   ├── gacha/             # 포켓몬 가챠 페이지
│   ├── iv/                # 개체값 룰렛 페이지
│   ├── nature/            # 성격 룰렛 페이지
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # Shadcn/ui 컴포넌트
│   ├── iv-roulette.tsx   # 개체값 룰렛 컴포넌트
│   ├── nature-roulette.tsx # 성격 룰렛 컴포넌트
│   ├── pokemon-gacha.tsx # 포켓몬 가챠 컴포넌트
│   └── theme-provider.tsx # 테마 프로바이더
├── data/                 # 정적 데이터
│   ├── mock-pokemon.ts   # 포켓몬 타입 색상 등
│   └── natures.ts        # 성격 데이터
├── hooks/                # 커스텀 훅
│   └── use-pokemon-data.ts # 포켓몬 데이터 훅
├── services/             # API 서비스
│   └── pokeapi.ts        # PokéAPI 연동
├── types/                # TypeScript 타입 정의
│   └── pokemon.ts        # 포켓몬 관련 타입
└── public/               # 정적 파일
    └── *.png             # 포켓몬 이미지들
```

## 🎨 UI/UX 특징

- **픽셀 아트 스타일**: 레트로 게임 느낌의 픽셀 디자인
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- **부드러운 애니메이션**: Framer Motion을 활용한 자연스러운 전환 효과
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환

## 🔧 주요 기능 상세

### 포켓몬 가챠 필터링
- **세대 필터**: 1~5세대 선택 가능
- **세대별 타입 필터**: 각 세대별로 원하는 타입만 선택
- **전체 타입 필터**: 모든 세대에 적용되는 타입 필터
- **종족값 범위**: 200~720 범위에서 설정 가능
- **뽑기 개수**: 1~12마리까지 설정 가능

### 개체값 룰렛
- **슬롯머신 애니메이션**: 실제 슬롯머신처럼 돌아가는 효과
- **스탯별 색상 구분**: 각 스탯별로 다른 색상으로 표시
- **등급 시스템**: 개체값에 따른 등급 분류
- **평균값 계산**: 전체 스탯의 평균값 표시

### 성격 룰렛
- **25가지 성격**: 모든 포켓몬 성격 지원
- **스탯 보정 표시**: 증가/감소 스탯을 명확히 표시
- **랜덤 애니메이션**: 룰렛 돌리기 효과

## 📱 반응형 지원

- **모바일**: 320px 이상
- **태블릿**: 768px 이상  
- **데스크톱**: 1024px 이상

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## ⚠️ 면책 조항

**Pokedraw**는 비공식 팬메이드 프로젝트입니다. 닌텐도, 크리처스, 게임프리크와는 관련이 없습니다.

포켓몬 데이터는 [PokéAPI](https://pokeapi.co)에서 제공됩니다.

## 👨‍💻 개발자

**DeveloperMODE-korea**

- GitHub: [@DeveloperMODE-korea](https://github.com/DeveloperMODE-korea)

## 🔗 링크

- **라이브 데모**: [Pokedraw](https://pokedraw-kor.vercel.app)
- **PokéAPI**: [https://pokeapi.co](https://pokeapi.co)

---

⭐ 이 프로젝트가 마음에 드시면 스타를 눌러주세요!
