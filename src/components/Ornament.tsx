import { Sparkle } from './Sparkle'

/** Тонкая золотая линия со звездой по центру */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden="true">
      <span className="gold-rule w-14 sm:w-20" />
      <Sparkle size={11} />
      <span className="gold-rule w-14 sm:w-20" />
    </div>
  )
}
