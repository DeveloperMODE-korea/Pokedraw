import * as React from 'react';

export type Generation = 1 | 2 | 3 | 4 | 5;

type ClassNames = {
  base?: string;
  active?: string;
  inactive?: string;
};

export interface GenerationFilterProps {
  selected: Set<Generation> | ReadonlySet<Generation>;
  onToggle: (gen: Generation) => void;
  classNames?: ClassNames;
  label?: string;
}

/**
 * GenerationFilter
 * - 1세대 ~ 5세대 토글을 타입 칩과 동일한 방식으로 표시하기 위한 컴포넌트
 * - classNames에 타입 칩에서 쓰는 클래스(base/active/inactive)를 그대로 전달하세요.
 */
export function GenerationFilter({
  selected,
  onToggle,
  classNames,
  label = '세대',
}: GenerationFilterProps) {
  const gens: Generation[] = [1, 2, 3, 4, 5];
  const base = classNames?.base ?? 'chip';
  const active = classNames?.active ?? 'chip--active';
  const inactive = classNames?.inactive ?? 'chip--inactive';

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm opacity-80">{label}</div>
      <div className="flex flex-wrap gap-2">
        {gens.map((g) => {
          const isOn = selected.has(g);
          return (
            <button
              key={g}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(g)}
              className={`${base} ${isOn ? active : inactive}`}
            >
              {g}세대
            </button>
          );
        })}
      </div>
    </div>
  );
}

