import { motion } from 'framer-motion'
import { PixelScene } from '../components/PixelScene'
import { PixelButton, PixelCard } from '../components/PixelUI'
import { APP_VERSION } from '../config'
import { getHomePeriodCopy } from '../lib/recommend'
import type { Kind } from '../types'

export function HomePage({ onPick, onNavigate, onFortune, hasNewUpdate }: { onPick: (kind: Kind) => void; onNavigate: (page: 'preferences' | 'history' | 'favorites' | 'dex' | 'updates') => void; onFortune: () => void; hasNewUpdate: boolean }) {
  return <main className="page home-page">
    <div className="home-heading"><div className="eyebrow"><span className="dot" /> {getHomePeriodCopy()}</div><h1>今日食运<span className="title-spark">✦</span></h1><p>今天别纠结啦，我帮你选。</p></div>
    <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .45 }} className="scene-wrap"><PixelScene /><div className="scene-caption">♡ 欢迎光临好运小食堂 ♡</div></motion.div>
    <div className="choice-label"><span>今天的冒险从这里开始</span><span>↘</span></div>
    <div className="choice-stack grid">
      <PixelButton size="large" onClick={() => onPick('food')} className="home-choice"><span className="choice-icon">🍚</span><span><strong>今天吃什么</strong><small>好好吃饭，快乐加一</small></span><span className="choice-arrow">›</span></PixelButton>
      <PixelButton tone="mint" size="large" onClick={() => onPick('drink')} className="home-choice"><span className="choice-icon">🧋</span><span><strong>今天喝什么</strong><small>给今天来点甜甜能量</small></span><span className="choice-arrow">›</span></PixelButton>
    </div>
    <button className="fortune-home-entry" type="button" onClick={onFortune}><span aria-hidden="true">🎴</span><span><strong>今日食签</strong><small>看看今天吃什么最走运</small></span><span aria-hidden="true">✦</span></button>
    <PixelCard className="home-shortcuts"><span className="shortcuts-title">我的小背包</span><div className="shortcuts-grid"><button onClick={() => onNavigate('preferences')}><span>💗</span>我的喜好</button><button onClick={() => onNavigate('history')}><span>🕒</span>最近吃喝</button><button onClick={() => onNavigate('favorites')}><span>⭐</span>收藏结果</button></div></PixelCard>
    <button className="dex-home-entry" type="button" onClick={() => onNavigate('dex')}><span aria-hidden="true">📖</span><strong>美食图鉴</strong><small>翻翻收录的美味</small><span aria-hidden="true">›</span></button>
    <button className="updates-home-entry" type="button" onClick={() => onNavigate('updates')}><span aria-hidden="true">📢</span><strong>更新公告</strong><small className={hasNewUpdate ? 'is-new' : ''}>{hasNewUpdate ? 'NEW' : `v${APP_VERSION}`}</small><span aria-hidden="true">›</span></button>
    <p className="home-footer">✦ 今天也要好好照顾自己呀 ✦</p>
    <small className="block text-center text-[10px] text-[#a77b65]">v{APP_VERSION}</small>
  </main>
}
