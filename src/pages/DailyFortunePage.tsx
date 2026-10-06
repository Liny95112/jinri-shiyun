import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PixelButton, PixelCard } from '../components/PixelUI'
import { fortuneCaption } from '../lib/dailyFortune'
import type { DailyFortune, DrinkItem, FoodItem, Kind } from '../types'

type Phase = 'ready' | 'drawing' | 'revealed'

export function DailyFortunePage({ fortune, food, drink, onDraw, onChoose }: {
  fortune: DailyFortune | null
  food?: FoodItem
  drink?: DrinkItem
  onDraw: () => 'created' | 'existing' | 'unavailable'
  onChoose: (kind: Kind) => void
}) {
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(fortune ? 'revealed' : 'ready')

  useEffect(() => {
    if (phase !== 'drawing') return
    const timer = window.setTimeout(() => setPhase('revealed'), reducedMotion ? 80 : 2500)
    return () => window.clearTimeout(timer)
  }, [phase, reducedMotion])

  function draw() {
    if (phase !== 'ready') return
    const result = onDraw()
    if (result !== 'unavailable') setPhase(result === 'created' ? 'drawing' : 'revealed')
  }

  return <main className="page fortune-page">
    <div className="page-intro fortune-intro"><div className="eyebrow">DAILY LUCK / 一天一签</div><h1>🎴 今日食签</h1><p>{phase === 'ready' ? '今天的胃，会被什么选中呢？' : '把今天的小小食运，收进口袋里。'}</p></div>
    {phase !== 'revealed' && <div className="fortune-draw-scene" aria-live="polite">
      <div className="fortune-scene-stars" aria-hidden="true">✦ <span>✧</span> ✦</div>
      <motion.div className="fortune-tube" animate={phase === 'drawing' && !reducedMotion ? { rotate: [0, -8, 8, -6, 6, 0] } : { rotate: 0 }} transition={{ duration: 1.1, repeat: phase === 'drawing' && !reducedMotion ? 1 : 0 }} aria-hidden="true">
        <div className="fortune-tube__sticks">▥ ▥ ▥</div><div className="fortune-tube__body">食<br />运</div><div className="fortune-tube__base" />
      </motion.div>
      <AnimatePresence>{phase === 'drawing' && <motion.div className="fortune-flying-slip" initial={reducedMotion ? { opacity: 0 } : { y: 52, opacity: 0, rotate: -8 }} animate={reducedMotion ? { opacity: 1 } : { y: -70, opacity: 1, rotate: 5 }} transition={{ duration: reducedMotion ? .05 : .9, delay: reducedMotion ? 0 : .75 }} aria-hidden="true">吉</motion.div>}</AnimatePresence>
      <strong>{phase === 'drawing' ? '食运正在揭晓…' : '食运精灵已经准备好啦'}</strong>
      <p>{phase === 'drawing' ? '摇一摇，今天的美味就要出现啦。' : '每天只有一张，抽出后会为你保存到明天。'}</p>
      {phase === 'ready' && <PixelButton size="large" onClick={draw} className="fortune-draw-button">✦ 抽一签 ✦</PixelButton>}
    </div>}

    {phase === 'revealed' && fortune && <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reducedMotion ? 0 : .45 }} aria-live="polite">
      <PixelCard className="fortune-card">
        <div className="fortune-card__top"><span>✦ 今日食运 ✦</span><span>NO. {fortune.date.replaceAll('-', '')}</span></div>
        <div className="fortune-card__seal" aria-hidden="true">食<br />运</div>
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : .12 }} className="fortune-card__level">{fortune.fortuneLevel}<small> · {fortuneCaption(fortune.fortuneLevel)}</small></motion.div>
        <div className="fortune-card__divider" aria-hidden="true">✧ ✦ ✧</div>
        <div className="fortune-card__label">今日宜</div><div className="fortune-tips">{fortune.luckyTags.map(tip => <span key={tip}>{tip}</span>)}</div>
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : .25 }} className="fortune-luck-row"><span>🍽 幸运食物</span><strong>{food ? `${food.icon} ${food.name}` : '菜单待补充'}</strong></motion.div>
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : .4 }} className="fortune-luck-row"><span>🥤 幸运饮品</span><strong>{drink ? `${drink.icon} ${drink.name}` : '菜单待补充'}</strong></motion.div>
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : .52 }} className="fortune-luck-row"><span>✿ 幸运口味</span><strong>{fortune.luckyTaste}</strong></motion.div>
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : .68 }} className="fortune-card__message"><span>✎ 今日食语</span><p>“{fortune.message}”</p></motion.div>
        <div className="fortune-card__date">{fortune.date.replaceAll('-', '.')} · 今日食签已领取 ✓</div>
      </PixelCard>
      <div className="fortune-actions"><PixelButton size="large" className="full-width" disabled={!food || fortune.acceptedFood} onClick={() => onChoose('food')}>{fortune.acceptedFood ? '已记入最近吃喝 ✓' : '就吃这个 ↗'}</PixelButton><PixelButton tone="mint" size="large" className="full-width" disabled={!drink || fortune.acceptedDrink} onClick={() => onChoose('drink')}>{fortune.acceptedDrink ? '已记入最近吃喝 ✓' : '就喝这个 ↗'}</PixelButton></div>
      <p className="fortune-tomorrow">这张食签会陪你一整天。明天再来看看新的食运吧 ♡</p>
    </motion.div>}
  </main>
}
