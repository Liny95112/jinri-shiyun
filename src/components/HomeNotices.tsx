import { AnimatePresence } from 'framer-motion'
import { PixelButton, PixelModal } from './PixelUI'
import { APP_VERSION } from '../config'
import { UPDATE_LOG } from '../data/updateLog'

export type HomeNotice = 'update' | 'fortune' | null

export function HomeNotices({ notice, onClose, onOpenFortune }: {
  notice: HomeNotice
  onClose: () => void
  onOpenFortune: () => void
}) {
  const latest = UPDATE_LOG.find(entry => entry.version === APP_VERSION)
  return <AnimatePresence mode="wait">
    {notice === 'update' && <PixelModal key="update" title="✨ 今日食运更新啦" onClose={onClose}>
      <div className="home-notice"><div className="home-notice__icon" aria-hidden="true">✦</div><strong>v{APP_VERSION}</strong><p>好运小食堂又有新变化啦。</p>
        <div className="home-notice__highlights"><span>这次更新</span><ul>{latest?.sections.flatMap(section => section.items).map(item => <li key={item}>{item}</li>)}</ul></div>
        <div className="home-notice__actions"><PixelButton className="full-width" onClick={onClose}>知道啦</PixelButton></div>
      </div>
    </PixelModal>}
    {notice === 'fortune' && <PixelModal key="fortune" title="🎴 新的一天到啦" onClose={onClose}>
      <div className="home-notice"><div className="home-notice__icon" aria-hidden="true">🎴</div><strong>今天的食签还没抽哦</strong><p>看看今天吃什么最走运？</p>
        <div className="home-notice__actions"><PixelButton className="full-width" onClick={onOpenFortune}>去抽一签</PixelButton><PixelButton tone="cream" className="full-width" onClick={onClose}>稍后再说</PixelButton></div>
      </div>
    </PixelModal>}
  </AnimatePresence>
}
