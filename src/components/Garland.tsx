/** Гирлянда тёплых огней по верхнему краю блока (вариант D) */
export function Garland() {
  const bulbs = [
    [60, 22, '#f3d9b4'], [150, 30, '#ffd27a'], [300, 22, '#f3d9b4'], [390, 14, '#ffd27a'],
    [540, 22, '#f3d9b4'], [630, 14, '#ffd27a'], [780, 22, '#f3d9b4'], [880, 14, '#ffd27a'],
  ] as const
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 960 64"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 w-full overflow-visible"
    >
      <path d="M0 6 Q120 46 240 10 T480 10 T720 10 T960 6" fill="none" stroke="rgba(247,239,230,.35)" strokeWidth="1.5" />
      <g>
        {bulbs.map(([cx, cy, fill]) => (
          <circle key={cx} className="bulb" cx={cx} cy={cy} r="5" fill={fill} />
        ))}
      </g>
    </svg>
  )
}
