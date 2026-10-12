import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { PixelButton, PixelCard, PixelModal } from '../components/PixelUI'
import type { Item, Kind, PickResult } from '../types'
import sparkle01 from '../assets/pixel/fx/sparkle_01.png'
import sparkle02 from '../assets/pixel/fx/sparkle_02.png'
import sparkle03 from '../assets/pixel/fx/sparkle_03.png'
import coolSparkle from '../assets/pixel/fx/result_cool_sparkle.png'
import steamSheet from '../assets/pixel/fx/result_steam_sheet.png'
import servingTray from '../assets/pixel/fx/result_serving_tray.png'
import tonkotsuRamen from '../assets/pixel/food/food_tonkotsu_ramen.png'
import genericFoodIcon from '../assets/pixel/home/home_food_icon.png'
import genericDrinkIcon from '../assets/pixel/home/home_drink_icon.png'
import './result-serving.css'

export type RejectReason = 'today' | 'always' | 'recent'

const foodCategory = { meal: '正餐', snack: '小吃', dessert: '甜品' }
const drinkCategory = { 'milk-tea': '奶茶', coffee: '咖啡', 'fruit-tea': '果茶', soda: '清爽饮料', 'hot-drink': '热饮' }
const taste = { light: '清淡', rich: '浓郁', spicy: '辣味', sweet: '甜味' }
const temperature = { iced: '冰', room: '常温', hot: '热' }
const budget = { low: '¥', mid: '¥¥', high: '¥¥¥' }

function menuTags(item: Item): string[] {
  return item.kind === 'food'
    ? [foodCategory[item.category], item.tastes.map(value => taste[value]).join(' / '), budget[item.budget]]
    : [drinkCategory[item.category], item.temperatures.map(value => temperature[value]).join(' / '), item.caffeine ? '含咖啡因' : '无咖啡因']
}

