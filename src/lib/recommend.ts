import { drinks, foods } from '../data/items'
import { getTodayRejectedItems, preferenceKeys } from './storage'
import type { Budget, DrinkFilters, FoodFilters, FoodItem, Item, Kind, Mood, PickResult, SavedState } from '../types'

const budgetLevel = { low: 0, mid: 1, high: 2 }
const moodText: Record<Mood, string> = {
  happy:'开心', tired:'累了', annoyed:'烦躁', stressed:'压力大',
  'low-appetite':'没胃口', craving:'嘴馋了', treat:'想犒劳自己',
  comfort:'想被安慰', any:'随便啦'
}

export type DayPeriod = 'breakfast' | 'lunch' | 'tea' | 'dinner' | 'late'

export interface RecommendationOptions {
  pool?: readonly Item[]
  excludeId?: string
  recentDraws?: readonly string[]
  usePickerFilters?: boolean
  ignoreTimePreference?: boolean
  now?: Date
  random?: () => number
}

export interface RecommendationScore {
  base: number
  preference: number
  filters: number
  mood: number
  time: number
  lastShown: number
  historyMultiplier: number
  todayMultiplier: number
  recentDrawMultiplier: number
  final: number
}

export function getDayPeriod(date = new Date()): DayPeriod {
  const minutes = date.getHours() * 60 + date.getMinutes()
  if (minutes >= 300 && minutes < 630) return 'breakfast'
  if (minutes >= 630 && minutes < 870) return 'lunch'
  if (minutes >= 870 && minutes < 1050) return 'tea'
  if (minutes >= 1050 && minutes < 1290) return 'dinner'
  return 'late'
}

const homePeriodCopy: Record<DayPeriod, string> = {
  breakfast: 'GOOD MORNING · 早餐时间', lunch: 'LUNCH TIME · 今天吃饱一点',
  tea: 'TEA TIME · 来点下午能量', dinner: 'DINNER TIME · 晚饭交给食运',
  late: 'MIDNIGHT SNACK · 夜猫子营业中'
}

export function getHomePeriodCopy(date = new Date()): string {
  return homePeriodCopy[getDayPeriod(date)]
}

function getPeriodHint(kind: Kind, period: DayPeriod): string {
  const hints: Record<DayPeriod, [string, string]> = {
    breakfast: ['🌤️ 早上吃点舒服的吧', '🌤️ 早上喝点顺口的吧'],
    lunch: ['☀️ 午餐吃饱一点', '☀️ 午间补点能量'],
    tea: ['☕ 下午适合来点轻松的', '☕ 下午适合来点轻松的'],
    dinner: ['🌙 今晚吃顿满足的', '🌙 今晚喝点喜欢的'],
    late: ['🌃 夜猫子模式启动', '🌃 夜猫子模式启动']
  }
  return hints[period][kind === 'food' ? 0 : 1]
}

function hasTag(item: Item, ...tags: string[]): boolean {
  return item.tags.some(tag => tags.some(needle => tag.includes(needle)))
}

/** Mood is a soft preference layered after explicit picker filters. Existing tags carry the food cues. */
export function getFoodMoodScore(item: FoodItem, selected: Mood, chosenBudget: Budget, liked = false): number {
  if (selected === 'any') return 0
  const cue = (...words: string[]) => hasTag(item, ...words) || words.some(word => item.name.includes(word))
  const is = (taste: FoodItem['tastes'][number]) => item.tastes.includes(taste)
  const base = item.moods.includes(selected) ? 10 : 0
  switch (selected) {
    case 'happy':
      return base + (item.category === 'dessert' ? 6 : 0)
        + (item.category === 'meal' && cue('聚餐', '火锅', '烤肉', '日料', '韩餐') ? 7 : 0)
    case 'tired':
      return base + (item.moods.includes('comfort') ? 5 : 0)
        + (cue('粥', '汤', '面', '粉', '盖饭', '米饭', '热乎') ? 9 : 0)
        + (is('light') ? 5 : 0) - (is('spicy') && is('rich') ? 6 : 0)
    case 'annoyed':
      return base + (is('rich') || is('spicy') ? 9 : 0)
        + (cue('炸物', '酥脆', '烧烤', '火锅', '烤肉') ? 7 : 0)
        + (item.category === 'dessert' ? 5 : 0)
    case 'stressed':
      return (item.moods.includes('comfort') || item.moods.includes('treat') ? 9 : 0)
        + (item.category === 'dessert' ? 8 : 0)
        + (is('sweet') || is('rich') ? 5 : 0) + (liked ? 5 : 0)
    case 'low-appetite':
      return (is('light') ? 16 : 0)
        + (cue('粥', '汤', '米粉', '米线', '面', '清爽', '水果', '小份') ? 10 : 0)
        + (item.category === 'snack' ? 6 : 0)
        - (is('spicy') ? 10 : 0) - (is('rich') ? 8 : 0)
        - (cue('火锅', '烤肉', '烧烤', '炸物', '油腻', '聚餐') ? 10 : 0)
    case 'craving':
      return (item.category === 'snack' || item.category === 'dessert' ? 16 : -5)
        + (cue('炸物', '酥脆', '冰淇淋', '蛋糕', '甜', '夜宵') ? 7 : 0)
    case 'treat':
      return base + (cue('火锅', '烤肉', '牛排', '寿司', '刺身', '寿喜', '日料', '聚餐') ? 10 : 0)
        + (item.category === 'dessert' ? 6 : 0)
        + (item.budget === chosenBudget && chosenBudget === 'high' ? 8 : 0)
    case 'comfort':
      return base + (cue('热乎', '汤', '粥', '面', '咖喱') ? 8 : 0)
        + (is('sweet') || item.category === 'dessert' ? 6 : 0)
  }
}

