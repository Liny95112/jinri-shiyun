const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env?.DEV', 'false')
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText, filename)
}
const { drinks } = require('../src/data/items.ts')
const { initialState } = require('../src/lib/storage.ts')
const { pickRecommendation } = require('../src/lib/recommend.ts')
const categories = ['milk-tea', 'coffee', 'fruit-tea', 'soda', 'hot-drink']
const date = new Date(2026, 9, 18, 15)
const normalize = value => value.normalize('NFKC').toLowerCase()
  .replace(/[\s·•．.（）()【】\[\]、，,:：\-—_]/g, '')
  .replace('奈雪的茶', '奈雪').replace('coco都可', 'coco')
const ids = new Set(), names = new Set()
for (const item of drinks) {
  assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  assert.ok(!ids.has(item.id), 'duplicate ID: ' + item.id); ids.add(item.id)
  const name = normalize(item.name)
  assert.ok(!names.has(name), 'duplicate normalized name: ' + item.name); names.add(name)
  assert.equal(item.kind, 'drink')
  assert.ok(categories.includes(item.category))
  assert.ok(item.temperatures.length && item.sweetness.length && item.moods.length && item.tags.length)
  assert.ok(item.name.trim() && item.line.trim() && item.weight > 0)
  assert.equal(typeof item.caffeine, 'boolean')
  const state = structuredClone(initialState)
  const result = pickRecommendation('drink', state, { pool: [item], usePickerFilters: false, now: date, random: () => .5 })
  assert.equal(result?.item.id, item.id, item.id + ' must be selectable')
}
assert.ok(drinks.length >= 300)
function rng(seed) {
  let n = seed >>> 0
  return () => { n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return (n >>> 0) / 4294967296 }
}
function simulate(seed, category, session) {
  const state = structuredClone(initialState)
  state.drinkFilters = { ...state.drinkFilters, category }
  const random = rng(seed), counts = new Map(), last = [], categoryCounts = {}, brandCounts = {}
  let repeated = 0, repeated5 = 0, nulls = 0
  for (let i = 0; i < 1000; i++) {
    if (!session) { state.lastShown = []; state.history = [] }
    const result = pickRecommendation('drink', state, { now: date, random, recentDraws: session ? last : [] })
    if (!result) { nulls++; continue }
    const item = result.item
    if (category !== 'any') assert.equal(item.category, category)
    if (last[0] === item.id) repeated++
    if (last.slice(0, 5).includes(item.id)) repeated5++
    last.unshift(item.id); last.length = Math.min(5, last.length)
    counts.set(item.id, (counts.get(item.id) || 0) + 1)
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
    if (item.name.includes(' · ')) {
      const brand = item.name.split(' · ')[0]
      brandCounts[brand] = (brandCounts[brand] || 0) + 1
    }
    if (session) state.lastShown = [{ id: item.id, timestamp: date.getTime() }, ...state.lastShown.filter(x => x.id !== item.id)].slice(0, 100)
  }
  return {
    eligible: drinks.filter(x => category === 'any' || x.category === category).length,
    coverage: counts.size,
    adjacentRepeatPct: +(repeated / 10).toFixed(1),
    recent5RepeatPct: +(repeated5 / 10).toFixed(1),
    top10Pct: +([...counts.values()].sort((a,b) => b-a).slice(0,10).reduce((a,b)=>a+b,0) / 10).toFixed(1),
    picksByCategory: categoryCounts,
    brandedPickPct: +(Object.values(brandCounts).reduce((a,b)=>a+b,0) / 10).toFixed(1),
    topBrands: Object.entries(brandCounts).sort((a,b)=>b[1]-a[1]).slice(0,3), nulls
  }
}
const byCategory = Object.fromEntries(categories.map(cat => [cat, drinks.filter(x => x.category === cat).length]))
const byBrand = {}
for (const item of drinks) {
  const brand = item.name.includes(' · ') ? item.name.split(' · ')[0] : null
  if (brand) byBrand[brand] = (byBrand[brand] || 0) + 1
}
const legacyCount = 154 // Frozen local pre-expansion count; used only for this trial's coverage report.
const addedIds = new Set(drinks.slice(legacyCount).map(item => item.id))
const addedSelected = new Set()
const sampleRandom = rng(8108)
for (let i = 0; i < 1000; i++) {
  const picked = pickRecommendation('drink', structuredClone(initialState), {now:date, random:sampleRandom, recentDraws:[]})
  if (picked && addedIds.has(picked.item.id)) addedSelected.add(picked.item.id)
}
const report = {
  addedCount: addedIds.size, addedSelectedIn1000IndependentDraws: addedSelected.size,
  total: drinks.length, normalizedUnique: names.size, brands: Object.keys(byBrand).length,
  byCategory, byBrand,
  allIndependent: simulate(27, 'any', false),
  allSession: simulate(28, 'any', true),
  categoryRuns: Object.fromEntries(categories.map((cat,i) => [cat, simulate(100+i, cat, true)]))
}
const disliked = structuredClone(initialState)
disliked.dislikedDrink = [drinks[0].name]
assert.equal(pickRecommendation('drink', disliked, {pool:[drinks[0]], usePickerFilters:false, now:date}), null)
assert.equal(pickRecommendation('drink', disliked, {pool:[], usePickerFilters:false, now:date}), null)
assert.equal(pickRecommendation('drink', structuredClone(initialState), {pool:drinks.slice(0,1), usePickerFilters:false, now:date})?.item.id, drinks[0].id)
for (const run of [report.allIndependent, report.allSession, ...Object.values(report.categoryRuns)]) assert.equal(run.nulls, 0)
console.log(JSON.stringify(report, null, 2))
