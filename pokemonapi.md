포켓몬 개체 /pokemon/{id|name}: 이름/ID, 기본경험치, 키·몸무게, 타입/특성/기술, 스탯, 보유 아이템, 출현 위치 링크(…/encounters), 스프라이트(공식 아트 포함) 등 상세 필드. 
pokeapi.co

포켓몬 종 /pokemon-species/{id|name}: 진화체인 URL, 성비·포획률·친밀도, 성장률, 알그룹, 색/형태, 세대, 플레이버 텍스트(다국어), 버라이어티(폼). 
pokeapi.co

진화 체인 /evolution-chain/{id} + 진화 트리거 /evolution-trigger/{id|name}: evolves_to 트리 구조와 아이템/레벨/시간대/친밀도/우천 등 조건을 구조화해 제공. 
pokeapi.co
+1

기술 /move/{id|name}: 위력/정확도/PP, 데미지 클래스, 타깃, 부가효과 텍스트, 머신(TM/HM) 연계 등. 
pokeapi.co

특성 /ability/{id|name}: 배틀/오버월드 효과(장문/요약 텍스트), 등장 세대, 보유 포켓몬 목록. 
pokeapi.co

타입 /type/{id|name}: 상성(받는/주는 데미지 관계)과 과거 세대 상성 변화. 
pokeapi.co

아이템 계열: /item, /item-attribute, /item-category, /item-fling-effect, /item-pocket—아이템 메타/분류/스프라이트/보유 포켓몬 등. 
pokeapi.co
+1

머신 /machine/{id}: 특정 TM/HM ↔ 기술 ↔ 버전그룹 매핑. 
pokeapi.co

로케이션/지역/도감/버전: /location, /region, /pokedex, /version(-group)—지역/세대/도감 인덱스 등 게임 메타데이터. 
pokeapi.co
+1

출현 관련(야생 조우): /encounter-method, /encounter-condition, /encounter-condition-value—풀숲/낮밤/스웜 등 조우 방식·조건. 
pokeapi.co

콘테스트: /contest-type, /contest-effect, /super-contest-effect. 
pokeapi.co

베리: /berry, /berry-firmness, /berry-flavor. 
pokeapi.co

유틸리티: /language(다국어 이름·텍스트 매핑). 
pokeapi.co