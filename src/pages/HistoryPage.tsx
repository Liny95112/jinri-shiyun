import { useState } from 'react'
import { itemById } from '../data/items'
import { EmptyState, PixelCard } from '../components/PixelUI'
import type { Kind, SavedState } from '../types'

function dateText(timestamp: number): string { return new Intl.DateTimeFormat('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(timestamp) }

export function HistoryPage({ state }: { state: SavedState }) {
  const [filter, setFilter] = useState<Kind | 'all'>('all')
  const rows = state.history.filter(entry => filter === 'all' || entry.kind === filter)
  return <main className="page list-page"><div className="page-intro"><div className="eyebrow">SAVE POINT / 最近吃喝</div><h1>我的美味日记</h1><p>每次认真做出的决定，都值得被记住。</p></div><div className="tab-row tab-row--large"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>全部</button><button className={filter === 'food' ? 'active' : ''} onClick={() => setFilter('food')}>🍚 吃过</button><button className={filter === 'drink' ? 'active' : ''} onClick={() => setFilter('drink')}>🧋 喝过</button></div>
    {rows.length ? <div className="history-list">{rows.map(entry => <PixelCard key={entry.id} className="history-row"><span className="history-icon">{itemById.get(entry.itemId)?.icon || (entry.kind === 'food' ? '🍚' : '🧋')}</span><div><strong>{entry.name}</strong><small>{entry.kind === 'food' ? '吃' : '喝'} · {entry.fromRecommendation ? '食运推荐' : '手动记录'}</small></div><time dateTime={new Date(entry.timestamp).toISOString()}>{dateText(entry.timestamp)}</time></PixelCard>)}</div> : <EmptyState icon="🍽" title="日记还是空的" text="选一次「就吃这个」或「就喝这个」，这里就会有记录啦。" />}
  </main>
}
