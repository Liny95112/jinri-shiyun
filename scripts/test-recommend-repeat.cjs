const fs = require('node:fs')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env?.DEV', 'false')
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename)
}
const { foods, drinks } = require('../src/data/items.ts')
const { initialState } = require('../src/lib/storage.ts')
const { pickRecommendation } = require('../src/lib/recommend.ts')
const now = new Date(2026, 9, 11, 12, 0)
function random(seed) {
  let value = seed >>> 0
  return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 4294967296 }
}
function freshState() { return structuredClone(initialState) }
function poolSize(s) {
  const all = s.pool ?? (s.kind === 'food' ? foods : drinks)
  if (s.usePickerFilters === false) return all.length
  const f = s.state.foodFilters, d = s.state.drinkFilters
  return all.filter(item => item.kind === s.kind && (item.kind === 'food'
    ? (f.category === 'any' || item.category === f.category) && (f.taste === 'any' || item.tastes.includes(f.taste))
    : (d.category === 'any' || item.category === d.category) && (d.temperature === 'any' || item.temperatures.includes(d.temperature)) && (d.sweetness === 'any' || item.sweetness.includes(d.sweetness)) && (d.caffeine === 'any' || item.caffeine === (d.caffeine === 'yes')))).length
}
function run(s, seed) {
  const state = s.state
  const rng = random(seed)
  const recentDraws = []
  const previous = []
  const counts = new Map()
  const historyIds = new Set(state.history.filter(h => now.getTime() - h.timestamp < 86400000 && h.kind === s.kind).map(h => h.itemId))
  let adjacent = 0, recent5 = 0, history24 = 0, nulls = 0
  for (let i = 0; i < 1000; i++) {
    const session = s.session !== false
    const options = { now, random: rng, pool: s.pool, usePickerFilters: s.usePickerFilters, recentDraws: session ? recentDraws : [] }
    if (session && previous.length) options.excludeId = previous[0]
    let pick = pickRecommendation(s.kind, state, options)
    if (!pick && options.excludeId) pick = pickRecommendation(s.kind, state, { ...options, excludeId: undefined })
    if (!pick) { nulls++; continue }
    const id = pick.item.id
    if (previous[0] === id) adjacent++
    if (previous.slice(0, 5).includes(id)) recent5++
    if (historyIds.has(id)) history24++
    counts.set(id, (counts.get(id) ?? 0) + 1)
    previous.unshift(id)
    if (session) { const at = recentDraws.indexOf(id); if (at >= 0) recentDraws.splice(at, 1); recentDraws.unshift(id); recentDraws.length = Math.min(5, recentDraws.length) }
    state.lastShown = [{ id, timestamp: now.getTime() }, ...state.lastShown.filter(entry => entry.id !== id)].slice(0, 100)
  }
  return {
    pool: poolSize(s), mode: s.session === false ? 'independent' : 'session', draws: 1000,
    adjacentPct: +(adjacent / 10).toFixed(1), recent5Pct: +(recent5 / 10).toFixed(1),
    history24Pct: +(history24 / 10).toFixed(1),
    coverage: counts.size, top10Pct: +([...counts.values()].sort((a,b) => b-a).slice(0,10).reduce((a,b)=>a+b,0) / 10).toFixed(1), nulls
  }
}
function scenario(label, kind, seed, options = {}) {
  const state = freshState()
  Object.assign(state, options.state ?? {})
  return [label, run({ kind, state, session: options.session, pool: options.pool, usePickerFilters: options.usePickerFilters }, seed)]
}
function histories(kind, items, count) {
  return items.slice(0, count).map((item, i) => ({ id: 'history-'+i, itemId: item.id, name: item.name, kind, timestamp: now.getTime()-3600000, fromRecommendation: true }))
}
const cases = [
  scenario('food-default-session','food',1),
  scenario('drink-default-session','drink',2),
  scenario('food-independent','food',3,{session:false}),
  scenario('drink-independent','drink',4,{session:false}),
  scenario('food-many-likes','food',5,{state:{likedFood:foods.slice(0,20).map(x=>x.name)}}),
  scenario('drink-many-likes','drink',6,{state:{likedDrink:drinks.slice(0,20).map(x=>x.name)}}),
  scenario('food-history-independent','food',7,{session:false,state:{history:histories('food',foods,20)}}),
  scenario('drink-history-independent','drink',8,{session:false,state:{history:histories('drink',drinks,12)}}),
  scenario('food-small-1','food',9,{pool:foods.slice(0,1),usePickerFilters:false}),
  scenario('food-small-3','food',10,{pool:foods.slice(0,3),usePickerFilters:false}),
  scenario('drink-small-5','drink',11,{pool:drinks.slice(0,5),usePickerFilters:false}),
  scenario('food-filtered-lunch','food',12,{state:{foodFilters:{category:'meal',taste:'light',budget:'low',mood:'low-appetite',avoidRecent:true}}}),
  scenario('drink-filtered','drink',13,{state:{drinkFilters:{category:'milk-tea',temperature:'iced',sweetness:'low',budget:'mid',caffeine:'yes'}}}),
  scenario('dex-food-8','food',14,{pool:foods.filter(x=>x.tags.includes('日料')).slice(0,8),usePickerFilters:false}),
]
const report = Object.fromEntries(cases)
if (process.argv.includes('--assert')) {
  const assert = require('node:assert/strict')
  for (const [label, result] of cases) {
    assert.equal(result.nulls, 0, label + ' must always produce a result')
    assert.ok(result.coverage <= result.pool, label + ' must stay within its candidate pool')
    if (result.pool >= 6) assert.equal(result.recent5Pct, 0, label + ' must avoid the recent five while options remain')
  }
  assert.equal(report['food-history-independent'].history24Pct, 0)
  assert.equal(report['drink-history-independent'].history24Pct, 0)
}
console.log(JSON.stringify(report,null,2))
