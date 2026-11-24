import { DEFAULT_THEME, type Message } from '../config/messages'
import { siteConfig } from '../config/site'
import { Ornament } from './Ornament'
import { Sparkle } from './Sparkle'

const CORNERS: React.CSSProperties[] = [
  { left: 12, top: 12, transform: 'translate(-50%,-50%)' },
  { right: 12, top: 12, transform: 'translate(50%,-50%)' },
  { left: 12, bottom: 12, transform: 'translate(-50%,50%)' },
  { right: 12, bottom: 12, transform: 'translate(50%,50%)' },
]

/** Карточка-письмо с посланием */
export function MessageCard({ message, fading }: { message: Message; fading: boolean }) {
  const paragraphs = message.text.split(/\n\s*\n/)
  // короткие фразы показываем крупнее
  const size =
    message.text.length < 70
      ? 'text-[2rem] leading-[1.2] sm:text-[2.6rem]'
      : message.text.length < 160
        ? 'text-[1.6rem] leading-[1.35] sm:text-[2rem]'
        : 'text-[1.32rem] leading-[1.5] sm:text-[1.5rem]'

  return (
    <article
      className="card-in relative mx-auto w-full max-w-xl rounded-[4px] bg-[#FCF8F2] px-6 py-10 shadow-[0_30px_60px_-30px_rgb(59_41_38/0.35)] sm:px-12 sm:py-14"
      aria-live="polite"
    >
      {/* двойная тонкая рамка со звёздами по углам */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[2px] border border-gold/60" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-[18px] rounded-[2px] border border-gold/25" />
      {CORNERS.map((style, i) => (
        <Sparkle key={i} size={12} className="absolute text-gold" style={style} />
      ))}

      <div
        key={message.id}
        className={`relative text-center transition-opacity duration-300 ${fading ? 'opacity-0' : 'text-in opacity-100'}`}
      >
        <p className="eyebrow">{message.theme ?? DEFAULT_THEME}</p>
        <Ornament className="mt-4" />

        <div className={`mt-7 space-y-5 font-serif italic text-cocoa ${size}`}>
          {paragraphs.map((p, i) => (
            <p key={i}>
              {/* слова с дефисом («что-то», «по-разному») не разрываем при переносе */}
              {p.trim().split(/(\S*-\S*)/).map((part, j) =>
                part.includes('-') ? (
                  <span key={j} className="whitespace-nowrap">{part}</span>
                ) : (
                  part
                ),
              )}
            </p>
          ))}
        </div>

        <p className="mt-9 font-hand text-xl text-cocoa-soft">с теплом,</p>
        <p className="-mt-1 font-script text-[2.6rem] leading-tight text-burgundy" lang="en">
          by {siteConfig.brandName}
        </p>
      </div>
    </article>
  )
}
