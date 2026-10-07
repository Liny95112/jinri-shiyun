import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { PixelButton, PixelCard } from '../components/PixelUI'
import { fortuneCaption } from '../lib/dailyFortune'
import type { DailyFortune, DrinkItem, FoodItem, Kind } from '../types'
import jarIdle from '../assets/pixel/fortune/fortune_jar_idle.png'
import jarShake01 from '../assets/pixel/fortune/fortune_jar_shake_01.png'
import jarShake02 from '../assets/pixel/fortune/fortune_jar_shake_02.png'
import jarShake03 from '../assets/pixel/fortune/fortune_jar_shake_03.png'
import fortunePaper from '../assets/pixel/fortune/fortune_paper.png'
import fortuneBadge from '../assets/pixel/fortune/fortune_badge.png'
import sparkle01 from '../assets/pixel/fx/sparkle_01.png'
import sparkle02 from '../assets/pixel/fx/sparkle_02.png'
import sparkle03 from '../assets/pixel/fx/sparkle_03.png'
import ramenIcon from '../assets/pixel/food/food_ramen.png'
import sushiIcon from '../assets/pixel/food/food_sushi.png'
import milkTeaIcon from '../assets/pixel/drink/drink_milk_tea.png'
import coffeeIcon from '../assets/pixel/drink/drink_coffee.png'

type Phase = 'ready' | 'drawing' | 'revealed'
const jarFrames = [jarIdle, jarShake01, jarShake02, jarShake03]
const sparkleFrames = [sparkle01, sparkle02, sparkle03]

/** The four pilot icons are intentionally limited; other catalog names stay readable. */
function pilotIcon(item?: FoodItem | DrinkItem) {
  if (!item) return null
  if (item.kind === 'food') {
    if (item.name.includes('拉面')) return ramenIcon
    if (item.name.includes('寿司')) return sushiIcon
    return null
  }
  if (item.category === 'milk-tea') return milkTeaIcon
  if (item.category === 'coffee') return coffeeIcon
  return null
}

