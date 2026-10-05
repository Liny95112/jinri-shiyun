import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { drinks, foods } from '../data/items'
import type { Item, Kind, PickResult } from '../types'

export function RollingPage({ kind, result, onComplete, options }: { kind: Kind; result: PickResult; onComplete: () => void; options?: Item[] }) {
  const candidates: Item[] = options ?? (kind === 'food' ? foods : drinks)
  const [current, setCurrent] = useState<Item>(candidates[0] ?? result.item)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const duration = reducedMotion ? 500 : 2550
    let index = 0
    let revealTimeout: number | undefined
    const interval = window.setInterval(() => { index = (index + 7) % candidates.length; setCurrent(candidates[index]) }, reducedMotion ? 180 : 85)
    const timeout = window.setTimeout(() => { window.clearInterval(interval); setCurrent(result.item); revealTimeout = window.setTimeout(() => completeRef.current(), reducedMotion ? 150 : 270) }, duration)
    return () => { window.clearInterval(interval); window.clearTimeout(timeout); if (revealTimeout) window.clearTimeout(revealTimeout) }
  }, [candidates, reducedMotion, result.item])

  return <main className="page rolling-page"><div className="eyebrow">QUEST 02 / 命运转盘</div><h1>食运加载中<span className="loading-dots">...</span></h1><p>叮叮咚咚，正在替你挑选好心情</p>
    <div className="slot-machine"><div className="slot-top">✦ 今日食运抽取机 ✦</div><div className="slot-window"><div className="slot-fade slot-fade--top" /><motion.div key={current.id} initial={{ y: -22, opacity: .3, scale: .88 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: .09 }} className="slot-item"><span>{current.icon}</span><strong>{current.name}</strong></motion.div><div className="slot-fade slot-fade--bottom" /></div><div className="slot-footer">♥　♥　♥</div></div>
    <div className="rolling-progress"><div className="rolling-progress__bar" /></div><p className="rolling-note">请稍等，命运正在翻菜单…</p>
  </main>
}
