import { itemById } from '../data/items'
import { EmptyState, PixelButton, PixelCard } from '../components/PixelUI'
import type { Item, SavedState } from '../types'

export function FavoritesPage({ state, onRemove, onChoose }: { state: SavedState; onRemove: (id: string) => void; onChoose: (item: Item) => void }) {
  const items = state.favorites.map(id => itemById.get(id)).filter((item): item is Item => Boolean(item))
  return <main className="page list-page"><div className="page-intro"><div className="eyebrow">TREASURE CHEST / 我的收藏</div><h1>小小快乐清单 ★</h1><p>纠结的时候，来这里翻翻喜欢的选项。</p></div>
    {items.length ? <div className="favorites-list">{items.map(item => <PixelCard key={item.id} className="favorite-row"><div className="favorite-row__top"><span className="favorite-icon">{item.icon}</span><div><small>{item.kind === 'food' ? '🍚 食物' : '🧋 饮品'}</small><strong>{item.name}</strong></div><button className="remove-favorite" onClick={() => onRemove(item.id)} aria-label={`移除${item.name}收藏`}>☆</button></div><p>{item.line}</p><PixelButton tone="mint" onClick={() => onChoose(item)}>今天就{item.kind === 'food' ? '吃' : '喝'}它 ↗</PixelButton></PixelCard>)}</div> : <EmptyState icon="⭐" title="还没有收藏" text="抽到心动的结果时，点一下星星就能存到这里。" />}
  </main>
}
