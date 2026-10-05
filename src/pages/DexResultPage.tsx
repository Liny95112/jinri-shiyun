import { motion } from 'framer-motion'
import { PixelButton, PixelCard } from '../components/PixelUI'
import type { Item } from '../types'

export function DexResultPage({ item, accepted, onAccept, onReroll, onBack }: {
  item: Item
  accepted: boolean
  onAccept: () => void
  onReroll: () => void
  onBack: () => void
}) {
  return <main className="page result-page dex-result-page"><div className="eyebrow">DEX DRAW / 图鉴抽取成功</div><motion.div initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: .45, duration: .65 }} className="result-heading"><span>✦</span><h1>今日就选它！</h1><span>✦</span></motion.div>
    <PixelCard className="result-card"><span className="result-sticker">LUCKY PICK</span><div className="result-spark result-spark--a">✦</div><div className="result-spark result-spark--b">✧</div><motion.div initial={{ rotate: -7, scale: .8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', bounce: .5 }} className="result-icon">{item.icon}</motion.div><div className="result-category">{item.kind === 'food' ? '🍽 图鉴美食' : '🥤 图鉴饮品'}</div><h2>{item.name}</h2><p className="result-line">“{item.line}”</p><div className="reason-box"><span>✿ 食运精灵说</span><p>它是从你刚才筛出的选项里抽中的小惊喜。</p></div></PixelCard>
    <div className="result-actions"><PixelButton size="large" className="full-width" onClick={onAccept} disabled={accepted}>{accepted ? '已记入最近吃喝 ✓' : '就选这个 ✓'}</PixelButton><div className="result-secondary"><PixelButton tone="cream" onClick={onReroll}>↻ 再抽一次</PixelButton><PixelButton tone="cream" onClick={onBack}>返回图鉴</PixelButton></div>{accepted && <p className="action-hint">已记入最近吃喝，祝你今天胃口好 ♡</p>}</div>
  </main>
}
