import { Sparkle } from './Sparkle'

type Star = { top: string; left: string; size: number; d: number; delay: number }

// Фиксированные позиции — без «прыжков» при перерисовке и без случайностей при сборке
const STARS: Star[] = [
  { top: '9%', left: '12%', size: 12, d: 4.2, delay: 0 },
  { top: '14%', left: '92%', size: 16, d: 5.1, delay: 1.2 },
  { top: '31%', left: '6%', size: 9, d: 3.6, delay: 2.1 },
  { top: '22%', left: '90%', size: 7, d: 4.8, delay: 0.6 },
  { top: '62%', left: '93%', size: 11, d: 4.4, delay: 1.8 },
  { top: '72%', left: '9%', size: 15, d: 5.6, delay: 0.3 },
  { top: '84%', left: '78%', size: 8, d: 3.9, delay: 2.6 },
  { top: '44%', left: '4%', size: 6, d: 4.1, delay: 3.1 },
  { top: '5%', left: '30%', size: 6, d: 3.4, delay: 1.5 },
  { top: '88%', left: '33%', size: 9, d: 4.9, delay: 0.9 },
]

type Flake = { left: string; size: number; d: number; delay: number; x: number; glyph: string }

const GLYPHS = ['❄', '❅', '✦', '•']
const FLAKES: Flake[] = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37 + 7) % 100}%`,
  size: 8 + ((i * 7) % 10),
  d: 12 + ((i * 5) % 12),
  delay: -((i * 3.3) % 20),
  x: (i % 2 ? 1 : -1) * (6 + ((i * 13) % 30)),
  glyph: GLYPHS[i % GLYPHS.length],
}))

export function StarField({
  snow = false,
  snowClass = 'text-gold/55',
  stars = true,
}: {
  snow?: boolean
  /** цвет снежинок, например 'text-ivory/70' на винном фоне */
  snowClass?: string
  stars?: boolean
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars && STARS.map((s, i) => (
        <span key={i} className="absolute" style={{ top: s.top, left: s.left }}>
          <Sparkle
            size={s.size}
            className="star text-gold"
            style={{ '--d': `${s.d}s`, '--delay': `${s.delay}s` } as React.CSSProperties}
          />
        </span>
      ))}
      {snow &&
        FLAKES.map((f, i) => (
          <span
            key={`f${i}`}
            className={`snowflake absolute -top-3 leading-none ${snowClass}`}
            style={
              {
                left: f.left,
                fontSize: f.size,
                '--d': `${f.d}s`,
                '--delay': `${f.delay}s`,
                '--x': `${f.x}px`,
              } as React.CSSProperties
            }
          >
            {f.glyph}
          </span>
        ))}
    </div>
  )
}
