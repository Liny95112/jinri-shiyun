import { useState } from 'react'
import { HomeCat, type ShopTime } from './HomeCat'
import { getDayPeriod, type DayPeriod } from '../lib/recommend'
import morning from '../assets/pixel/home/preview/home_shop_morning_preview.png'
import morningNorenLeft from '../assets/pixel/home/preview/home_shop_morning_noren_left.png'
import morningNorenRight from '../assets/pixel/home/preview/home_shop_morning_noren_right.png'
import morningAccent from '../assets/pixel/home/preview/home_shop_morning_accent.png'
import day from '../assets/pixel/home/preview/home_shop_day_preview.png'
import dayNorenLeft from '../assets/pixel/home/preview/home_shop_day_noren_left.png'
import dayNorenRight from '../assets/pixel/home/preview/home_shop_day_noren_right.png'
import dayAccent from '../assets/pixel/home/preview/home_shop_day_accent.png'
import night from '../assets/pixel/home/preview/home_shop_night_preview.png'
import nightNorenLeft from '../assets/pixel/home/preview/home_shop_night_noren_left.png'
import nightNorenRight from '../assets/pixel/home/preview/home_shop_night_noren_right.png'
import nightAccent from '../assets/pixel/home/preview/home_shop_night_accent.png'

const periodToShop: Record<DayPeriod, ShopTime> = {
  breakfast: 'morning', lunch: 'day', tea: 'day', dinner: 'night', late: 'night'
}
const scenes = {
  morning: {
    base: morning, norenLeft: morningNorenLeft, norenRight: morningNorenRight,
    accent: morningAccent, label: '晨光里的日式像素小食堂'
  },
  day: {
    base: day, norenLeft: dayNorenLeft, norenRight: dayNorenRight,
    accent: dayAccent, label: '白天营业中的日式像素小食堂'
  },
  night: {
    base: night, norenLeft: nightNorenLeft, norenRight: nightNorenRight,
    accent: nightAccent, label: '亮着暖灯的夜晚像素小食堂'
  }
} as const

/** Reuse the existing local time period; every frame uses the same native 160×96 canvas. */
export function PixelScene() {
  const [time] = useState<ShopTime>(() => periodToShop[getDayPeriod()])
  const scene = scenes[time]
  return <div className="pixel-scene" role="img" aria-label={scene.label} data-scene={time}>
    <div className="pixel-scene__native">
      <img className="pixel-scene__frame" src={scene.base} alt="" width="160" height="96" />
      <img className="pixel-scene__frame pixel-scene__frame--noren-left" src={scene.norenLeft} alt="" width="160" height="96" />
      <img className="pixel-scene__frame pixel-scene__frame--noren-right" src={scene.norenRight} alt="" width="160" height="96" />
      <img className="pixel-scene__frame pixel-scene__frame--accent" src={scene.accent} alt="" width="160" height="96" />
      <HomeCat time={time} />
    </div>
  </div>
}