/** Category and existing tags guide the daypart; nothing is removed from the pool. */
export function getTimePreferenceScore(item: Item, date = new Date()): number {
  const period = getDayPeriod(date)
  if (item.kind === 'food') {
    switch (period) {
      case 'breakfast':
        return (item.tastes.includes('light') ? 10 : 0)
          + (hasTag(item, '早餐', '粥', '包子', '饺子', '面包', '鸡蛋', '面食', '清淡', '汤') ? 14 : 0)
          + (item.category === 'meal' ? 4 : 0)
          - (hasTag(item, '火锅', '烧烤', '烤肉', '夜宵', '聚餐') ? 18 : 0)
          - (item.tastes.includes('spicy') ? 14 : 0)
          - (item.tastes.includes('rich') ? 5 : 0)
      case 'lunch':
        return (item.category === 'meal' ? 10 : -5)
          + (hasTag(item, '米饭', '面', '粉', '咖喱', '日料', '韩餐', '西餐') ? 5 : 0)
      case 'tea':
        return (item.category === 'dessert' ? 18 : item.category === 'snack' ? 12 : -8)
          + (item.tastes.includes('sweet') ? 4 : 0)
      case 'dinner':
        return (item.category === 'meal' ? 11 : item.category === 'dessert' ? -8 : -2)
          + (hasTag(item, '火锅', '烤肉', '烧烤', '米饭', '面', '粉', '日料', '韩餐', '鱼') ? 6 : 0)
      case 'late':
        return (item.category === 'snack' ? 15 : item.category === 'dessert' ? -6 : 2)
          + (hasTag(item, '夜宵', '烧烤', '炸物', '热乎', '面', '粉', '火锅') ? 8 : 0)
    }
  }
  switch (period) {
    case 'breakfast': return (item.category === 'coffee' ? 14 : item.category === 'hot-drink' ? 8 : 0)
      + (item.temperatures.includes('hot') ? 4 : 0)
    case 'lunch': return item.category === 'fruit-tea' || item.category === 'soda' ? 4 : 0
    case 'tea': return ['milk-tea', 'coffee', 'fruit-tea'].includes(item.category) ? 15 : item.category === 'hot-drink' ? 7 : 2
    case 'dinner': return item.category === 'coffee' ? -5 : 5
    case 'late': return (['milk-tea', 'hot-drink', 'soda'].includes(item.category) ? 11 : 0)
      + (item.temperatures.includes('hot') ? 4 : 0)
      - (item.category === 'coffee' ? 18 : 0)
      - (item.caffeine ? 10 : 0)
  }
}

function matchesText(item: Item, entry: string): boolean {
  const needle = entry.trim().toLowerCase()
  if (!needle) return false
  return [item.name, ...item.tags].some(text => {
    const value = text.toLowerCase()
    return value.includes(needle) || (needle.length > 1 && needle.includes(value))
  })
}

