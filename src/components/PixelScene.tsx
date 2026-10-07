import { useState } from 'react'
import { getDayPeriod, type DayPeriod } from '../lib/recommend'
import morning from '../assets/pixel/home/home_shop_morning.png'
import morningIdle from '../assets/pixel/home/home_shop_morning_idle.png'
import day from '../assets/pixel/home/home_shop_day.png'
import dayIdle from '../assets/pixel/home/home_shop_day_idle.png'
import night from '../assets/pixel/home/home_shop_night.png'
import nightIdle from '../assets/pixel/home/home_shop_night_idle.png'

type ShopTime = 'morning' | 'day' | 'night'

const periodToShop: Record<DayPeriod, ShopTime> = {
  breakfast: 'morning', lunch: 'day', tea: 'day', dinner: 'night', late: 'night'
}
const scenes = {
  morning: { base: morning, idle: morningIdle, label: '晨光里的日式像素小食堂' },
  day: { base: day, idle: dayIdle, label: '白天营业中的日式像素小食堂' },
  night: { base: night, idle: nightIdle, label: '亮着暖灯的夜晚像素小食堂' }
} as const

/** Pick once on entry, sharing recommendation's local daypart boundaries. */
export function PixelScene() {
  const [time] = useState<ShopTime>(() => periodToShop[getDayPeriod()])
  const scene = scenes[time]
  return <div className="pixel-scene" role="img" aria-label={scene.label} data-scene={time}>
    <img className="pixel-scene__frame" src={scene.base} alt="" width="160" height="96" />
    <img className="pixel-scene__frame pixel-scene__frame--idle" src={scene.idle} alt="" width="160" height="96" />
  </div>
}
