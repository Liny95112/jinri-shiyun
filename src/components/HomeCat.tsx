import { useEffect, useState } from 'react'

export type ShopTime = 'morning' | 'day' | 'night'
type Anchor = 0 | 1 | 2
type WalkFrame = 1 | 2 | 3 | 4
type CatPose = { x: number; anchor: Anchor; action: 'idle' | 'walk'; direction: 'left' | 'right'; frame: WalkFrame }

// Native 160x96 scene coordinates. The cat stays on the pavement and never leaves the frame.
const ANCHORS = [28, 75, 122] as const
const catSprites = import.meta.glob('../assets/pixel/home/cat/home_cat_*.png', {
  eager: true, query: '?url', import: 'default'
}) as Record<string, string>
const sprite = (name: string) => catSprites[`../assets/pixel/home/cat/${name}.png`]
const between = (min: number, max: number) => min + Math.random() * (max - min)

export function HomeCat({ time }: { time: ShopTime }) {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [pose, setPose] = useState<CatPose>({ x: ANCHORS[2], anchor: 2, action: 'idle', direction: 'left', frame: 1 })
  const [idleFrame, setIdleFrame] = useState<1 | 2>(1)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    // Both idle files are complete cats: show exactly one frame at a time.
    setIdleFrame(1)
    if (pose.action !== 'idle' || reducedMotion) return
    let timer: number
    const rest = () => {
      setIdleFrame(1)
      timer = window.setTimeout(liftTail, 1800)
    }
    const liftTail = () => {
      setIdleFrame(2)
      timer = window.setTimeout(rest, 450)
    }
    timer = window.setTimeout(liftTail, 1800)
    return () => window.clearTimeout(timer)
  }, [pose.action, reducedMotion])

  useEffect(() => {
    let timer: number | undefined
    let animationFrame: number | undefined
    let anchor: Anchor = 2
    let active = true
    setPose({ x: ANCHORS[2], anchor, action: 'idle', direction: 'left', frame: 1 })

    if (reducedMotion) return () => { active = false }

    const waitAt = (delay: number) => {
      if (!active) return
      timer = window.setTimeout(decide, delay)
    }
    const decide = () => {
      if (!active) return
      // Some checks end in another quiet pause, so this is not a mechanical patrol loop.
      if (Math.random() >= 0.55) {
        waitAt(between(3000, 6000))
        return
      }
      const candidates = ([0, 1, 2] as Anchor[]).filter(next => next !== anchor)
      // Most trips go to a neighboring stop; an occasional longer crossing still walks through the center.
      const target = anchor !== 1 && Math.random() < 0.8 ? 1 : candidates[Math.floor(Math.random() * candidates.length)]
      const start = ANCHORS[anchor]
      const finish = ANCHORS[target]
      const direction = finish < start ? 'left' : 'right'
      const duration = Math.round(Math.abs(finish - start) / 47 * between(900, 1100))
      const started = performance.now()
      const tick = (now: number) => {
        if (!active) return
        const progress = Math.min(1, (now - started) / duration)
        const x = start + Math.round((finish - start) * progress)
        const frame = (Math.floor((now - started) / 125) % 4 + 1) as WalkFrame
        setPose(previous => previous.x === x && previous.action === 'walk' && previous.frame === frame
          ? previous : { x, anchor, action: 'walk', direction, frame })
        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick)
        } else {
          anchor = target
          setPose({ x: finish, anchor, action: 'idle', direction, frame: 1 })
          waitAt(between(2500, 5500))
        }
      }
      animationFrame = requestAnimationFrame(tick)
    }

    waitAt(between(3000, 6000))
    return () => {
      active = false
      window.clearTimeout(timer)
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
    }
  }, [reducedMotion])

  const baseName = `home_cat_${time}_`
  const source = pose.action === 'walk'
    ? sprite(`${baseName}walk_${pose.direction}_${String(pose.frame).padStart(2, '0')}`)
    : sprite(`${baseName}idle_${String(idleFrame).padStart(2, '0')}`)

  return <div className="pixel-scene__cat" style={{ left: pose.x }} data-cat-anchor={pose.anchor} data-cat-state={pose.action} data-cat-x={pose.x} data-cat-frame={pose.action === 'walk' ? pose.frame : idleFrame}>
    <img src={source} alt="" width="24" height="24" />
  </div>
}
