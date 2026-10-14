import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { drinks, foods } from '../data/items'
import type { Item, Kind, PickResult } from '../types'
import machine from '../assets/pixel/machine/food_three_reel_machine.png'
import leverIdle from '../assets/pixel/machine/machine_lever_idle.png'
import leverPull from '../assets/pixel/machine/machine_lever_pull.png'
import leverReturn from '../assets/pixel/machine/machine_lever_return.png'
import light01 from '../assets/pixel/machine/machine_light_01.png'
import light02 from '../assets/pixel/machine/machine_light_02.png'
import genericFood from '../assets/pixel/home/home_food_icon.png'
import genericDrink from '../assets/pixel/home/home_drink_icon.png'
import ramen from '../assets/pixel/food/food_ramen.png'
import sushi from '../assets/pixel/food/food_sushi.png'
import tonkotsu from '../assets/pixel/food/food_tonkotsu_ramen.png'
import milkTea from '../assets/pixel/drink/drink_milk_tea.png'
import coffee from '../assets/pixel/drink/drink_coffee.png'
import sparkle01 from '../assets/pixel/fx/sparkle_01.png'
import sparkle02 from '../assets/pixel/fx/sparkle_02.png'
import sparkle03 from '../assets/pixel/fx/sparkle_03.png'
import './rolling-machine.css'

type RollingProps = { kind: Kind; result: PickResult; onComplete: () => void; options?: Item[]; servingReveal?: boolean; quick?: boolean }
type MachinePhase = 'idle' | 'pull' | 'return' | 'spin' | 'slowing' | 'stopped'

function displayIcon(item: Item): string {
  if (item.id === 'tonkotsu-ramen') return tonkotsu
  if (item.kind === 'food') {
    if (item.name.includes('拉面')) return ramen
    if (item.name.includes('寿司')) return sushi
    return genericFood
  }
  if (item.category === 'milk-tea') return milkTea
  if (item.category === 'coffee') return coffee
  return genericDrink
}

function ReelWindow({ index, icons, winner, spinning, stopped, quick }: {
  index: number; icons: string[]; winner: string; spinning: boolean; stopped: boolean; quick: boolean
}) {
  // Two copies make one full loop seamless. The center cell is the selected menu row.
  const cycle = Array.from({ length: icons.length * 2 + 2 }, (_, i) => icons[(i + index) % icons.length])
  const finalCells = [icons[(index + 1) % icons.length], stopped ? winner : icons[index % icons.length], icons[(index + 2) % icons.length]]
  return <div className={`machine-reel machine-reel--${index + 1}${stopped ? ' machine-reel--stopped' : ''}`} data-reel={index + 1} data-stopped={stopped}>
    <div className={`machine-reel__strip${spinning && !stopped ? ' machine-reel__strip--spinning' : ''}`} style={{ '--reel-distance': `${icons.length * 44}px`, '--reel-steps': icons.length * 4, '--reel-speed': quick ? '220ms' : '310ms' } as CSSProperties}>
      {(spinning && !stopped ? cycle : finalCells).map((icon, cell) => <span className="machine-reel__cell" key={cell}><img src={icon} alt="" draggable={false} /></span>)}
    </div>
  </div>
}

