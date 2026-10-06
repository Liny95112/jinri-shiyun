import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { pickRecommendation } from './lib/recommend'
import { drinks, foods } from './data/items'
import { generateDailyFortune, getTodayFortune, repairDailyFortune } from './lib/dailyFortune'
import { addTodayRejectedItem, cleanupExpiredTodayRejectedItems, loadState, preferenceKeys, saveState } from './lib/storage'
import { HomePage } from './pages/HomePage'
import { PickerPage } from './pages/PickerPage'
import { RollingPage } from './pages/RollingPage'
import { ResultPage, type RejectReason } from './pages/ResultPage'
import { PreferencesPage } from './pages/PreferencesPage'
import { HistoryPage } from './pages/HistoryPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { DexPage } from './pages/DexPage'
import { DexResultPage } from './pages/DexResultPage'
import { DailyFortunePage } from './pages/DailyFortunePage'
import type { DrinkFilters, FoodFilters, Item, Kind, PickResult, SavedState } from './types'

type Screen = 'home' | 'picker' | 'rolling' | 'result' | 'preferences' | 'history' | 'favorites' | 'dex' | 'dex-rolling' | 'dex-result' | 'fortune'
type PreferenceKey = 'likedFood' | 'dislikedFood' | 'likedDrink' | 'dislikedDrink'

