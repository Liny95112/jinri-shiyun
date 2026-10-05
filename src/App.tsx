import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { pickRecommendation } from './lib/recommend'
import { dayKey, loadState, preferenceKeys, saveState } from './lib/storage'
import { HomePage } from './pages/HomePage'
import { PickerPage } from './pages/PickerPage'
import { RollingPage } from './pages/RollingPage'
import { ResultPage, type RejectReason } from './pages/ResultPage'
import { PreferencesPage } from './pages/PreferencesPage'
import { HistoryPage } from './pages/HistoryPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { DexPage } from './pages/DexPage'
import { DexResultPage } from './pages/DexResultPage'
import type { DrinkFilters, FoodFilters, Item, Kind, PickResult, SavedState } from './types'

type Screen = 'home' | 'picker' | 'rolling' | 'result' | 'preferences' | 'history' | 'favorites' | 'dex' | 'dex-rolling' | 'dex-result'
type PreferenceKey = 'likedFood' | 'dislikedFood' | 'likedDrink' | 'dislikedDrink'

export default function App() {
  const [state, setState] = useState<SavedState>(loadState)
  const [screen, setScreen] = useState<Screen>('home')
  const [kind, setKind] = useState<Kind>('food')
  const [result, setResult] = useState<PickResult | null>(null)
  const [rollId, setRollId] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [toast, setToast] = useState('')
  const [dexKind, setDexKind] = useState<Kind>('food')
  const [dexQuery, setDexQuery] = useState('')
  const [dexFilter, setDexFilter] = useState('all')
  const [dexPool, setDexPool] = useState<Item[]>([])

  useEffect(() => saveState(state), [state])
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(id) }, [toast])

  function goHome() { setScreen('home'); setResult(null); setAccepted(false) }
  function goBack() {
    if (screen === 'result') setScreen('picker')
    else if (screen === 'rolling') setScreen('picker')
    else if (screen === 'dex-result' || screen === 'dex-rolling') setScreen('dex')
    else goHome()
  }

  function openHomeSection(page: 'preferences' | 'history' | 'favorites' | 'dex') {
    if (page === 'dex') { setDexKind('food'); setDexQuery(''); setDexFilter('all') }
    setScreen(page)
  }

  function changeDexKind(next: Kind) { setDexKind(next); setDexQuery(''); setDexFilter('all') }

  function startDexDraw(items: Item[], excludeId?: string) {
    if (!items.length) return
    const choices = items.length > 1 ? items.filter(item => item.id !== excludeId) : items
    const item = choices[Math.floor(Math.random() * choices.length)]
    setDexPool(items)
    setResult({ item, reason: '从当前图鉴筛选结果中抽到的小惊喜。' })
    setAccepted(false)
    setRollId(id => id + 1)
    setScreen('dex-rolling')
  }

  function updateFilters(filters: FoodFilters | DrinkFilters) {
    if (kind === 'food') setState(current => ({ ...current, foodFilters: filters as FoodFilters }))
    else setState(current => ({ ...current, drinkFilters: filters as DrinkFilters }))
  }

  function startRoll(chosenKind = kind, currentState = state, excludeId?: string) {
    let picked = pickRecommendation(chosenKind, currentState, excludeId)
    // A tiny catalog can be exhausted by repeat requests; allow the previous result again as a last resort.
    if (!picked && excludeId) picked = pickRecommendation(chosenKind, currentState)
    if (!picked) { setState(currentState); setToast('候选都被排除啦，去「我的喜好」放回几个选项吧。'); return }
    const nextState = { ...currentState, lastShown: [{ id: picked.item.id, timestamp: Date.now() }, ...currentState.lastShown.filter(x => x.id !== picked.item.id)].slice(0, 100) }
    setState(nextState)
    setKind(chosenKind)
    setResult(picked)
    setAccepted(false)
    setRollId(id => id + 1)
    setScreen('rolling')
  }

  function accept() {
    if (!result || accepted) return
    const item = result.item
    setState(current => ({ ...current, history: [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, itemId: item.id, name: item.name, kind: item.kind, timestamp: Date.now(), fromRecommendation: true }, ...current.history].slice(0, 100) }))
    setAccepted(true)
  }

  function reject(reason: RejectReason) {
    if (!result) return
    const item = result.item
    const [likedKey, dislikedKey] = preferenceKeys(item.kind)
    const next: SavedState = { ...state }
    if (reason === 'always') {
      next[dislikedKey] = Array.from(new Set([...state[dislikedKey], item.name]))
      next[likedKey] = state[likedKey].filter(x => x !== item.name)
    } else if (reason === 'today') {
      next.todayRejected = [...state.todayRejected.filter(x => x.day === dayKey()), { id: item.id, day: dayKey() }]
    } else {
      next.history = [{ id: `${Date.now()}-manual`, itemId: item.id, name: item.name, kind: item.kind, timestamp: Date.now(), fromRecommendation: false }, ...state.history].slice(0, 100)
    }
    startRoll(item.kind, next, item.id)
  }

  function changePreference(key: PreferenceKey, value: string, add: boolean) {
    setState(current => {
      const next = { ...current, [key]: add ? Array.from(new Set([...current[key], value])) : current[key].filter(x => x !== value) }
      if (add) {
        const opposite: PreferenceKey = key.startsWith('liked') ? key.replace('liked', 'disliked') as PreferenceKey : key.replace('disliked', 'liked') as PreferenceKey
        next[opposite] = current[opposite].filter(x => x !== value)
      }
      return next
    })
  }

  function toggleFavorite(id: string) { setState(current => ({ ...current, favorites: current.favorites.includes(id) ? current.favorites.filter(x => x !== id) : [...current.favorites, id] })) }
  function changeDexPreference(item: Item, preference: 'liked' | 'disliked', add: boolean) {
    const key: PreferenceKey = item.kind === 'food'
      ? (preference === 'liked' ? 'likedFood' : 'dislikedFood')
      : (preference === 'liked' ? 'likedDrink' : 'dislikedDrink')
    changePreference(key, item.name, add)
  }
  function chooseFavorite(item: Item) {
    setState(current => ({ ...current, history: [{ id: `${Date.now()}-favorite`, itemId: item.id, name: item.name, kind: item.kind, timestamp: Date.now(), fromRecommendation: false }, ...current.history].slice(0, 100) }))
    setToast(`已记录：今天就${item.kind === 'food' ? '吃' : '喝'}${item.name}！`)
  }

  const titles: Record<Screen, string> = { home:'今日食运', picker:'选择条件', rolling:'抽取中', result:'今日推荐', preferences:'我的喜好', history:'最近吃喝', favorites:'收藏结果', dex:'美食图鉴', 'dex-rolling':'图鉴抽取中', 'dex-result':'图鉴揭晓' }

  return <div className="app-shell"><header className="app-header flex items-center">{screen === 'home' ? <><div className="brand-mark">✦</div><span>好运小食堂</span><span className="header-badge">OPEN ♡</span></> : <><button className="back-button" onClick={goBack} aria-label="返回上一页">‹</button><span>{titles[screen]}</span><button className="home-button" onClick={goHome} aria-label="返回首页">⌂</button></>}</header>
    <AnimatePresence mode="wait"><motion.div key={`${screen}-${screen === 'rolling' || screen === 'dex-rolling' ? rollId : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }} className="screen-wrap">
      {screen === 'home' && <HomePage onPick={chosen => { setKind(chosen); setScreen('picker') }} onNavigate={openHomeSection} />}
      {screen === 'picker' && <PickerPage kind={kind} state={state} onChange={updateFilters} onStart={() => startRoll()} />}
      {screen === 'rolling' && result && <RollingPage kind={kind} result={result} onComplete={() => setScreen('result')} />}
      {screen === 'result' && result && <ResultPage key={result.item.id} kind={kind} result={result} favorite={state.favorites.includes(result.item.id)} accepted={accepted} onAccept={accept} onReroll={() => startRoll(kind, state, result.item.id)} onReject={reject} onFavorite={() => toggleFavorite(result.item.id)} onHome={goHome} />}
      {screen === 'preferences' && <PreferencesPage state={state} onChange={changePreference} />}
      {screen === 'history' && <HistoryPage state={state} />}
      {screen === 'favorites' && <FavoritesPage state={state} onRemove={toggleFavorite} onChoose={chooseFavorite} />}
      {screen === 'dex' && <DexPage kind={dexKind} query={dexQuery} filterKey={dexFilter} state={state} onKindChange={changeDexKind} onQueryChange={setDexQuery} onFilterChange={setDexFilter} onFavorite={toggleFavorite} onPreference={changeDexPreference} onDraw={items => startDexDraw(items)} />}
      {screen === 'dex-rolling' && result && <RollingPage kind={result.item.kind} result={result} options={dexPool} onComplete={() => setScreen('dex-result')} />}
      {screen === 'dex-result' && result && <DexResultPage item={result.item} accepted={accepted} onAccept={accept} onReroll={() => startDexDraw(dexPool, result.item.id)} onBack={() => setScreen('dex')} />}
    </motion.div></AnimatePresence>
    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="toast" role="status">{toast}</motion.div>}</AnimatePresence>
    <div className="bottom-checker" aria-hidden="true" />
  </div>
}
