/**
 * useSpacedRepetition — SM-2 algorithm implementation
 *
 * Based on the SuperMemo SM-2 algorithm (the basis for Anki).
 * Cards are scheduled for review based on a quality rating (0–5) per attempt.
 *
 * Persistence: localStorage (keyed by userId). Can be swapped for a backend
 * write — just replace the load/save functions with API calls.
 *
 * Usage:
 *   const { getDueCards, recordAttempt, isDue } = useSpacedRepetition(userId)
 *   isDue('motion-1')            → true/false
 *   getDueCards(['motion-1', 'motion-2']) → ['motion-1'] (only due ones)
 *   recordAttempt('motion-1', quality)   → updates schedule
 *
 * Quality ratings:
 *   5 — perfect response
 *   4 — correct after a hesitation
 *   3 — correct with difficulty
 *   2 — incorrect but felt easy to recall
 *   1 — incorrect, hard
 *   0 — complete blackout
 */

import { useState, useCallback } from 'react'

const STORE_KEY = (uid) => `bw_srs_${uid}`

function loadCards(userId) {
  try { return JSON.parse(localStorage.getItem(STORE_KEY(userId)) || '{}') } catch { return {} }
}
function saveCards(userId, cards) {
  try { localStorage.setItem(STORE_KEY(userId), JSON.stringify(cards)) } catch {}
}

/**
 * SM-2 core: given previous interval (days), repetition count, and EF,
 * return { nextInterval, repetitions, ef } after a quality response.
 */
function sm2(quality, interval = 1, repetitions = 0, ef = 2.5) {
  // Clamp quality
  const q = Math.max(0, Math.min(5, quality))

  let nextEf   = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  nextEf = Math.max(1.3, nextEf)

  let nextRep  = repetitions
  let nextInt  = interval

  if (q < 3) {
    // Failed — restart
    nextRep = 0
    nextInt = 1
  } else {
    if (repetitions === 0)      nextInt = 1
    else if (repetitions === 1) nextInt = 6
    else                         nextInt = Math.round(interval * nextEf)
    nextRep += 1
  }

  return { nextInterval: nextInt, repetitions: nextRep, ef: nextEf }
}

export default function useSpacedRepetition(userId = '1') {
  const [cards, setCards] = useState(() => loadCards(userId))

  /** Check if a card is due today (or has never been seen) */
  const isDue = useCallback((cardId) => {
    const card = cards[cardId]
    if (!card) return true // never seen → always due
    return new Date(card.nextReview) <= new Date()
  }, [cards])

  /** Filter a list of cardIds to only those currently due */
  const getDueCards = useCallback((cardIds) => {
    return cardIds.filter(id => isDue(id))
  }, [isDue])

  /**
   * Record an attempt on a card.
   * @param {string} cardId
   * @param {number} quality  0–5 (see file header)
   */
  const recordAttempt = useCallback((cardId, quality) => {
    setCards(prev => {
      const existing = prev[cardId] || { interval: 1, repetitions: 0, ef: 2.5 }
      const { nextInterval, repetitions, ef } = sm2(quality, existing.interval, existing.repetitions, existing.ef)

      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + nextInterval)

      const next = {
        ...prev,
        [cardId]: {
          interval:   nextInterval,
          repetitions,
          ef,
          nextReview: nextReview.toISOString(),
          lastSeen:   new Date().toISOString(),
          attempts:   (existing.attempts ?? 0) + 1,
        }
      }
      saveCards(userId, next)
      return next
    })
  }, [userId])

  /** Get full schedule info for a card (for debugging / display) */
  const getCard = useCallback((cardId) => cards[cardId] ?? null, [cards])

  /** How many days until a card is next due (negative = overdue) */
  const daysUntilDue = useCallback((cardId) => {
    const card = cards[cardId]
    if (!card) return 0
    const diff = new Date(card.nextReview) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }, [cards])

  return { isDue, getDueCards, recordAttempt, getCard, daysUntilDue }
}
