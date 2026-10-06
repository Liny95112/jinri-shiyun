import type { DailyFortune, DrinkFilters, FoodFilters, FortuneLevel, HistoryEntry, Kind, SavedState } from '../types'

const KEY = 'jinri-shiyun:v1'

export const defaultFoodFilters: FoodFilters = { category: 'any', taste: 'any', budget: 'mid', mood: 'comfort', avoidRecent: true }
export const defaultDrinkFilters: DrinkFilters = { category: 'any', temperature: 'any', sweetness: 'any', budget: 'mid', caffeine: 'any' }

export const initialState: SavedState = {
  likedFood: [], dislikedFood: [], likedDrink: [], dislikedDrink: [],
  favorites: [], history: [], todayRejected: [], lastShown: [],
  foodFilters: defaultFoodFilters, drinkFilters: defaultDrinkFilters, dailyFortune: null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : []
}

const fortuneLevels: FortuneLevel[] = ['大吉', '中吉', '小吉', '吉', '平']
function readDailyFortune(value: unknown): DailyFortune | null {
  if (!value || typeof value !== 'object') return null
  const saved = value as Partial<DailyFortune>
  if (typeof saved.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(saved.date)
    || !fortuneLevels.includes(saved.fortuneLevel as FortuneLevel)
    || typeof saved.foodId !== 'string' || typeof saved.drinkId !== 'string'
    || typeof saved.luckyTaste !== 'string' || typeof saved.message !== 'string') return null
  return {
    date: saved.date, fortuneLevel: saved.fortuneLevel as FortuneLevel,
    foodId: saved.foodId, drinkId: saved.drinkId, luckyTaste: saved.luckyTaste,
    luckyTags: stringArray(saved.luckyTags), message: saved.message,
    acceptedFood: saved.acceptedFood === true, acceptedDrink: saved.acceptedDrink === true
  }
}

export function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw) as Partial<SavedState>
    return {
      likedFood: stringArray(saved.likedFood), dislikedFood: stringArray(saved.dislikedFood),
      likedDrink: stringArray(saved.likedDrink), dislikedDrink: stringArray(saved.dislikedDrink),
      favorites: stringArray(saved.favorites),
      history: Array.isArray(saved.history) ? saved.history.filter((h): h is HistoryEntry => Boolean(h && typeof h === 'object' && typeof h.name === 'string' && typeof h.timestamp === 'number')).slice(0, 100) : [],
      todayRejected: Array.isArray(saved.todayRejected) ? saved.todayRejected.filter(x => x && typeof x.id === 'string' && x.day === dayKey()) : [],
      lastShown: Array.isArray(saved.lastShown) ? saved.lastShown.filter(x => x && typeof x.id === 'string' && typeof x.timestamp === 'number').slice(0, 100) : [],
      foodFilters: { ...defaultFoodFilters, ...saved.foodFilters },
      drinkFilters: { ...defaultDrinkFilters, ...saved.drinkFilters },
      dailyFortune: readDailyFortune(saved.dailyFortune)
    }
  } catch {
    return initialState
  }
}

export function saveState(state: SavedState): void {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* Private browsing may deny storage. */ }
}

export function dayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

/** Reuse the v1 field; expired local-day rejections are removed on load and before each draw. */
export function getTodayRejectedItems(state: SavedState, date = new Date(), kind?: Kind) {
  return state.todayRejected.filter(entry => entry.day === dayKey(date) && (!kind || !entry.kind || entry.kind === kind))
}

export function cleanupExpiredTodayRejectedItems(state: SavedState, date = new Date()): SavedState {
  const todayRejected = getTodayRejectedItems(state, date)
  return todayRejected.length === state.todayRejected.length ? state : { ...state, todayRejected }
}

export function addTodayRejectedItem(state: SavedState, id: string, kind: Kind, date = new Date()): SavedState {
  const todayRejected = getTodayRejectedItems(state, date)
  return { ...state, todayRejected: todayRejected.some(entry => entry.id === id && (!entry.kind || entry.kind === kind))
    ? todayRejected
    : [...todayRejected, { id, kind, day: dayKey(date) }] }
}

export function preferenceKeys(kind: Kind): ['likedFood' | 'likedDrink', 'dislikedFood' | 'dislikedDrink'] {
  return kind === 'food' ? ['likedFood', 'dislikedFood'] : ['likedDrink', 'dislikedDrink']
}
