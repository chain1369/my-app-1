'use client'

import { useCallback, useEffect, useState } from 'react'

interface StreakState {
  currentStreak: number
  bestStreak: number
  lastActiveDate?: string
}

const STORAGE_KEY = 'lifetracker_streak_state'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function diffInDays(from?: string, to?: string) {
  if (!from || !to) return undefined
  const fromDate = new Date(from)
  const toDate = new Date(to)
  const diffTime = toDate.getTime() - fromDate.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

function hydrateState(): StreakState | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    return JSON.parse(raw) as StreakState
  } catch (error) {
    console.warn('[useStreak] Failed to parse streak state', error)
    return undefined
  }
}

function persistState(state: StreakState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('[useStreak] Failed to persist streak state', error)
  }
}

export function useStreak() {
  const [state, setState] = useState<StreakState>(() => {
    const hydrated = hydrateState()
    if (hydrated) return hydrated
    const today = getTodayKey()
    return {
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: today,
    }
  })

  useEffect(() => {
    persistState(state)
  }, [state])

  const markActiveToday = useCallback(() => {
    const today = getTodayKey()
    setState((prev) => {
      const diffDays = diffInDays(prev.lastActiveDate, today)

      if (diffDays === 0) {
        return prev
      }

      if (diffDays === 1) {
        const nextCurrent = prev.currentStreak + 1
        return {
          currentStreak: nextCurrent,
          bestStreak: Math.max(prev.bestStreak, nextCurrent),
          lastActiveDate: today,
        }
      }

      return {
        currentStreak: 1,
        bestStreak: Math.max(prev.bestStreak, 1),
        lastActiveDate: today,
      }
    })
  }, [])

  const resetStreak = useCallback(() => {
    setState((prev) => ({
      currentStreak: 0,
      bestStreak: prev.bestStreak,
      lastActiveDate: prev.lastActiveDate,
    }))
  }, [])

  return {
    currentStreak: state.currentStreak,
    bestStreak: state.bestStreak,
    lastActiveDate: state.lastActiveDate,
    markActiveToday,
    resetStreak,
  }
}


