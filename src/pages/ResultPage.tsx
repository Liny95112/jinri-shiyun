import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PixelButton, PixelCard, PixelModal } from '../components/PixelUI'
import type { Kind, PickResult } from '../types'

export type RejectReason = 'today' | 'always' | 'recent'

export function ResultPage({ kind, result, favorite, accepted, onAccept, onReroll, onReject, onFavorite, onHome }: {
  kind: Kind; result: PickResult; favorite: boolean; accepted: boolean;
  onAccept: () => void; onReroll: () => void; onReject: (reason: RejectReason) => void; onFavorite: () => void; onHome: () => void
}) {
  const [modal, setModal] = useState(false)
  const verb = kind === 'food' ? '吃' : '喝'
  return <main className="page result-page"><div className="eyebrow">QUEST CLEAR / 命运已揭晓</div><motion.div initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: .45, duration: .65 }} className="result-heading"><span>✦</span><h1>{accepted ? '决定好啦！' : '今日推荐'}</h1><span>✦</span></motion.div>
    <PixelCard className="result-card"><span className="result-sticker">TODAY'S PICK</span><div className="result-spark result-spark--a">✦</div><div className="result-spark result-spark--b">✧</div><motion.div initial={{ rotate: -7, scale: .8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', bounce: .5 }} className="result-icon">{result.item.icon}</motion.div><div className="result-category">{kind === 'food' ? '🍽 今日美味' : '🥤 今日快乐水'}</div><h2>{result.item.name}</h2><p className="result-line">“{accepted ? '好耶！今天就和它约会吧。' : result.item.line}”</p><div className="reason-box"><span>✿ 食运精灵说</span><p>{result.reason}</p></div><button className={`favorite-toggle ${favorite ? 'is-favorite' : ''}`} onClick={onFavorite} type="button" aria-pressed={favorite}>{favorite ? '★ 已放进收藏' : '☆ 放进收藏夹'}</button></PixelCard>
    <div className="result-actions">{accepted ? <><PixelButton size="large" onClick={onHome} className="full-width">返回小食堂 ↗</PixelButton><p className="action-hint">已记入最近吃喝，祝你今天胃口好 ♡</p></> : <><PixelButton size="large" onClick={onAccept} className="full-width">就{verb}这个！ ↗</PixelButton><div className="result-secondary"><PixelButton tone="cream" onClick={onReroll}>↻ 换一个</PixelButton><PixelButton tone="cream" onClick={() => setModal(true)}>不想{verb}这个</PixelButton></div></>}</div>
    <AnimatePresence>{modal && <PixelModal title={`为什么不想${verb}？`} onClose={() => setModal(false)}><p className="modal-copy">告诉食运精灵，下次会更懂你。</p><div className="modal-options"><button onClick={() => { setModal(false); onReject('today') }}>今天不想 <span>→</span></button><button onClick={() => { setModal(false); onReject('always') }}>一直都不喜欢 <span>→</span></button><button onClick={() => { setModal(false); onReject('recent') }}>最近刚{verb}过 <span>→</span></button></div></PixelModal>}</AnimatePresence>
  </main>
}
