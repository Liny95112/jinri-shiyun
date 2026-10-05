import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type ButtonProps = HTMLMotionProps<'button'> & {
  tone?: 'coral' | 'mint' | 'cream' | 'brown'
  size?: 'normal' | 'large'
  children: ReactNode
}

export function PixelButton({ tone = 'coral', size = 'normal', className = '', children, ...props }: ButtonProps) {
  return <motion.button whileTap={{ y: 3, scale: .985 }} transition={{ duration: .12 }} className={`pixel-button pixel-button--${tone} pixel-button--${size} ${className}`} {...props}>{children}</motion.button>
}

export function PixelCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`pixel-card ${className}`}>{children}</div>
}

export function FilterChip({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return <motion.button type="button" whileTap={{ scale: .94 }} onClick={onClick} aria-pressed={selected} className={`filter-chip ${selected ? 'is-selected' : ''}`}>{children}</motion.button>
}

export function SectionTitle({ number, title, hint }: { number: string; title: string; hint?: string }) {
  return <div className="section-title"><span className="section-title__number">{number}</span><div><h2>{title}</h2>{hint && <p>{hint}</p>}</div></div>
}

export function EmptyState({ icon, title, text }: { icon: string; title: string; text: string }) {
  return <div className="empty-state"><span className="empty-state__icon">{icon}</span><strong>{title}</strong><p>{text}</p></div>
}

export function PixelModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose} role="presentation"><motion.div initial={{ y: 30, scale: .92, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pixel-modal" role="dialog" aria-modal="true" aria-label={title} onClick={event => event.stopPropagation()}><div className="modal-header"><strong>{title}</strong><button type="button" onClick={onClose} aria-label="关闭弹窗">✕</button></div>{children}</motion.div></div>
}
