import { drinks, foods } from '../data/items'
import { dayKey, preferenceKeys } from './storage'
import type { DrinkFilters, FoodFilters, Item, Kind, PickResult, SavedState } from '../types'

const budgetLevel = { low: 0, mid: 1, high: 2 }
const moodText = { happy:'开心', tired:'累了', annoyed:'烦躁', treat:'想吃好的', comfort:'想被安慰' }

function matchesText(item: Item, entry: string): boolean {
  const needle = entry.trim().toLowerCase()
  if (!needle) return false
  return [item.name, ...item.tags].some(text => {
    const value = text.toLowerCase()
    return value.includes(needle) || (needle.length > 1 && needle.includes(value))
  })
}

function score(item: Item, kind: Kind, state: SavedState, food: FoodFilters, drink: DrinkFilters): number {
  const [likedKey] = preferenceKeys(kind)
  let points = Math.max(1, item.weight) * 2
  if (state[likedKey].some(entry => matchesText(item, entry))) points += 24
  const chosenBudget = kind === 'food' ? food.budget : drink.budget
  points += budgetLevel[item.budget] <= budgetLevel[chosenBudget] ? 8 : -8
  if (item.kind === 'food') {
    if (food.category !== 'any' && item.category === food.category) points += 14
    if (food.taste !== 'any' && item.tastes.includes(food.taste)) points += 13
    if (item.moods.includes(food.mood)) points += 10
  } else {
    if (drink.category !== 'any' && item.category === drink.category) points += 14
    if (drink.temperature !== 'any' && item.temperatures.includes(drink.temperature)) points += 13
    if (drink.sweetness !== 'any' && item.sweetness.includes(drink.sweetness)) points += 10
    if (drink.caffeine !== 'any' && item.caffeine === (drink.caffeine === 'yes')) points += 12
  }
  const recent = state.history.filter(h => h.kind === kind).slice(0, 8)
  const recentIndex = recent.findIndex(h => h.itemId === item.id)
  if (recentIndex >= 0) points -= (kind === 'food' && food.avoidRecent ? 32 : 16) - recentIndex * 2
  const lastIndex = state.lastShown.findIndex(x => x.id === item.id)
  if (lastIndex >= 0) {
    const days = (Date.now() - state.lastShown[lastIndex].timestamp) / 86400000
    points += days >= 7 ? 5 : -14
  } else points += 5
  return Math.max(1, points)
}

function reason(item: Item, kind: Kind, state: SavedState, food: FoodFilters, drink: DrinkFilters, relaxed: boolean): string {
  const [likedKey] = preferenceKeys(kind)
  const notes: string[] = []
  if (state[likedKey].some(entry => matchesText(item, entry))) notes.push('它在你的喜欢清单里')
  if (item.kind === 'food') {
    if (food.taste !== 'any' && item.tastes.includes(food.taste)) notes.push('很合你想吃的口味')
    if (item.moods.includes(food.mood)) notes.push(`适合你现在“${moodText[food.mood]}”的心情`)
  } else {
    if (drink.temperature !== 'any' && item.temperatures.includes(drink.temperature)) notes.push('温度正合适')
    if (drink.caffeine !== 'any' && item.caffeine === (drink.caffeine === 'yes')) notes.push(drink.caffeine === 'yes' ? '可以帮你提提神' : '不含咖啡因')
  }
  if (!state.history.slice(0, 8).some(h => h.itemId === item.id)) notes.push('最近也没有选过它')
  if (relaxed) notes.push('有些条件太难同时满足，我挑了最接近的一项')
  return notes.length ? `${notes.slice(0, 2).join('，')}。` : '刚好适合来点新鲜感，试试今天的小惊喜。'
}

/** Weighted draw with hard dislike exclusion and progressively relaxed filters. */
export function pickRecommendation(kind: Kind, state: SavedState, excludeId?: string): PickResult | null {
  const items: Item[] = kind === 'food' ? foods : drinks
  const [ , dislikedKey] = preferenceKeys(kind)
  const allowed = items.filter(item => !state[dislikedKey].some(entry => matchesText(item, entry)))
    .filter(item => !state.todayRejected.some(x => x.id === item.id && x.day === dayKey()))
    .filter(item => item.id !== excludeId)
  if (!allowed.length) return null

  const food = state.foodFilters, drink = state.drinkFilters
  // Exact match first. If conditions conflict, relax taste/temperature then category.
  const match = (item: Item, level: number): boolean => {
    if (item.kind === 'food') {
      if (level < 2 && food.category !== 'any' && item.category !== food.category) return false
      if (level === 0 && food.taste !== 'any' && !item.tastes.includes(food.taste)) return false
      return true
    }
    if (level < 2 && drink.category !== 'any' && item.category !== drink.category) return false
    if (level === 0 && drink.temperature !== 'any' && !item.temperatures.includes(drink.temperature)) return false
    if (level === 0 && drink.sweetness !== 'any' && !item.sweetness.includes(drink.sweetness)) return false
    if (level < 2 && drink.caffeine !== 'any' && item.caffeine !== (drink.caffeine === 'yes')) return false
    return true
  }
  let level = 0
  let candidates = allowed.filter(item => match(item, level))
  while (!candidates.length && level < 2) candidates = allowed.filter(item => match(item, ++level))
  const weights = candidates.map(item => score(item, kind, state, food, drink))
  let roll = Math.random() * weights.reduce((sum, weight) => sum + weight, 0)
  let selected = candidates[candidates.length - 1]
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i]
    if (roll < 0) { selected = candidates[i]; break }
  }
  return { item: selected, reason: reason(selected, kind, state, food, drink, level > 0) }
}
