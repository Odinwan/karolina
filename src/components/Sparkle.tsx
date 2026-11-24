type SparkleProps = {
  size?: number
  className?: string
  style?: React.CSSProperties
}

/** Тонкая четырёхлучевая звезда (декоративная) */
export function Sparkle({ size = 14, className = '', style }: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M12 0c.6 6.2 2.2 9.9 12 12-9.8 2.1-11.4 5.8-12 12-.6-6.2-2.2-9.9-12-12C9.8 9.9 11.4 6.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  )
}