export function ResultPage({ kind, result, favorite, accepted, onAccept, onReroll, onReject, onFavorite, onHome, fortuneMode = false, quickReveal = false }: {
  kind: Kind; result: PickResult; favorite: boolean; accepted: boolean;
  onAccept: () => void; onReroll: () => void; onReject: (reason: RejectReason) => void; onFavorite: () => void; onHome: () => void; fortuneMode?: boolean; quickReveal?: boolean
}) {
  const [modal, setModal] = useState(false)
  const [favoritePulse, setFavoritePulse] = useState(0)
  const [confirmBurst, setConfirmBurst] = useState(false)
  const [busy, setBusy] = useState(false)
  const [skipMotion, setSkipMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const prefersReducedMotion = useReducedMotion()
  const actionLock = useRef(false)
  const unlockTimer = useRef<number | null>(null)
  const reduced = Boolean(prefersReducedMotion) || skipMotion

  // ResultPage mounts for each new result. Updating favorite/accepted never restarts the reveal.
  useEffect(() => {
    if (reduced) { setReady(true); return }
    const timer = window.setTimeout(() => setReady(true), quickReveal ? 580 : 780)
    return () => window.clearTimeout(timer)
  }, [reduced, quickReveal])

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) { setSkipMotion(true); setReady(true) }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current)
    }
  }, [])

  const verb = kind === 'food' ? '吃' : '喝'
  const icon = result.item.id === 'tonkotsu-ramen' ? tonkotsuRamen : kind === 'food' ? genericFoodIcon : genericDrinkIcon
  const tags = menuTags(result.item)
  const warmEffect = result.item.id === 'tonkotsu-ramen' ||
    (result.item.kind === 'drink' && result.item.temperatures.includes('hot') && !result.item.temperatures.includes('iced'))
  const coolEffect = result.item.kind === 'drink' && result.item.temperatures.includes('iced')
  const sparkleFrames = coolEffect ? [coolSparkle, coolSparkle, coolSparkle] : [sparkle01, sparkle02, sparkle03]

  function lockForTransition() {
    actionLock.current = true
    setBusy(true)
    // If a very small candidate pool cannot reroll, restore controls on this result.
    unlockTimer.current = window.setTimeout(() => { actionLock.current = false; setBusy(false) }, 1200)
  }

  function confirm() {
    if (!ready || actionLock.current || accepted) return
    actionLock.current = true
    setConfirmBurst(true)
    onAccept()
  }

  function reroll() {
    if (!ready || actionLock.current) return
    lockForTransition()
    onReroll()
  }

  function reject(reason: RejectReason) {
    if (!ready || actionLock.current) return
    setModal(false)
    lockForTransition()
    onReject(reason)
  }

  return <main className={`page result-page result-page--serving ${quickReveal ? 'is-quick' : ''} ${confirmBurst ? 'is-confirmed' : ''} ${reduced ? 'is-reduced' : ''}`}>
    <div className="result-intro">
      <span className="eyebrow">PIXEL CAFE / 今日上菜</span>
      <h1>今天{verb}什么</h1>
      <p>今天这份幸运，刚刚出炉。</p>
    </div>
    <PixelCard className="result-card result-menu-card">
      <div className="result-menu-card__top">
        <img src={sparkle02} className="pixel-sprite" alt="" />
        <strong>小食堂 · 今日推荐</strong>
        <span>{accepted ? '已选定' : '刚出炉'}</span>
      </div>
      <div className={`result-menu-card__stage ${coolEffect ? 'is-cool' : warmEffect ? 'is-warm' : 'is-food'}`} aria-hidden="true">
        <div className="result-menu-card__stage-edge" />
        <img src={servingTray} className="result-menu-card__tray pixel-sprite" alt="" />
        <div className="result-menu-card__icon">
          <img src={icon} className="result-menu-card__sprite pixel-sprite" alt="" />
        </div>
        {warmEffect && <div className="result-menu-card__steam">
          <span className="result-menu-card__steam-wisp result-menu-card__steam-wisp--left" style={{ backgroundImage: `url(${steamSheet})` }} />
          <span className="result-menu-card__steam-wisp result-menu-card__steam-wisp--right" style={{ backgroundImage: `url(${steamSheet})` }} />
        </div>}
        {sparkleFrames.map((src, index) => <img key={index} src={src} className={`result-menu-card__sparkle result-menu-card__sparkle--${index + 1} pixel-sprite`} alt="" />)}
      </div>
      <div className="result-menu-card__copy">
        <span className="result-menu-card__eyebrow">{kind === 'food' ? 'TODAY’S FOOD' : 'TODAY’S DRINK'}</span>
        <h2>{result.item.name}</h2>
        <p>{accepted ? '好耶！今天就和它约会吧。' : result.item.line}</p>
      </div>
      <div className="result-menu-card__tags">{tags.map((tag, index) => <span key={index}>{tag}</span>)}</div>
      <p className="result-menu-card__hint">{result.hint}</p>
      <div className="result-menu-card__reason"><span>食运精灵说</span><p>{result.reason}</p></div>
      <button className={`favorite-toggle result-menu-card__favorite ${favorite ? 'is-favorite' : ''}`} onClick={() => { setFavoritePulse(pulse => pulse + 1); onFavorite() }} disabled={!ready || busy} type="button" aria-pressed={favorite}>
        <span key={favoritePulse} className={favoritePulse ? 'result-menu-card__favorite-star is-pulsing' : 'result-menu-card__favorite-star'}>{favorite ? '★' : '☆'}</span> {favorite ? '已放进收藏' : '放进收藏夹'}
      </button>
    </PixelCard>
    <div className="result-actions" aria-busy={!ready || busy}>
      {confirmBurst && <span className="result-actions__confirm-burst" aria-hidden="true"><img src={sparkle02} className="pixel-sprite" alt="" /> ♡</span>}
      {accepted ? <>
        <PixelButton size="large" whileTap={{ y: 2, scale: 1 }} onClick={onHome} disabled={!ready} className="full-width">{fortuneMode ? '返回今日食签 ↗' : '返回小食堂 ↗'}</PixelButton>
        <p className="action-hint">已记入最近吃喝，祝你今天胃口好 ♡</p>
      </> : <>
        <PixelButton size="large" whileTap={{ y: 2, scale: 1 }} onClick={confirm} disabled={!ready || busy} className="full-width">就{verb}这个！ ↗</PixelButton>
        {fortuneMode
          ? <PixelButton tone="cream" whileTap={{ y: 2, scale: 1 }} onClick={onHome} disabled={!ready || busy} className="full-width fortune-result-back">返回今日食签</PixelButton>
          : <div className="result-secondary">
            <PixelButton tone="cream" whileTap={{ y: 2, scale: 1 }} onClick={reroll} disabled={!ready || busy}>↻ 换一个</PixelButton>
            <PixelButton tone="cream" whileTap={{ y: 2, scale: 1 }} onClick={() => setModal(true)} disabled={!ready || busy}>不想{verb}这个</PixelButton>
          </div>}
      </>}
    </div>
    <AnimatePresence>{modal && <PixelModal title={`为什么不想${verb}？`} onClose={() => setModal(false)}><p className="modal-copy">告诉食运精灵，下次会更懂你。</p><div className="modal-options"><button onClick={() => reject('today')}>今天不想 <span>→</span></button><button onClick={() => reject('always')}>一直都不喜欢 <span>→</span></button><button onClick={() => reject('recent')}>最近刚{verb}过 <span>→</span></button></div></PixelModal>}</AnimatePresence>
  </main>
}
