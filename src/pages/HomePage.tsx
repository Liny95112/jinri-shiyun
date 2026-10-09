import { PixelScene } from '../components/PixelScene'
import { PixelButton, PixelCard } from '../components/PixelUI'
import { APP_VERSION } from '../config'
import { getHomePeriodCopy } from '../lib/recommend'
import type { Kind } from '../types'
import sparkle from '../assets/pixel/fx/sparkle_02.png'
import fortuneBadge from '../assets/pixel/fortune/fortune_badge.png'
import foodIcon from '../assets/pixel/home/home_food_icon.png'
import drinkIcon from '../assets/pixel/home/home_drink_icon.png'
import heartIcon from '../assets/pixel/home/icon_heart.png'
import historyIcon from '../assets/pixel/home/icon_history.png'
import favoriteIcon from '../assets/pixel/home/icon_favorite.png'
import dexIcon from '../assets/pixel/home/icon_dex.png'

export function HomePage({ onPick, onNavigate, onFortune }: { onPick: (kind: Kind) => void; onNavigate: (page: 'preferences' | 'history' | 'favorites' | 'dex') => void; onFortune: () => void }) {
  return <main className="page home-page">
    <div className="home-heading"><div className="eyebrow"><span className="dot" /> {getHomePeriodCopy()}</div><h1>今日食运<img src={sparkle} className="home-title-spark pixel-sprite" alt="" /></h1><p>今天别纠结啦，我帮你选。</p></div>
    <div className="scene-wrap"><PixelScene /></div>
    <div className="choice-label"><span>今天的冒险从这里开始</span><span>↘</span></div>
    <div className="choice-stack grid">
      <PixelButton size="large" whileTap={{ y: 2 }} onClick={() => onPick('food')} className="home-choice home-choice--food"><span className="choice-icon"><img src={foodIcon} className="pixel-sprite" alt="" /></span><span><strong>今天吃什么</strong><small>好好吃饭，快乐加一</small></span><span className="choice-arrow">›</span></PixelButton>
      <PixelButton tone="mint" size="large" whileTap={{ y: 2 }} onClick={() => onPick('drink')} className="home-choice home-choice--drink"><span className="choice-icon"><img src={drinkIcon} className="pixel-sprite" alt="" /></span><span><strong>今天喝什么</strong><small>给今天来点甜甜能量</small></span><span className="choice-arrow">›</span></PixelButton>
    </div>
    <button className="fortune-home-entry" type="button" onClick={onFortune}><span className="fortune-entry-icon"><img src={fortuneBadge} className="pixel-sprite" alt="" /></span><span><strong>今日食签</strong><small>看看今天吃什么最走运</small></span><img src={sparkle} className="fortune-entry-spark pixel-sprite" alt="" /></button>
    <PixelCard className="home-shortcuts"><span className="shortcuts-title">我的小背包</span><div className="shortcuts-grid"><button type="button" onClick={() => onNavigate('preferences')}><img src={heartIcon} className="shortcut-icon pixel-sprite" alt="" />我的喜好</button><button type="button" onClick={() => onNavigate('history')}><img src={historyIcon} className="shortcut-icon pixel-sprite" alt="" />最近吃喝</button><button type="button" onClick={() => onNavigate('favorites')}><img src={favoriteIcon} className="shortcut-icon pixel-sprite" alt="" />收藏结果</button></div></PixelCard>
    <button className="dex-home-entry" type="button" onClick={() => onNavigate('dex')}><img src={dexIcon} className="dex-entry-icon pixel-sprite" alt="" /><strong>美食图鉴</strong><small>翻翻收录的美味</small><span aria-hidden="true">›</span></button>
    <p className="home-footer">今天也要好好照顾自己呀</p>
    <small className="home-version">v{APP_VERSION}</small>
  </main>
}