function MachineRollingPage({ kind, result, onComplete, quick = false }: RollingProps) {
  const reelIcons = kind === 'food' ? [ramen, sushi, tonkotsu, genericFood] : [milkTea, coffee, genericDrink]
  const winner = displayIcon(result.item)
  const [phase, setPhase] = useState<MachinePhase>('idle')
  const [stoppedCount, setStoppedCount] = useState(0)
  const [light, setLight] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [sparkleFrame, setSparkleFrame] = useState(0)
  const started = useRef(false)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete
  const prefersReducedMotion = useReducedMotion()
  const reduced = Boolean(prefersReducedMotion) || window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function pullLever() {
    if (started.current) return
    started.current = true
    if (reduced) { setStoppedCount(3); setPhase('stopped') }
    else setPhase('pull')
  }

  // The ResultPage reroll click already expresses intent, so its short reel starts automatically.
  useEffect(() => { if (quick) pullLever() }, [quick])

  useEffect(() => {
    if (!started.current) return
    const stopTimes = quick ? [210, 285, 360] : [760, 940, 1100]
    const finishAt = reduced ? 150 : quick ? 690 : 1500
    const pullUntil = quick ? 70 : 160
    let frame = 0
    let clock = 0
    let previous = 0
    let lastStopped = -1
    let lastLamp = -1
    let lastPhase: MachinePhase = reduced ? 'stopped' : 'pull'
    let finished = false
    const tick = (time: number) => {
      if (!previous) previous = time
      clock += time - previous
      previous = time
      if (clock >= finishAt) {
        if (!finished) { finished = true; completeRef.current() }
        return
      }
      if (!reduced) {
        const nextStopped = stopTimes.filter(at => clock >= at).length
        if (nextStopped !== lastStopped) { lastStopped = nextStopped; setStoppedCount(nextStopped) }
        const nextPhase: MachinePhase = clock < pullUntil * .55 ? 'pull' : clock < pullUntil ? 'return' : clock < stopTimes[0] - (quick ? 100 : 250) ? 'spin' : nextStopped < 3 ? 'slowing' : 'stopped'
        if (nextPhase !== lastPhase) { lastPhase = nextPhase; setPhase(nextPhase) }
        const lampStep = nextStopped === 3 ? Number(clock - stopTimes[2] < 180) : Math.floor(clock / 180) % 2
        if (lampStep !== lastLamp) { lastLamp = lampStep; setLight(Boolean(lampStep)) }
        if (nextStopped === 3) setSparkleFrame(Math.floor((clock - stopTimes[2]) / 65) % 3)
      }
      frame = window.requestAnimationFrame(tick)
    }
    const onVisibility = () => {
      if (document.hidden) { window.cancelAnimationFrame(frame); previous = 0; setHidden(true) }
      else { setHidden(false); frame = window.requestAnimationFrame(tick) }
    }
    document.addEventListener('visibilitychange', onVisibility)
    if (!document.hidden) frame = window.requestAnimationFrame(tick)
    return () => { window.cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', onVisibility) }
  }, [phase === 'idle', quick, reduced, result.item])

  const lever = phase === 'pull' ? leverPull : phase === 'return' ? leverReturn : leverIdle
  const spinning = phase === 'pull' || phase === 'return' || phase === 'spin' || phase === 'slowing'
  const message = phase === 'idle' ? `拉一下，看看今天${kind === 'food' ? '吃' : '喝'}什么` : stoppedCount === 3 ? '今日菜单已决定' : '三个滚轮正在翻菜单…'
  return <main className="page rolling-page rolling-page--machine">
    <div className="eyebrow">QUEST 02 / 好运小食堂</div>
    <h1>今日点单机</h1>
    <p className="machine-intro">轻轻一拉，决定今天{kind === 'food' ? '吃' : '喝'}什么。</p>
    <div className={`machine-stage machine-stage--${phase}${hidden ? ' machine-stage--paused' : ''}${stoppedCount === 3 ? ' machine-stage--hit' : ''}`}>
      <img className="machine-body" src={machine} alt="木质像素三栏幸运机" draggable={false} />
      <span className="machine-sign" aria-hidden="true">今日食运</span>
      <div className="machine-reels" role="img" aria-label={stoppedCount === 3 ? `三个滚轮均停在${result.item.name}` : '三个像素滚轮'}>
        {[0, 1, 2].map(index => <ReelWindow key={index} index={index} icons={reelIcons} winner={winner} spinning={spinning} stopped={index < stoppedCount} quick={quick} />)}
      </div>
      <div className="machine-menu-corners" aria-hidden="true" />
      <img className="machine-light machine-light--left" src={light ? light02 : light01} alt="" draggable={false} />
      <img className="machine-light machine-light--right" src={light ? light02 : light01} alt="" draggable={false} />
      <button className="machine-lever" type="button" onClick={pullLever} disabled={phase !== 'idle'} aria-label="拉一下幸运推荐机拉杆"><img src={lever} alt="" draggable={false} /></button>
      {stoppedCount === 3 && !reduced && <div className="machine-sparkles" aria-hidden="true"><img src={[sparkle01, sparkle02, sparkle03][sparkleFrame]} alt="" /><img src={sparkle02} alt="" /></div>}
    </div>
    <p className="machine-current" aria-live={stoppedCount === 3 ? 'polite' : 'off'}>{stoppedCount === 3 ? result.item.name : phase === 'idle' ? '今日好运待领取' : '小食堂正在选菜单…'}</p>
    <p className="machine-note">{message}</p>
    {phase === 'idle' && <button type="button" className="machine-pull-button" onClick={pullLever}>拉一下好运拉杆 ›</button>}
  </main>
}

function LegacyRollingPage({ kind, result, onComplete, options }: RollingProps) {
  const candidates: Item[] = options ?? (kind === 'food' ? foods : drinks)
  const [current, setCurrent] = useState<Item>(candidates[0] ?? result.item)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const duration = reducedMotion ? 100 : 2550
    let index = 0
    let revealTimeout: number | undefined
    const interval = window.setInterval(() => { index = (index + 7) % candidates.length; setCurrent(candidates[index]) }, reducedMotion ? 180 : 85)
    const timeout = window.setTimeout(() => { window.clearInterval(interval); setCurrent(result.item); revealTimeout = window.setTimeout(() => completeRef.current(), reducedMotion ? 50 : 270) }, duration)
    return () => { window.clearInterval(interval); window.clearTimeout(timeout); if (revealTimeout) window.clearTimeout(revealTimeout) }
  }, [candidates, reducedMotion, result.item])
  return <main className="page rolling-page"><div className="eyebrow">QUEST 02 / 命运转盘</div><h1>食运加载中<span className="loading-dots">...</span></h1><p>叮叮咚咚，正在替你挑选好心情</p>
    <div className="slot-machine"><div className="slot-top">✦ 今日食运抽取机 ✦</div><div className="slot-window"><div className="slot-fade slot-fade--top" /><motion.div key={current.id} initial={{ y: -22, opacity: .3, scale: .88 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: .09 }} className="slot-item"><span>{current.icon}</span><strong>{current.name}</strong></motion.div><div className="slot-fade slot-fade--bottom" /></div><div className="slot-footer">♥　♥　♥</div></div>
    <div className="rolling-progress"><div className="rolling-progress__bar" /></div><p className="rolling-note">请稍等，命运正在翻菜单…</p>
  </main>
}

export function RollingPage(props: RollingProps) {
  return props.servingReveal ? <MachineRollingPage {...props} /> : <LegacyRollingPage {...props} />
}