export default function App() {
  const [state, setState] = useState<SavedState>(loadState)
  const [screen, setScreen] = useState<Screen>('home')
  const [kind, setKind] = useState<Kind>('food')
  const [result, setResult] = useState<PickResult | null>(null)
  const [rollId, setRollId] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [resultSource, setResultSource] = useState<'picker' | 'fortune'>('picker')
  const [toast, setToast] = useState('')
  const [dexKind, setDexKind] = useState<Kind>('food')
  const [dexQuery, setDexQuery] = useState('')
  const [dexFilter, setDexFilter] = useState('all')
  const [dexPool, setDexPool] = useState<Item[]>([])
  const recentDraws = useRef<string[]>([])

  useEffect(() => saveState(state), [state])
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(id) }, [toast])

  function goHome() { recentDraws.current = []; setScreen('home'); setResult(null); setAccepted(false) }
  function goBack() {
    recentDraws.current = []
    if (screen === 'result') setScreen(resultSource === 'fortune' ? 'fortune' : 'picker')
    else if (screen === 'rolling') setScreen('picker')
    else if (screen === 'dex-result' || screen === 'dex-rolling') setScreen('dex')
    else goHome()
  }

  function openHomeSection(page: 'preferences' | 'history' | 'favorites' | 'dex') {
    recentDraws.current = []
    if (page === 'dex') { setDexKind('food'); setDexQuery(''); setDexFilter('all') }
    setScreen(page)
  }

  function openFortune() {
    recentDraws.current = []
    const now = new Date()
    const saved = loadState()
    const existing = getTodayFortune(saved, now)
    if (existing) {
      const repaired = repairDailyFortune(existing, saved, now)
      if (repaired !== existing) saveState({ ...saved, dailyFortune: repaired })
      setState(current => ({ ...current, dailyFortune: repaired }))
    }
    setScreen('fortune')
  }

  function drawFortune(): 'created' | 'existing' | 'unavailable' {
    const now = new Date()
    // Read storage again so another tab cannot casually draw a second sign for the same day.
    const saved = loadState()
    const existing = getTodayFortune(saved, now)
    if (existing) { setState(current => ({ ...current, dailyFortune: existing })); return 'existing' }
    const cleaned = cleanupExpiredTodayRejectedItems(state, now)
    const fortune = generateDailyFortune(cleaned, now)
    if (!fortune) { setToast('暂时没有合适的吃喝选项，调整不喜欢清单后再来试试吧。'); return 'unavailable' }
    const lastShown = [fortune.foodId, fortune.drinkId].reduce((entries, id) =>
      [{ id, timestamp: now.getTime() }, ...entries.filter(entry => entry.id !== id)].slice(0, 100), cleaned.lastShown)
    const next = { ...cleaned, dailyFortune: fortune, lastShown }
    saveState(next) // Save before the reveal animation, so a refresh still shows this exact sign.
    setState(next)
    return 'created'
  }

  function chooseFortuneItem(chosenKind: Kind) {
    const fortune = getTodayFortune(state)
    if (!fortune) return
    const item = chosenKind === 'food'
      ? foods.find(entry => entry.id === fortune.foodId)
      : drinks.find(entry => entry.id === fortune.drinkId)
    if (!item) { setToast('这个选项暂时不在菜单里，稍后再来看看吧。'); return }
    setResult({ item, reason: '今日食签悄悄为你选中了它。', hint: '🎴 今日食签 · 一整天的小幸运' })
    setKind(chosenKind)
    setAccepted(chosenKind === 'food' ? fortune.acceptedFood === true : fortune.acceptedDrink === true)
    setResultSource('fortune')
    setScreen('result')
  }

  function changeDexKind(next: Kind) { setDexKind(next); setDexQuery(''); setDexFilter('all') }

  function rememberDraw(currentState: SavedState, item: Item, now: Date): SavedState {
    recentDraws.current = [item.id, ...recentDraws.current.filter(id => id !== item.id)].slice(0, 5)
    return { ...currentState, lastShown: [{ id: item.id, timestamp: now.getTime() }, ...currentState.lastShown.filter(entry => entry.id !== item.id)].slice(0, 100) }
  }

  function startDexDraw(items: Item[], excludeId?: string) {
    if (!items.length) return
    if (!excludeId) recentDraws.current = []
    const now = new Date()
    const currentState = cleanupExpiredTodayRejectedItems(state, now)
    const options = { pool: items, excludeId, recentDraws: recentDraws.current, usePickerFilters: false, now }
    let picked = pickRecommendation(items[0].kind, currentState, options)
    if (!picked && excludeId) picked = pickRecommendation(items[0].kind, currentState, { ...options, excludeId: undefined })
    if (!picked) { setState(currentState); setToast('当前条件下没有合适的选项，试试放宽筛选吧。'); return }
    setDexPool(items)
    setState(rememberDraw(currentState, picked.item, now))
    setResult(picked)
    setResultSource('picker')
    setAccepted(false)
    setRollId(id => id + 1)
    setScreen('dex-rolling')
  }

  function updateFilters(filters: FoodFilters | DrinkFilters) {
    if (kind === 'food') setState(current => ({ ...current, foodFilters: filters as FoodFilters }))
    else setState(current => ({ ...current, drinkFilters: filters as DrinkFilters }))
  }

  function startRoll(chosenKind = kind, currentState = state, excludeId?: string) {
    if (!excludeId) recentDraws.current = []
    const now = new Date()
    const cleanedState = cleanupExpiredTodayRejectedItems(currentState, now)
    const options = { excludeId, recentDraws: recentDraws.current, now }
    let picked = pickRecommendation(chosenKind, cleanedState, options)
    // A tiny catalog can be exhausted by repeat requests; allow the previous result again as a last resort.
    if (!picked && excludeId) picked = pickRecommendation(chosenKind, cleanedState, { ...options, excludeId: undefined })
    if (!picked) { setState(cleanedState); setToast('当前条件下没有合适的选项，试试放宽筛选吧。'); return }
    setState(rememberDraw(cleanedState, picked.item, now))
    setKind(chosenKind)
    setResult(picked)
    setResultSource('picker')
    setAccepted(false)
    setRollId(id => id + 1)
    setScreen('rolling')
  }

  function accept() {
    if (!result || accepted) return
    const item = result.item
    setState(current => {
      const fortune = resultSource === 'fortune' ? getTodayFortune(current) : null
      const acceptedKey = item.kind === 'food' ? 'acceptedFood' : 'acceptedDrink'
      if (fortune?.[acceptedKey]) return current
      return {
        ...current,
        history: [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, itemId: item.id, name: item.name, kind: item.kind, timestamp: Date.now(), fromRecommendation: true }, ...current.history].slice(0, 100),
        dailyFortune: fortune ? { ...fortune, [acceptedKey]: true } : current.dailyFortune
      }
    })
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
      next.todayRejected = addTodayRejectedItem(state, item.id, item.kind).todayRejected
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

  const titles: Record<Screen, string> = { home:'今日食运', picker:'选择条件', rolling:'抽取中', result:'今日推荐', preferences:'我的喜好', history:'最近吃喝', favorites:'收藏结果', dex:'美食图鉴', 'dex-rolling':'图鉴抽取中', 'dex-result':'图鉴揭晓', fortune:'今日食签' }

  const todayFortune = getTodayFortune(state)

  return <div className="app-shell"><header className="app-header flex items-center">{screen === 'home' ? <><div className="brand-mark">✦</div><span>好运小食堂</span><span className="header-badge">OPEN ♡</span></> : <><button className="back-button" onClick={goBack} aria-label="返回上一页">‹</button><span>{titles[screen]}</span><button className="home-button" onClick={goHome} aria-label="返回首页">⌂</button></>}</header>
    <AnimatePresence mode="wait"><motion.div key={`${screen}-${screen === 'rolling' || screen === 'dex-rolling' ? rollId : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }} className="screen-wrap">
      {screen === 'home' && <HomePage onPick={chosen => { setKind(chosen); setScreen('picker') }} onNavigate={openHomeSection} onFortune={openFortune} />}
      {screen === 'fortune' && <DailyFortunePage fortune={todayFortune} food={foods.find(item => item.id === todayFortune?.foodId)} drink={drinks.find(item => item.id === todayFortune?.drinkId)} onDraw={drawFortune} onChoose={chooseFortuneItem} />}
      {screen === 'picker' && <PickerPage kind={kind} state={state} onChange={updateFilters} onStart={() => startRoll()} />}
      {screen === 'rolling' && result && <RollingPage kind={kind} result={result} onComplete={() => setScreen('result')} />}
      {screen === 'result' && result && <ResultPage key={result.item.id} kind={kind} result={result} favorite={state.favorites.includes(result.item.id)} accepted={accepted} onAccept={accept} onReroll={() => startRoll(kind, state, result.item.id)} onReject={reject} onFavorite={() => toggleFavorite(result.item.id)} onHome={resultSource === 'fortune' ? openFortune : goHome} fortuneMode={resultSource === 'fortune'} />}
      {screen === 'preferences' && <PreferencesPage state={state} onChange={changePreference} />}
      {screen === 'history' && <HistoryPage state={state} />}
      {screen === 'favorites' && <FavoritesPage state={state} onRemove={toggleFavorite} onChoose={chooseFavorite} />}
      {screen === 'dex' && <DexPage kind={dexKind} query={dexQuery} filterKey={dexFilter} state={state} onKindChange={changeDexKind} onQueryChange={setDexQuery} onFilterChange={setDexFilter} onFavorite={toggleFavorite} onPreference={changeDexPreference} onDraw={items => startDexDraw(items)} />}
      {screen === 'dex-rolling' && result && <RollingPage kind={result.item.kind} result={result} options={dexPool} onComplete={() => setScreen('dex-result')} />}
      {screen === 'dex-result' && result && <DexResultPage result={result} accepted={accepted} onAccept={accept} onReroll={() => startDexDraw(dexPool, result.item.id)} onBack={() => { recentDraws.current = []; setScreen('dex') }} />}
    </motion.div></AnimatePresence>
    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="toast" role="status">{toast}</motion.div>}</AnimatePresence>
    <div className="bottom-checker" aria-hidden="true" />
  </div>
}
