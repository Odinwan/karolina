import { useCallback, useState } from 'react'
import type { Message } from '../config/messages'

/**
 * Какие послания посетитель уже видел, хранится в его браузере (localStorage).
 * Так при «ещё одно послание» и при повторном заходе по QR-коду
 * он получает только новые послания. Когда открыты все — начинается новый круг.
 */
const SEEN_KEY = 'missmalofii-seen-messages'

function readSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    const arr: unknown = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [])
  } catch {
    return new Set()
  }
}

function writeSeen(seen: Set<string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]))
  } catch {
    /* приватный режим или запрет хранилища — работаем без запоминания */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Колода из ещё не увиденных посланий; если все увидены — новый круг */
function buildDeck(all: Message[], avoidId?: string): { deck: Message[]; restarted: boolean } {
  const seen = readSeen()
  // учитываем только существующие послания (их список мог поменяться)
  const unseen = all.filter((m) => !seen.has(m.id))
  if (unseen.length > 0) return { deck: shuffle(unseen), restarted: false }

  writeSeen(new Set())
  let deck = shuffle(all)
  if (deck.length > 1 && deck[0].id === avoidId) deck = [...deck.slice(1), deck[0]]
  return { deck, restarted: true }
}

export function useMessageDeck(all: Message[]) {
  const [state, setState] = useState(() => ({ ...buildDeck(all), index: 0 }))

  const next = useCallback(() => {
    setState((s) => {
      if (s.index + 1 < s.deck.length) return { ...s, index: s.index + 1, restarted: false }
      return { ...buildDeck(all, s.deck[s.index]?.id), index: 0 }
    })
  }, [all])

  /** Отметить послание как прочитанное (вызывается, когда оно показано) */
  const markSeen = useCallback((id: string) => {
    const seen = readSeen()
    if (seen.has(id)) return
    seen.add(id)
    writeSeen(seen)
  }, [])

  return { message: state.deck[state.index], next, markSeen, restarted: state.restarted }
}
