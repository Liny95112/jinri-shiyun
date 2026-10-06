import { FilterChip, PixelButton, PixelCard, SectionTitle } from '../components/PixelUI'
import type { DrinkFilters, FoodFilters, Kind, SavedState } from '../types'

const foodCategory = [['meal','正餐'],['snack','小吃'],['dessert','甜品'],['any','随便']] as const
const tastes = [['light','清淡'],['rich','重口'],['spicy','辣一点'],['sweet','甜一点'],['any','随便']] as const
const budgets = [['low','便宜点'],['mid','正常'],['high','今天任性']] as const
const moods = [
  ['happy','😊 开心'],['tired','😮‍💨 累了'],['annoyed','😤 烦躁'],
  ['stressed','😵‍💫 压力大'],['low-appetite','🫥 没胃口'],['craving','😋 嘴馋了'],
  ['treat','👑 犒劳自己'],['comfort','🥺 想被安慰'],['any','🎲 随便啦']
] as const
const drinkCategory = [['milk-tea','奶茶'],['coffee','咖啡'],['fruit-tea','果茶'],['soda','碳酸'],['hot-drink','热饮'],['any','随便']] as const
const temperatures = [['iced','冰'],['room','常温'],['hot','热'],['any','都可以']] as const
const sweetness = [['none','无糖'],['low','微糖'],['normal','正常甜'],['any','随便']] as const
const caffeine = [['yes','要'],['no','不要'],['any','无所谓']] as const

type Option<T extends string> = readonly [T, string]
function Group<T extends string>({ number, title, options, value, onChange, moodGrid = false }: { number: string; title: string; options: readonly Option<T>[]; value: T; onChange: (value: T) => void; moodGrid?: boolean }) {
  return <div className="filter-group"><SectionTitle number={number} title={title} /><div className={`chip-list ${moodGrid ? 'mood-grid' : ''}`}>{options.map(([key, label]) => <FilterChip key={key} selected={value === key} onClick={() => onChange(key)}>{label}</FilterChip>)}</div></div>
}

export function PickerPage({ kind, state, onChange, onStart }: { kind: Kind; state: SavedState; onChange: (filters: FoodFilters | DrinkFilters) => void; onStart: () => void }) {
  const food = state.foodFilters, drink = state.drinkFilters
  return <main className="page picker-page">
    <div className="page-intro"><div className="eyebrow">QUEST 01 / 做个小选择</div><h1>{kind === 'food' ? '今天吃什么？' : '今天喝什么？'}</h1><p>{kind === 'food' ? '给我一点线索，食运精灵来帮你想。' : '选好你的小心愿，快乐马上揭晓。'}</p></div>
    <PixelCard className="filter-card">
      {kind === 'food' ? <>
        <Group number="01" title="今天想吃" options={foodCategory} value={food.category} onChange={value => onChange({ ...food, category: value })} />
        <Group number="02" title="口味偏好" options={tastes} value={food.taste} onChange={value => onChange({ ...food, taste: value })} />
        <Group number="03" title="预算" options={budgets} value={food.budget} onChange={value => onChange({ ...food, budget: value })} />
        <Group number="04" title="现在的心情" options={moods} value={food.mood} moodGrid onChange={value => onChange({ ...food, mood: value })} />
        <div className="filter-group filter-group--last"><SectionTitle number="05" title="最近吃过的" /><div className="chip-list"><FilterChip selected={food.avoidRecent} onClick={() => onChange({ ...food, avoidRecent: true })}>尽量避开</FilterChip><FilterChip selected={!food.avoidRecent} onClick={() => onChange({ ...food, avoidRecent: false })}>无所谓</FilterChip></div></div>
      </> : <>
        <Group number="01" title="想喝类型" options={drinkCategory} value={drink.category} onChange={value => onChange({ ...drink, category: value })} />
        <Group number="02" title="温度" options={temperatures} value={drink.temperature} onChange={value => onChange({ ...drink, temperature: value })} />
        <Group number="03" title="甜度倾向" options={sweetness} value={drink.sweetness} onChange={value => onChange({ ...drink, sweetness: value })} />
        <Group number="04" title="预算" options={budgets} value={drink.budget} onChange={value => onChange({ ...drink, budget: value })} />
        <Group number="05" title="需要咖啡因吗" options={caffeine} value={drink.caffeine} onChange={value => onChange({ ...drink, caffeine: value })} />
      </>}
    </PixelCard>
    <div className="sticky-action"><PixelButton size="large" onClick={onStart} className="full-width">✦ 帮我决定！ ✦</PixelButton><p>{kind === 'food' ? '再犹豫的话饭都要凉啦～' : '你的快乐饮品正在等你呀～'}</p></div>
  </main>
}