export function DailyFortunePage({ fortune, food, drink, onDraw, onChoose }: {
  fortune: DailyFortune | null
  food?: FoodItem
  drink?: DrinkItem
  onDraw: () => 'created' | 'existing' | 'unavailable'
  onChoose: (kind: Kind) => void
}) {
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(fortune ? 'revealed' : 'ready')
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (phase !== 'drawing') return
    if (reducedMotion) {
      const timer = window.setTimeout(() => setPhase('revealed'), 80)
      return () => window.clearTimeout(timer)
    }
    // Three hand-drawn poses repeat three times; the slip emerges near the end.
    let step = 0
    const frames = window.setInterval(() => {
      step += 1
      setFrame(step <= 9 ? ((step - 1) % 3) + 1 : 0)
      if (step >= 10) window.clearInterval(frames)
    }, 170)
    const reveal = window.setTimeout(() => setPhase('revealed'), 2200)
    return () => { window.clearInterval(frames); window.clearTimeout(reveal) }
  }, [phase, reducedMotion])

  function draw() {
    if (phase !== 'ready') return
    const result = onDraw()
    if (result !== 'unavailable') setPhase(result === 'created' ? 'drawing' : 'revealed')
  }

  const foodIcon = pilotIcon(food)
  const drinkIcon = pilotIcon(drink)

  return <main className="page fortune-page">
    <div className="page-intro fortune-intro">
      <div className="eyebrow">DAILY LUCK / 一天一签</div>
      <h1><img src={fortuneBadge} alt="" className="fortune-heading-emblem pixel-sprite" />今日食签</h1>
      <p>{phase === 'ready' ? '今天的胃，会被什么选中呢？' : '把今天的小小食运，收进口袋里。'}</p>
    </div>

    {phase !== 'revealed' && <div className="fortune-draw-scene" aria-live="polite">
      <div className="fortune-scene-art" aria-hidden="true">
        <img src={sparkleFrames[frame % 3]} className="fortune-scene-sparkle fortune-scene-sparkle--left pixel-sprite" alt="" />
        <img src={sparkleFrames[(frame + 1) % 3]} className="fortune-scene-sparkle fortune-scene-sparkle--right pixel-sprite" alt="" />
        {phase === 'drawing' && <img src={fortunePaper} className="fortune-paper-pop pixel-sprite" alt="" />}
        <img src={jarFrames[frame]} className="fortune-jar-sprite pixel-sprite" alt="" />
      </div>
      <strong>{phase === 'drawing' ? '食运正在揭晓…' : '食运精灵已经准备好啦'}</strong>
      <p>{phase === 'drawing' ? '摇一摇，今天的美味就要出现啦。' : '每天只有一张，抽出后会为你保存到明天。'}</p>
      {phase === 'ready' && <PixelButton size="large" whileTap={{ y: 2 }} onClick={draw} className="fortune-draw-button">抽一签</PixelButton>}
    </div>}

    {phase === 'revealed' && fortune && <div className="fortune-reveal" aria-live="polite">
      <PixelCard className="fortune-card">
        <div className="fortune-card__top"><span>今日食运 · DAILY LUCK</span><span>NO. {fortune.date.replaceAll('-', '')}</span></div>
        <div className="fortune-card__hero">
          <img src={fortunePaper} className="fortune-card__paper pixel-sprite" alt="" />
          <div className="fortune-card__verdict">
            <span className="fortune-card__eyebrow">今日签运</span>
            <strong className="fortune-card__level">{fortune.fortuneLevel}</strong>
            <small>{fortuneCaption(fortune.fortuneLevel)}</small>
          </div>
          <img src={fortuneBadge} className="fortune-card__badge pixel-sprite" alt="" />
        </div>
        <div className="fortune-card__rule" aria-hidden="true"><img src={sparkle02} className="pixel-sprite" alt="" /></div>
        <div className="fortune-card__label">今日宜</div>
        <div className="fortune-tips">{fortune.luckyTags.map(tip => <span key={tip}>{tip}</span>)}</div>
        <div className="fortune-luck-row"><span className="fortune-luck-row__label">幸运食物</span><strong><img src={foodIcon ?? sparkle01} className={foodIcon ? 'fortune-item-sprite pixel-sprite' : 'fortune-item-mark pixel-sprite'} alt="" />{food?.name ?? '菜单待补充'}</strong></div>
        <div className="fortune-luck-row"><span className="fortune-luck-row__label">幸运饮品</span><strong><img src={drinkIcon ?? sparkle01} className={drinkIcon ? 'fortune-item-sprite pixel-sprite' : 'fortune-item-mark pixel-sprite'} alt="" />{drink?.name ?? '菜单待补充'}</strong></div>
        <div className="fortune-luck-row"><span className="fortune-luck-row__label">幸运口味</span><strong>{fortune.luckyTaste}</strong></div>
        <div className="fortune-card__message"><span>今日食语</span><p>“{fortune.message}”</p></div>
        <div className="fortune-card__date">{fortune.date.replaceAll('-', '.')} · 今日食签已领取 ✓</div>
      </PixelCard>
      <div className="fortune-actions">
        <PixelButton size="large" whileTap={{ y: 2 }} className="full-width" disabled={!food || fortune.acceptedFood} onClick={() => onChoose('food')}>{fortune.acceptedFood ? '已记入最近吃喝 ✓' : '就吃这个 ↗'}</PixelButton>
        <PixelButton tone="mint" size="large" whileTap={{ y: 2 }} className="full-width" disabled={!drink || fortune.acceptedDrink} onClick={() => onChoose('drink')}>{fortune.acceptedDrink ? '已记入最近吃喝 ✓' : '就喝这个 ↗'}</PixelButton>
      </div>
      <p className="fortune-tomorrow">这张食签会陪你一整天。明天再来看看新的食运吧 ♡</p>
    </div>}
  </main>
}
