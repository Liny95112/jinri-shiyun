import { useLayoutEffect, useState } from 'react'
import { drinks, foods } from '../data/items'
import { EmptyState, PixelButton, PixelCard, SectionTitle } from '../components/PixelUI'
import type { Kind, SavedState } from '../types'

type Key = 'likedFood' | 'dislikedFood' | 'likedDrink' | 'dislikedDrink'
const modules: { key: Key; title: string; hint: string; placeholder: string; icon: string }[] = [
  { key:'likedFood', title:'爱吃的', hint:'见到它，食运会偷偷加分', placeholder:'例如：火锅、日料', icon:'♡' },
  { key:'dislikedFood', title:'不喜欢吃的', hint:'食运会绕开这些味道', placeholder:'例如：香菜、苦瓜', icon:'×' },
  { key:'likedDrink', title:'爱喝的', hint:'快乐饮品优先出场', placeholder:'例如：奶茶、柠檬茶', icon:'♡' },
  { key:'dislikedDrink', title:'不喜欢喝的', hint:'不合口味就避开', placeholder:'例如：太苦的、碳酸', icon:'×' }
]

function PreferenceModule({ config, values, onAdd, onRemove }: { config: typeof modules[number]; values: string[]; onAdd: (value: string) => void; onRemove: (value: string) => void }) {
  const [text, setText] = useState('')
  function submit(event: React.FormEvent) { event.preventDefault(); const value = text.trim().slice(0, 24); if (value) { onAdd(value); setText('') } }
  return <PixelCard className="preference-card"><SectionTitle number={config.icon} title={config.title} hint={config.hint} /><form onSubmit={submit} className="add-form"><input aria-label={`添加${config.title}`} value={text} onChange={event => setText(event.target.value)} maxLength={24} placeholder={config.placeholder} /><PixelButton type="submit" tone="mint">＋ 添加</PixelButton></form><div className="preference-tags">{values.length ? values.map(value => <button type="button" key={value} onClick={() => onRemove(value)} title={`删除 ${value}`}>{value}<span>×</span></button>) : <span className="tags-empty">这里还是空的，添加一个试试～</span>}</div></PixelCard>
}

export function PreferencesPage({ state, onChange }: { state: SavedState; onChange: (key: Key, value: string, add: boolean) => void }) {
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }, [])

  const [kind, setKind] = useState<Kind>('food')
  const featured = kind === 'food' ? foods.slice(0, 9) : drinks.slice(0, 9)
  const liked = kind === 'food' ? state.likedFood : state.likedDrink
  const disliked = kind === 'food' ? state.dislikedFood : state.dislikedDrink
  return <main className="page list-page"><div className="page-intro"><div className="eyebrow">MY LITTLE BAG / 我的喜好</div><h1>让食运更懂你 ♡</h1><p>添加口味或点选下方食物，推荐会慢慢更贴心。</p></div>
    <div className="preference-modules">{modules.map(config => <PreferenceModule key={config.key} config={config} values={state[config.key]} onAdd={value => onChange(config.key, value, true)} onRemove={value => onChange(config.key, value, false)} />)}</div>
    <PixelCard className="featured-card"><SectionTitle number="✦" title="点一点，标记常见选项" hint="喜欢和不喜欢可以随时改" /><div className="tab-row"><button className={kind === 'food' ? 'active' : ''} onClick={() => setKind('food')}>🍚 吃的</button><button className={kind === 'drink' ? 'active' : ''} onClick={() => setKind('drink')}>🧋 喝的</button></div><div className="featured-list">{featured.map(item => <div key={item.id} className="featured-item"><span>{item.icon} {item.name}</span><div><button aria-label={`喜欢${item.name}`} aria-pressed={liked.includes(item.name)} className={liked.includes(item.name) ? 'active-like' : ''} onClick={() => onChange(kind === 'food' ? 'likedFood' : 'likedDrink', item.name, !liked.includes(item.name))}>♥</button><button aria-label={`不喜欢${item.name}`} aria-pressed={disliked.includes(item.name)} className={disliked.includes(item.name) ? 'active-dislike' : ''} onClick={() => onChange(kind === 'food' ? 'dislikedFood' : 'dislikedDrink', item.name, !disliked.includes(item.name))}>×</button></div></div>)}</div></PixelCard>
    {state.likedFood.length + state.dislikedFood.length + state.likedDrink.length + state.dislikedDrink.length === 0 && <EmptyState icon="✿" title="喜好还空空的" text="标记第一项，让食运更懂你。" />}
  </main>
}
