import { PixelCard } from './PixelUI'
import type { Item } from '../types'

const foodCategoryLabels = { meal: '正餐', snack: '小吃', dessert: '甜品' }
const drinkCategoryLabels = { 'milk-tea': '奶茶', coffee: '咖啡', 'fruit-tea': '果茶', soda: '清爽饮料', 'hot-drink': '热饮' }
const tasteLabels = { light: '清淡', rich: '重口', spicy: '辣', sweet: '甜' }
const temperatureLabels = { iced: '冰', room: '常温', hot: '热' }
const budgetLabels = { low: '¥', mid: '¥¥', high: '¥¥¥' }

export function DexCard({ item, favorite, liked, disliked, onFavorite, onPreference }: {
  item: Item
  favorite: boolean
  liked: boolean
  disliked: boolean
  onFavorite: (id: string) => void
  onPreference: (item: Item, preference: 'liked' | 'disliked', add: boolean) => void
}) {
  const details = item.kind === 'food'
    ? [foodCategoryLabels[item.category], item.tastes.map(taste => tasteLabels[taste]).join(' / '), budgetLabels[item.budget]]
    : [drinkCategoryLabels[item.category], item.temperatures.map(temperature => temperatureLabels[temperature]).join(' / '), item.caffeine ? '含咖啡因' : '无咖啡因', budgetLabels[item.budget]]

  return <PixelCard className="dex-card">
    <div className="dex-card__main">
      <span className="dex-card__icon" aria-hidden="true">{item.icon}</span>
      <div className="dex-card__copy"><strong>{item.name}</strong><small>{details.join(' · ')}</small>
        <div className="dex-card__tags">{item.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
    </div>
    <div className="dex-card__actions">
      <button type="button" className={favorite ? 'is-active' : ''} aria-pressed={favorite} aria-label={`${favorite ? '取消收藏' : '收藏'}${item.name}`} onClick={() => onFavorite(item.id)}>{favorite ? '★ 已收藏' : '☆ 收藏'}</button>
      <button type="button" className={liked ? 'is-active is-like' : ''} aria-pressed={liked} aria-label={`${liked ? '取消喜欢' : '喜欢'}${item.name}`} onClick={() => onPreference(item, 'liked', !liked)}>{liked ? '♥ 已喜欢' : '♡ 喜欢'}</button>
      <button type="button" className={disliked ? 'is-active is-dislike' : ''} aria-pressed={disliked} aria-label={`${disliked ? '取消不喜欢' : '不喜欢'}${item.name}`} onClick={() => onPreference(item, 'disliked', !disliked)}>{disliked ? '👎 已不喜欢' : '👎 不喜欢'}</button>
    </div>
  </PixelCard>
}
