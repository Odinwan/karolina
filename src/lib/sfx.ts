/**
 * Короткие «физические» звуки: шорох письма, искры салюта, шелест страницы.
 * Файлы лежат в public/sfx (CC0, см. public/sfx/CREDITS.md).
 *
 * Используется Web Audio: после первого касания звук можно проигрывать
 * в любой момент (в том числе с небольшой задержкой после нажатия), и
 * на iPhone он не зависит от HTML-аудио плеера.
 * Кнопка «музыка» выключает и музыку, и эти звуки.
 */

export const SOUND_MUTED_KEY = 'bg-music-muted'

const FILES = {
  paper: 'sfx/paper.mp3', // открытие конверта
  sparkle: 'sfx/sparkle.mp3', // салют
  page: 'sfx/page.mp3', // следующее послание
} as const
export type SfxName = keyof typeof FILES

const VOLUME: Record<SfxName, number> = { paper: 0.9, sparkle: 0.35, page: 0.7 }

let ctx: AudioContext | null = null
const buffers = new Map<SfxName, Promise<AudioBuffer | null>>()

export function isSoundMuted(): boolean {
  try {
    return localStorage.getItem(SOUND_MUTED_KEY) === '1'
  } catch {
    return false
  }
}

function getCtx(): AudioContext | null {
  if (ctx) return ctx
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  // iPhone: чтобы звук играл и при беззвучном режиме, как у видео/музыки
  try {
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession
    if (session) session.type = 'playback'
  } catch {
    /* API нет — ничего страшного */
  }
  return ctx
}

function load(name: SfxName): Promise<AudioBuffer | null> {
  let p = buffers.get(name)
  if (!p) {
    const ac = getCtx()
    p = ac
      ? fetch(FILES[name])
          .then((r) => r.arrayBuffer())
          .then((data) => ac.decodeAudioData(data))
          .catch(() => null)
      : Promise.resolve(null)
    buffers.set(name, p)
  }
  return p
}

/** Разблокировать звук и заранее загрузить файлы — на первом касании */
export function armSfx() {
  const events = ['pointerdown', 'touchend', 'keydown'] as const
  const unlock = () => {
    events.forEach((e) => window.removeEventListener(e, unlock, true))
    const ac = getCtx()
    if (ac && ac.state === 'suspended') ac.resume().catch(() => {})
    ;(Object.keys(FILES) as SfxName[]).forEach((n) => void load(n))
  }
  events.forEach((e) => window.addEventListener(e, unlock, { capture: true, passive: true }))
}

export async function playSfx(name: SfxName, delayMs = 0) {
  if (isSoundMuted()) return
  const ac = getCtx()
  if (!ac) return
  if (ac.state === 'suspended') await ac.resume().catch(() => {})
  const buf = await load(name)
  if (!buf || isSoundMuted()) return
  const src = ac.createBufferSource()
  src.buffer = buf
  const gain = ac.createGain()
  gain.gain.value = VOLUME[name]
  src.connect(gain).connect(ac.destination)
  src.start(ac.currentTime + delayMs / 1000)
}
