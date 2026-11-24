import cover from '../assets/guide-cover.jpg'

/** Обложка гайда — первая страница PDF (src/assets/guide-cover.jpg) */
export function GuideCover() {
  return (
    <div className="relative mx-auto w-[min(66vw,280px)]">
      {/* «страницы» под обложкой */}
      <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-2 rotate-[4deg] rounded-[4px] bg-[#FCF8F2] shadow-[0_18px_40px_-22px_rgb(59_41_38/0.45)]" />
      <div aria-hidden="true" className="absolute inset-0 translate-x-1.5 translate-y-1 rotate-[2deg] rounded-[4px] bg-ivory-deep" />

      <img
        src={cover}
        width={509}
        height={720}
        loading="lazy"
        decoding="async"
        alt="обложка гайда «Christmas mood — гайд декабря»"
        className="relative block h-auto w-full -rotate-[2deg] rounded-[4px] shadow-[0_26px_50px_-24px_rgb(59_41_38/0.7)] ring-1 ring-gold/40 transition-transform duration-700 [@media(hover:hover)]:hover:rotate-0"
      />
    </div>
  )
}
