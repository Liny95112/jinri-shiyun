import { useLayoutEffect } from 'react'
import { PixelCard } from '../components/PixelUI'
import { APP_VERSION } from '../config'
import { UPDATE_LOG } from '../data/updateLog'

export function UpdateLogPage() {
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }, [])

  return <main className="page update-log-page">
    <div className="page-intro"><div className="eyebrow">PIXEL CAFE / UPDATE NOTES</div><h1>📢 更新公告</h1><p>今日食运一直在慢慢变好。每次变化，都写在这里。</p></div>
    <div className="update-log-list">{UPDATE_LOG.map(entry => <PixelCard key={entry.version} className={`update-log-card ${entry.version === APP_VERSION ? 'is-current' : ''}`}>
      <div className="update-log-card__meta"><span>✦ VERSION NOTE</span><time dateTime={entry.date}>{entry.date}</time></div>
      <h2>v{entry.version}{entry.version === APP_VERSION && <span>当前版本</span>}</h2>
      {entry.sections.map(section => <section key={section.title} className="update-log-section"><h3>{section.title}</h3><ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}
    </PixelCard>)}</div>
    <p className="update-log-footer">✦ 谢谢你陪好运小食堂慢慢长大 ✦</p>
  </main>
}
