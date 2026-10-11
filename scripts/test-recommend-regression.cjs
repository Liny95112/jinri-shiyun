const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env?.DEV', 'false')
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename)
}
const { foods, drinks } = require('../src/data/items.ts')
const { initialState, loadState } = require('../src/lib/storage.ts')
const { pickRecommendation, scoreRecommendation, getTimePreferenceScore } = require('../src/lib/recommend.ts')
const { generateDailyFortune, getTodayFortune } = require('../src/lib/dailyFortune.ts')
const now = new Date(2026, 9, 11, 12)
const clone = () => structuredClone(initialState)
const draw = (kind, state, options = {}) => pickRecommendation(kind, state, { now, random: () => .4, ...options })?.item
const smallFood = foods.slice(0, 3)
const state = clone()
const first = draw('food', state, { pool: smallFood, usePickerFilters: false })
assert.ok(first)
state.lastShown = [{ id:first.id, timestamp:now.getTime() }]
const second = draw('food', state, { pool: smallFood, usePickerFilters: false, recentDraws:[first.id] })
assert.notEqual(second.id, first.id, 'reroll must avoid a recently shown item when alternatives exist')
const afterReload = draw('food', state, { pool: smallFood, usePickerFilters: false, recentDraws:[] })
assert.notEqual(afterReload.id, first.id, 'persisted lastShown must cover a newly entered flow')
const unrelatedDraws = foods.filter(item => !smallFood.some(entry => entry.id === item.id)).slice(0,5).map(item => item.id)
assert.notEqual(draw('food', state, { pool:smallFood, usePickerFilters:false, recentDraws:unrelatedDraws }).id, first.id, 'draws outside the current filter must not displace relevant memory')
for (const kind of ['food','drink']) {
  const pool = (kind === 'food' ? foods : drinks).slice(0, 1)
  const one = draw(kind, clone(), { pool, usePickerFilters:false })
  assert.equal(one.id, pool[0].id, 'single candidate must still draw')
  assert.equal(draw(kind, clone(), { pool, excludeId:one.id, usePickerFilters:false }), undefined)
  assert.equal(draw(kind, clone(), { pool, usePickerFilters:false, recentDraws:[one.id] }).id, one.id, 'single candidate may repeat')
}
const disliked = clone()
disliked.dislikedFood = [smallFood[0].name]
for (let i=0;i<50;i++) assert.notEqual(draw('food', disliked, { pool:smallFood, usePickerFilters:false, random:()=>i/50 }).id, smallFood[0].id)
const rejected = clone()
const target = foods.find(x=>x.id==='ramen')
rejected.todayRejected = [{ id:target.id, kind:'food', day:'2026-10-11' }]
const todayScore = scoreRecommendation(target, rejected, { now }).final
const tomorrowScore = scoreRecommendation(target, rejected, { now:new Date(2026,9,12,12) }).final
assert.ok(tomorrowScore > todayScore * 20, 'today rejection must expire')
const drink = drinks[0]
const crossKind = clone()
crossKind.history = [{ id:'cross', itemId:drink.id, name:drink.name, kind:'food', timestamp:now.getTime()-3600000, fromRecommendation:true }]
assert.equal(scoreRecommendation(drink,crossKind,{now}).historyMultiplier,1,'food history must not penalize a drink')
const light = foods.find(x=>x.id==='congee')
const hotpot = foods.find(x=>x.id==='hotpot')
assert.ok(getTimePreferenceScore(light,new Date(2026,9,11,8)) > getTimePreferenceScore(hotpot,new Date(2026,9,11,8)),'breakfast bias must remain')
const filtered = clone()
filtered.foodFilters = { category:'meal', taste:'light', budget:'low', mood:'low-appetite', avoidRecent:true }
for (let i=0;i<100;i++) {
  const item=draw('food',filtered,{random:()=>i/100})
  assert.equal(item.category,'meal')
  assert.ok(item.tastes.includes('light'))
}
const dexPool = foods.filter(x=>x.tags.includes('日料')).slice(0,8)
for (let i=0;i<100;i++) assert.ok(dexPool.includes(draw('food',clone(),{pool:dexPool,usePickerFilters:false,recentDraws:[],random:()=>i/100})))
const legacy = { likedFood:['拉面'], dislikedDrink:['可乐'], favorites:['ramen'], history:[{id:'old',itemId:'ramen',name:'拉面',kind:'food',timestamp:now.getTime(),fromRecommendation:true}], lastShown:[{id:'ramen',timestamp:now.getTime()}] }
global.localStorage = { getItem:()=>JSON.stringify(legacy) }
const loaded=loadState()
assert.deepEqual(loaded.likedFood,['拉面'])
assert.deepEqual(loaded.favorites,['ramen'])
assert.equal(loaded.history[0].itemId,'ramen')
assert.equal(loaded.lastShown[0].id,'ramen')
const fortune = generateDailyFortune(clone(),now,()=>.4)
assert.ok(fortune?.foodId && fortune?.drinkId)
assert.equal(getTodayFortune({ ...clone(), dailyFortune:fortune },now)?.foodId,fortune.foodId)
console.log('Regression checks passed: reroll, reload memory, small pools, dislike, today rejection, kind separation, filters, dex, legacy storage, fortune.')
