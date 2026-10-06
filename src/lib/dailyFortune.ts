import { drinks, foods } from '../data/items'
import { pickRecommendation } from './recommend'
import type { DailyFortune, FortuneLevel, SavedState, Taste } from '../types'

const levels: { name: FortuneLevel; weight: number; caption: string }[] = [
  { name: '大吉', weight: 15, caption: '今天的美味正在靠近' },
  { name: '中吉', weight: 25, caption: '食运轻轻上升中' },
  { name: '小吉', weight: 25, caption: '小小快乐刚刚好' },
  { name: '吉', weight: 25, caption: '好味道会遇见你' },
  { name: '平', weight: 10, caption: '简单吃好也很棒' }
]

const messages = [
  '别让选择困难耽误了吃饭，第一眼喜欢的就很好。',
  '今天认真吃饭，也算认真生活。',
  '喜欢吃什么就去吃，快乐不用排队。',
  '有时候一顿好吃的，就是今天的小奖励。',
  '不必每次都做最正确的选择，好吃就可以。',
  '今天的烦恼先放一边，饭还是要好好吃。',
  '慢慢吃，今天的好心情也会慢慢来。',
  '给今天留一点期待，也给胃留一点位置。',
  '热乎乎的一口，能让普通的一天变柔软。',
  '今天的小确幸，也许就藏在下一口里。',
  '吃到喜欢的味道，今天就已经赚到了。',
  '别急着赶路，先好好享受这一餐。',
  '选一份喜欢的，让今天多一点亮晶晶。',
  '想吃的东西值得被认真对待。',
  '偶尔跟着食运走，也会遇到新惊喜。',
  '今天不用想太多，先把快乐吃进肚子里。',
  '一口接一口，给忙碌按个暂停键。',
  '没有标准答案，只有适合此刻的味道。',
  '普通的一餐，也能吃出小小的仪式感。',
  '今天想吃什么，就对自己坦诚一点。',
  '在喜欢的味道里，给自己充一点电。',
  '把纠结交给食运，把好胃口留给自己。',
  '愿今天的第一口，刚好合你的心意。',
  '一杯顺口的饮品，也能让今天轻快一点。',
  '再忙，也要留一点时间给好吃的。',
  '今天的食运悄悄说：你值得好好吃饭。',
  '不一定每顿都惊艳，吃得开心就很好。',
  '小小一餐，照顾好大大的自己。'
]

const dailyTips = [
  '热乎乎', '试点新的', '吃顿好的', '慢慢吃', '吃点甜的', '来点清爽的',
  '别太纠结', '奖励自己', '尝点没吃过的', '喝点喜欢的', '听听胃口', '留点小惊喜'
]

const tasteLabels: Record<Taste, string> = {
  light: '清淡', rich: '浓郁', spicy: '微辣', sweet: '香甜'
}

function sample<T>(items: readonly T[], random: () => number): T {
  return items[Math.min(items.length - 1, Math.floor(Math.max(0, random()) * items.length))]
}

export function fortuneDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getTodayFortune(state: SavedState, date = new Date()): DailyFortune | null {
  return state.dailyFortune?.date === fortuneDateKey(date) ? state.dailyFortune : null
}

export function fortuneCaption(level: FortuneLevel): string {
  return levels.find(entry => entry.name === level)?.caption ?? levels[levels.length - 1].caption
}

function chooseLevel(random: () => number): FortuneLevel {
  let roll = Math.max(0, Math.min(.999999, random())) * 100
  for (const level of levels) {
    roll -= level.weight
    if (roll < 0) return level.name
  }
  return '平'
}

function chooseTaste(random: () => number): string {
  // Build the vocabulary from the actual catalog, so the sign never invents a new taste.
  const available = (Object.keys(tasteLabels) as Taste[])
    .filter(taste => foods.some(item => item.tastes.includes(taste)))
    .map(taste => tasteLabels[taste])
  for (const [tag, label] of [['咸香', '咸香'], ['酸', '酸爽'], ['清爽', '清爽']] as const) {
    if (foods.some(item => item.tags.some(value => value.includes(tag)))) available.push(label)
  }
  return sample(available.length ? available : ['清淡'], random)
}

function chooseTips(random: () => number): string[] {
  const remaining = [...dailyTips]
  return Array.from({ length: 3 }, () => remaining.splice(Math.min(remaining.length - 1, Math.floor(Math.max(0, random()) * remaining.length)), 1)[0])
}

/** Reuses the main weighted picker, with picker filters and current-hour bias disabled for a whole-day sign. */
export function generateDailyFortune(state: SavedState, date = new Date(), random = Math.random): DailyFortune | null {
  const options = { now: date, random, usePickerFilters: false, ignoreTimePreference: true }
  const food = pickRecommendation('food', state, options)?.item
  const drink = pickRecommendation('drink', state, options)?.item
  if (!food || !drink) return null
  return {
    date: fortuneDateKey(date), fortuneLevel: chooseLevel(random),
    foodId: food.id, drinkId: drink.id, luckyTaste: chooseTaste(random),
    luckyTags: chooseTips(random), message: sample(messages, random),
    acceptedFood: false, acceptedDrink: false
  }
}

/** If a later catalog edit removes an item, keep the original sign and repair only the missing item. */
export function repairDailyFortune(fortune: DailyFortune, state: SavedState, date = new Date()): DailyFortune {
  const options = { now: date, usePickerFilters: false, ignoreTimePreference: true }
  const foodId = foods.some(item => item.id === fortune.foodId)
    ? fortune.foodId : (pickRecommendation('food', state, options)?.item.id ?? fortune.foodId)
  const drinkId = drinks.some(item => item.id === fortune.drinkId)
    ? fortune.drinkId : (pickRecommendation('drink', state, options)?.item.id ?? fortune.drinkId)
  return foodId === fortune.foodId && drinkId === fortune.drinkId ? fortune : { ...fortune, foodId, drinkId }
}