export function scoreRecommendation(item: Item, state: SavedState, options: RecommendationOptions = {}): RecommendationScore {
  const kind = item.kind
  const now = options.now ?? new Date()
  const usePickerFilters = options.usePickerFilters !== false
  const food = state.foodFilters, drink = state.drinkFilters
  const [likedKey] = preferenceKeys(kind)
  const base = Math.max(1, item.weight) * 2
  const preference = state[likedKey].some(entry => matchesText(item, entry)) ? 24 : 0
  let filters = 0
  let mood = 0
  const chosenBudget = kind === 'food' ? food.budget : drink.budget
  if (usePickerFilters) {
    filters += budgetLevel[item.budget] <= budgetLevel[chosenBudget] ? 8 : -8
    if (item.kind === 'food') {
      if (food.category !== 'any' && item.category === food.category) filters += 14
      if (food.taste !== 'any' && item.tastes.includes(food.taste)) filters += 13
      mood += getFoodMoodScore(item, food.mood, food.budget, preference > 0)
    } else {
      if (drink.category !== 'any' && item.category === drink.category) filters += 14
      if (drink.temperature !== 'any' && item.temperatures.includes(drink.temperature)) filters += 13
      if (drink.sweetness !== 'any' && item.sweetness.includes(drink.sweetness)) filters += 10
      if (drink.caffeine !== 'any' && item.caffeine === (drink.caffeine === 'yes')) filters += 12
    }
  }
  const time = options.ignoreTimePreference ? 0 : getTimePreferenceScore(item, now)
  const shown = state.lastShown.find(entry => entry.id === item.id)
  const lastShown = shown && now.getTime() - shown.timestamp < 7 * 86400000 ? -14 : 5
  const latestHistory = state.history.filter(entry => entry.kind === kind && entry.itemId === item.id)
    .reduce((latest, entry) => Math.max(latest, entry.timestamp), 0)
  const daysSinceHistory = latestHistory ? Math.max(0, now.getTime() - latestHistory) / 86400000 : Infinity
  const strongAvoid = kind === 'food' && food.avoidRecent
  const historyMultiplier = daysSinceHistory < 1 ? (strongAvoid ? .28 : .4)
    : daysSinceHistory < 3 ? (strongAvoid ? .65 : .72)
      : daysSinceHistory < 7 ? (strongAvoid ? .88 : .9) : 1
  const todayMultiplier = getTodayRejectedItems(state, now, kind).some(entry => entry.id === item.id) ? .02 : 1
  const drawIndex = options.recentDraws?.indexOf(item.id) ?? -1
  const recentDrawMultiplier = drawIndex < 0 ? 1 : [.12, .3, .45, .6, .72][Math.min(drawIndex, 4)]
  const final = Math.max(.01, Math.max(1, base + preference + filters + mood + time + lastShown)
    * historyMultiplier * todayMultiplier * recentDrawMultiplier)
  return { base, preference, filters, mood, time, lastShown, historyMultiplier, todayMultiplier, recentDrawMultiplier, final }
}

function reason(item: Item, kind: Kind, state: SavedState, food: FoodFilters, drink: DrinkFilters, relaxed: boolean, usePickerFilters: boolean): string {
  const [likedKey] = preferenceKeys(kind)
  const notes: string[] = []
  if (state[likedKey].some(entry => matchesText(item, entry))) notes.push('它在你的喜欢清单里')
  if (usePickerFilters && item.kind === 'food') {
    if (food.taste !== 'any' && item.tastes.includes(food.taste)) notes.push('很合你想吃的口味')
    if (food.mood !== 'any' && getFoodMoodScore(item, food.mood, food.budget) > 0) notes.push(`适合你现在“${moodText[food.mood]}”的心情`)
  } else if (usePickerFilters && item.kind === 'drink') {
    if (drink.temperature !== 'any' && item.temperatures.includes(drink.temperature)) notes.push('温度正合适')
    if (drink.caffeine !== 'any' && item.caffeine === (drink.caffeine === 'yes')) notes.push(drink.caffeine === 'yes' ? '可以帮你提提神' : '不含咖啡因')
  }
  if (!state.history.slice(0, 8).some(h => h.itemId === item.id)) notes.push('最近也没有选过它')
  if (relaxed) notes.push('有些条件太难同时满足，我挑了最接近的一项')
  return notes.length ? `${notes.slice(0, 2).join('，')}。` : '刚好适合来点新鲜感，试试今天的小惊喜。'
}

/** Shared weighted draw. Picker filters can relax; a dex pool stays within its visible items. */
export function pickRecommendation(kind: Kind, state: SavedState, options: RecommendationOptions = {}): PickResult | null {
  const items: readonly Item[] = options.pool ?? (kind === 'food' ? foods : drinks)
  const usePickerFilters = options.usePickerFilters !== false
  const now = options.now ?? new Date()
  const [ , dislikedKey] = preferenceKeys(kind)
  const allowed = items.filter(item => item.kind === kind && !state[dislikedKey].some(entry => matchesText(item, entry)))
    .filter(item => item.id !== options.excludeId)
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
  let candidates = usePickerFilters ? allowed.filter(item => match(item, level)) : allowed
  while (usePickerFilters && !candidates.length && level < 2) candidates = allowed.filter(item => match(item, ++level))
  const weights = candidates.map(item => scoreRecommendation(item, state, { ...options, now }).final)
  if (import.meta.env?.DEV) {
    console.debug('[今日食运] 推荐候选', candidates.map((item, index) => ({ name: item.name, score: Math.round(weights[index] * 10) / 10 }))
      .sort((a, b) => b.score - a.score).slice(0, 8))
  }
  let roll = Math.min(.999999, Math.max(0, (options.random ?? Math.random)())) * weights.reduce((sum, weight) => sum + weight, 0)
  let selected = candidates[candidates.length - 1]
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i]
    if (roll < 0) { selected = candidates[i]; break }
  }
  return { item: selected, reason: reason(selected, kind, state, food, drink, level > 0, usePickerFilters), hint: getPeriodHint(kind, getDayPeriod(now)) }
}
