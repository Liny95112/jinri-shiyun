import { useLayoutEffect, useMemo } from 'react'
import { DexCard } from '../components/DexCard'
import { EmptyState, FilterChip, PixelButton } from '../components/PixelUI'
import { drinks, foods } from '../data/items'
import type { DrinkCategory, FoodCategory, Item, Kind, SavedState } from '../types'

type DexFilter = { key: string; label: string; matches: (item: Item) => boolean }
const categoryLabels: Record<FoodCategory | DrinkCategory, string> = {
  meal: '正餐', snack: '小吃', dessert: '甜品',
  'milk-tea': '奶茶', coffee: '咖啡', 'fruit-tea': '果茶', soda: '清爽饮料', 'hot-drink': '热饮'
}

/** Only offer filters backed by the current catalogue; tags add cuisine/tea views without changing item schema. */
function filtersFor(items: Item[], kind: Kind): DexFilter[] {
  const filters: DexFilter[] = [{ key: 'all', label: '全部', matches: () => true }]
  for (const category of new Set(items.map(item => item.category))) {
    filters.push({ key: `category:${category}`, label: categoryLabels[category], matches: item => item.category === category })
  }
  if (kind === 'food') {
    for (const [tag, label] of [['日料', '日式'], ['韩餐', '韩式'], ['西餐', '西式']]) {
      if (items.some(item => item.tags.includes(tag))) filters.push({ key: `tag:${tag}`, label, matches: item => item.tags.includes(tag) })
    }
  } else if (items.some(item => item.category === 'hot-drink' && item.tags.includes('茶'))) {
    filters.push({ key: 'tag:tea', label: '茶', matches: item => item.category === 'hot-drink' && item.tags.includes('茶') })
  }
  return filters
}

export function DexPage({ kind, query, filterKey, state, onKindChange, onQueryChange, onFilterChange, onFavorite, onPreference, onDraw }: {
  kind: Kind
  query: string
  filterKey: string
  state: SavedState
  onKindChange: (kind: Kind) => void
  onQueryChange: (query: string) => void
  onFilterChange: (key: string) => void
  onFavorite: (id: string) => void
  onPreference: (item: Item, preference: 'liked' | 'disliked', add: boolean) => void
  onDraw: (items: Item[]) => void
}) {
  // A newly entered page should not inherit the previous screen's window scroll.
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }, [])

  const items: Item[] = kind === 'food' ? foods : drinks
  const filters = useMemo(() => filtersFor(items, kind), [items, kind])
  const selected = filters.find(filter => filter.key === filterKey) ?? filters[0]
  const search = query.trim().toLocaleLowerCase()
  const visible = useMemo(() => items.filter(item => selected.matches(item) && (!search || item.name.toLocaleLowerCase().includes(search))), [items, selected, search])
  const liked = kind === 'food' ? state.likedFood : state.likedDrink
  const disliked = kind === 'food' ? state.dislikedFood : state.dislikedDrink
  const countText = filterKey === 'all' && !search
    ? `找到 ${visible.length} 个${kind === 'food' ? '美食' : '饮品'}`
    : `当前：${selected.label}${search ? ` · 搜索“${query.trim()}”` : ''} · ${visible.length} 个结果`

  return <main className="page dex-page">
    <div className="page-intro"><div className="eyebrow">PIXEL FOOD DEX / 美食图鉴</div><h1>翻翻今日菜单 📖</h1><p>收录的小美味都在这里，喜欢的记得做个标记。</p></div>
    <div className="tab-row dex-tabs"><button type="button" className={kind === 'food' ? 'active' : ''} aria-pressed={kind === 'food'} onClick={() => onKindChange('food')}>🍜 美食</button><button type="button" className={kind === 'drink' ? 'active' : ''} aria-pressed={kind === 'drink'} onClick={() => onKindChange('drink')}>🥤 饮品</button></div>
    <label className="dex-search"><span aria-hidden="true">⌕</span><input type="search" aria-label={`搜索${kind === 'food' ? '美食' : '饮品'}名称`} placeholder={kind === 'food' ? '找找想吃的，例如拉面' : '找找想喝的，例如奶茶'} value={query} maxLength={40} onChange={event => onQueryChange(event.target.value)} /></label>
    <div className="dex-filters" role="group" aria-label="分类筛选">{filters.map(filter => <FilterChip key={filter.key} selected={selected.key === filter.key} onClick={() => onFilterChange(filter.key)}>{filter.label}</FilterChip>)}</div>
    <div className="dex-summary"><span>✦ {countText}</span><small>从眼前这些选项里抽取</small></div>
    {visible.length ? <><PixelButton tone="mint" className="full-width dex-draw" onClick={() => onDraw(visible)}>🎲 在这里面帮我选一个</PixelButton><div className="dex-list">{visible.map(item => <DexCard key={item.id} item={item} favorite={state.favorites.includes(item.id)} liked={liked.includes(item.name)} disliked={disliked.includes(item.name)} onFavorite={onFavorite} onPreference={onPreference} />)}</div></> : <div className="dex-empty"><EmptyState icon="🍽️" title="这里暂时什么都没有" text="没找到这个，好像还没收录呢。换个分类看看吧～" /><PixelButton tone="cream" onClick={() => { onQueryChange(''); onFilterChange('all') }}>清除筛选</PixelButton></div>}
  </main>
}
