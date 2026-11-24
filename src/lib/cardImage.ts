import { DEFAULT_THEME, type Message } from '../config/messages'
import { siteConfig } from '../config/site'

/**
 * Рисует красивую карточку с посланием на <canvas> без сторонних библиотек.
 * Формат 4:5 (1080×1350) — удобно для галереи телефона и соцсетей.
 */

const W = 1080
const H = 1350

const C = {
  ivory: '#F7EFE6',
  ivoryDeep: '#EFE5D6',
  burgundy: '#7A2E3A',
  rose: '#D8BFC1',
  gold: '#C9A46A',
  cocoa: '#4A3B38',
  berry: '#8E1A1E',
}

const SERIF = '"Cormorant Garamond Variable", "Cormorant Garamond", Georgia, serif'
const SANS = '"Manrope Variable", Manrope, system-ui, sans-serif'
const HAND = '"Marck Script", cursive'
const SCRIPT = '"Mrs Saint Delafield", cursive'

async function ensureFonts(sample: string) {
  if (!('fonts' in document)) return
  try {
    await Promise.all([
      document.fonts.load(`italic 400 48px ${SERIF}`, sample),
      document.fonts.load(`500 40px ${SERIF}`, sample),
      document.fonts.load(`600 24px ${SANS}`, sample),
      document.fonts.load(`400 40px ${HAND}`, sample),
      document.fonts.load(`400 80px ${SCRIPT}`, 'by ' + siteConfig.brandName),
    ])
  } catch {
    /* если шрифт не загрузился — используем запасной */
  }
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color = C.gold) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(r / 12, r / 12)
  ctx.beginPath()
  ctx.moveTo(0, -12)
  ctx.bezierCurveTo(0.6, -5.8, 2.2, -2.1, 12, 0)
  ctx.bezierCurveTo(2.2, 2.1, 0.6, 5.8, 0, 12)
  ctx.bezierCurveTo(-0.6, 5.8, -2.2, 2.1, -12, 0)
  ctx.bezierCurveTo(-2.2, -2.1, -0.6, -5.8, 0, -12)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function goldRule(ctx: CanvasRenderingContext2D, cx: number, y: number, half: number) {
  const g = ctx.createLinearGradient(cx - half, 0, cx + half, 0)
  g.addColorStop(0, 'rgba(197,163,107,0)')
  g.addColorStop(0.5, C.gold)
  g.addColorStop(1, 'rgba(197,163,107,0)')
  ctx.fillStyle = g
  ctx.fillRect(cx - half, y, half * 2, 1.5)
}

function setSpacing(ctx: CanvasRenderingContext2D, value: string) {
  // letterSpacing поддерживается не всеми браузерами — без него просто чуть плотнее
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = value
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function renderCard(message: Message): Promise<Blob> {
  const theme = message.theme ?? DEFAULT_THEME
  await ensureFonts(message.text + theme + siteConfig.brandName)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unsupported')

  // фон
  ctx.fillStyle = C.ivory
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, W * 0.75)
  glow.addColorStop(0, 'rgba(216,191,193,0.45)')
  glow.addColorStop(0.5, 'rgba(197,163,107,0.10)')
  glow.addColorStop(1, 'rgba(247,241,232,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // двойная золотая рамка
  ctx.strokeStyle = C.gold
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, W - 96, H - 96)
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1
  ctx.strokeRect(64, 64, W - 128, H - 128)
  ctx.globalAlpha = 1

  // звёзды по углам
  sparkle(ctx, 48, 48, 14)
  sparkle(ctx, W - 48, 48, 14)
  sparkle(ctx, 48, H - 48, 14)
  sparkle(ctx, W - 48, H - 48, 14)
  ctx.globalAlpha = 0.7
  sparkle(ctx, 180, 210, 9)
  sparkle(ctx, W - 170, 260, 12)
  sparkle(ctx, W - 210, H - 300, 8)
  sparkle(ctx, 190, H - 340, 10)
  ctx.globalAlpha = 1

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // тема
  ctx.fillStyle = C.burgundy
  ctx.font = `600 22px ${SANS}`
  setSpacing(ctx, '6px')
  ctx.fillText(theme.toUpperCase(), W / 2, 180)
  setSpacing(ctx, '0px')

  goldRule(ctx, W / 2, 214, 90)
  sparkle(ctx, W / 2, 215, 9)

  // текст послания — подбираем размер, чтобы всё поместилось
  const paragraphs = message.text.split(/\n\s*\n/).map((p) => p.trim())
  const maxWidth = W - 260
  const top = 290
  const bottomLimit = H - 310
  // короткие фразы — крупнее, длинные тексты уменьшаются, пока не поместятся
  let size = message.text.length < 70 ? 80 : message.text.length < 160 ? 64 : 50
  let layout: { lines: string[]; gapAfter: boolean }[] = []
  let lineH = 0
  let total = 0

  for (; size >= 30; size -= 2) {
    ctx.font = `italic 400 ${size}px ${SERIF}`
    lineH = size * (size > 60 ? 1.22 : 1.32)
    layout = paragraphs.map((p, i) => ({ lines: wrap(ctx, p, maxWidth), gapAfter: i < paragraphs.length - 1 }))
    total = layout.reduce((h, p) => h + p.lines.length * lineH + (p.gapAfter ? lineH * 0.55 : 0), 0)
    if (top + total <= bottomLimit) break
  }

  ctx.fillStyle = C.cocoa
  let y = top + (bottomLimit - top - total) / 2 + size
  for (const p of layout) {
    for (const l of p.lines) {
      ctx.fillText(l, W / 2, y)
      y += lineH
    }
    if (p.gapAfter) y += lineH * 0.55
  }

  // подпись — роспись как в гайде
  goldRule(ctx, W / 2, H - 262, 140)
  ctx.fillStyle = C.cocoa
  ctx.globalAlpha = 0.7
  ctx.font = `400 34px ${HAND}`
  ctx.fillText('с теплом,', W / 2, H - 212)
  ctx.globalAlpha = 1
  ctx.fillStyle = C.burgundy
  ctx.font = `400 84px ${SCRIPT}`
  ctx.fillText(`by ${siteConfig.brandName}`, W / 2, H - 140)
  ctx.fillStyle = C.burgundy
  ctx.font = `600 18px ${SANS}`
  setSpacing(ctx, '5px')
  ctx.fillText(siteConfig.cardDateLabel.toUpperCase(), W / 2, H - 86)
  setSpacing(ctx, '0px')

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  )
}

export const CARD_FILE_NAME = 'missmalofii-december-message.png'

/** Можно ли поделиться файлом через системное меню (iOS/Android) */
export function canShareFiles(): boolean {
  try {
    if (typeof navigator === 'undefined' || !navigator.canShare) return false
    const probe = new File([new Blob(['x'], { type: 'image/png' })], 'probe.png', { type: 'image/png' })
    return navigator.canShare({ files: [probe] })
  } catch {
    return false
  }
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/**
 * Сохраняет карточку: на телефонах открывает системное меню
 * «Поделиться» (там есть «Сохранить изображение»), иначе скачивает PNG.
 */
export async function saveOrShareCard(blob: Blob): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], CARD_FILE_NAME, { type: 'image/png' })

  if (canShareFiles() && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `${siteConfig.brandName} — декабрьское послание` })
      return 'shared'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled'
      // если меню не открылось — просто скачиваем
    }
  }
  downloadBlob(blob, CARD_FILE_NAME)
  return 'downloaded'
}
