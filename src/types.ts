export type Kind = 'food' | 'drink'
export type Budget = 'low' | 'mid' | 'high'
export type Mood = 'happy' | 'tired' | 'annoyed' | 'treat' | 'comfort'
export type FoodCategory = 'meal' | 'snack' | 'dessert'
export type Taste = 'light' | 'rich' | 'spicy' | 'sweet'
export type DrinkCategory = 'milk-tea' | 'coffee' | 'fruit-tea' | 'soda' | 'hot-drink'
export type Temperature = 'iced' | 'room' | 'hot'
export type Sweetness = 'none' | 'low' | 'normal'

export interface BaseItem {
  id: string
  name: string
  icon: string
  budget: Budget
  moods: Mood[]
  weight: number
  tags: string[]
  line: string
}

export interface FoodItem extends BaseItem {
  kind: 'food'
  category: FoodCategory
  tastes: Taste[]
}

export interface DrinkItem extends BaseItem {
  kind: 'drink'
  category: DrinkCategory
  temperatures: Temperature[]
  sweetness: Sweetness[]
  caffeine: boolean
}

export type Item = FoodItem | DrinkItem

export interface FoodFilters {
  category: FoodCategory | 'any'
  taste: Taste | 'any'
  budget: Budget
  mood: Mood
  avoidRecent: boolean
}

export interface DrinkFilters {
  category: DrinkCategory | 'any'
  temperature: Temperature | 'any'
  sweetness: Sweetness | 'any'
  budget: Budget
  caffeine: 'yes' | 'no' | 'any'
}

export interface HistoryEntry {
  id: string
  itemId: string
  name: string
  kind: Kind
  timestamp: number
  fromRecommendation: boolean
}

export interface SavedState {
  likedFood: string[]
  dislikedFood: string[]
  likedDrink: string[]
  dislikedDrink: string[]
  favorites: string[]
  history: HistoryEntry[]
  todayRejected: { id: string; day: string; kind?: Kind }[]
  lastShown: { id: string; timestamp: number }[]
  foodFilters: FoodFilters
  drinkFilters: DrinkFilters
}

export interface PickResult { item: Item; reason: string; hint: string }
