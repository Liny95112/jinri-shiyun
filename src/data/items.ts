import type { DrinkItem, FoodItem, Item } from '../types'

// Tags also let a free-text dislike such as “香菜” or “太苦的” affect recommendations.
export const foods: FoodItem[] = [
  { id:'hotpot', name:'火锅', icon:'🍲', kind:'food', category:'meal', tastes:['rich','spicy'], budget:'high', moods:['happy','treat','comfort'], weight:8, tags:['热乎','聚餐','辣','香菜'], line:'热热闹闹地吃一顿，心情也跟着沸腾。' },
  { id:'bbq', name:'烤肉', icon:'🥩', kind:'food', category:'meal', tastes:['rich'], budget:'high', moods:['happy','treat'], weight:7, tags:['肉','聚餐'], line:'今天值得一口滋滋作响的快乐。' },
  { id:'ramen', name:'拉面', icon:'🍜', kind:'food', category:'meal', tastes:['rich'], budget:'mid', moods:['tired','comfort'], weight:9, tags:['热乎','面'], line:'热乎乎的最适合今天的你。' },
  { id:'beef-rice', name:'牛肉饭', icon:'🍚', kind:'food', category:'meal', tastes:['rich'], budget:'mid', moods:['tired','comfort'], weight:8, tags:['米饭','肉'], line:'一碗踏实的好吃，刚刚好。' },
  { id:'sushi', name:'寿司', icon:'🍣', kind:'food', category:'meal', tastes:['light'], budget:'high', moods:['happy','treat'], weight:7, tags:['日料','清爽'], line:'把今天过得精致一点点。' },
  { id:'malatang', name:'麻辣烫', icon:'🍢', kind:'food', category:'meal', tastes:['spicy','rich'], budget:'mid', moods:['annoyed','comfort'], weight:9, tags:['辣','热乎','香菜'], line:'想吃什么夹什么，快乐自己配。' },
  { id:'burger', name:'汉堡', icon:'🍔', kind:'food', category:'meal', tastes:['rich'], budget:'mid', moods:['happy','tired'], weight:8, tags:['快餐','肉'], line:'大口咬下去，烦恼先放一边。' },
  { id:'fried-chicken', name:'炸鸡', icon:'🍗', kind:'food', category:'snack', tastes:['rich'], budget:'mid', moods:['happy','annoyed','treat'], weight:8, tags:['酥脆','快餐'], line:'咔嚓一口，快乐有声音。' },
  { id:'rice-noodle', name:'米线', icon:'🍜', kind:'food', category:'meal', tastes:['light','spicy'], budget:'low', moods:['tired','comfort'], weight:8, tags:['热乎','汤','香菜'], line:'来一碗暖暖的，慢慢把电充满。' },
  { id:'rice-bowl', name:'盖饭', icon:'🍛', kind:'food', category:'meal', tastes:['rich'], budget:'low', moods:['tired'], weight:8, tags:['米饭','快餐'], line:'简单好吃的选项，今天就它。' },
  { id:'congee', name:'粥', icon:'🥣', kind:'food', category:'meal', tastes:['light'], budget:'low', moods:['tired','comfort'], weight:7, tags:['清淡','热乎'], line:'胃和心情都想被温柔照顾。' },
  { id:'fried-rice', name:'炒饭', icon:'🍚', kind:'food', category:'meal', tastes:['rich'], budget:'low', moods:['happy','tired'], weight:8, tags:['米饭','快餐'], line:'熟悉的香气，也是一种安心。' },
  { id:'luosifen', name:'螺蛳粉', icon:'🍜', kind:'food', category:'meal', tastes:['spicy','rich'], budget:'low', moods:['annoyed','treat'], weight:6, tags:['辣','酸','粉'], line:'今天就来点有个性的味道。' },
  { id:'curry', name:'咖喱饭', icon:'🍛', kind:'food', category:'meal', tastes:['rich'], budget:'mid', moods:['comfort','tired'], weight:8, tags:['米饭','热乎'], line:'香香浓浓，像被轻轻抱一下。' },
  { id:'sandwich', name:'三明治', icon:'🥪', kind:'food', category:'meal', tastes:['light'], budget:'low', moods:['tired','happy'], weight:7, tags:['面包','清爽'], line:'轻轻松松，也能吃得很好。' },
  { id:'pasta', name:'意面', icon:'🍝', kind:'food', category:'meal', tastes:['rich'], budget:'mid', moods:['treat','happy'], weight:8, tags:['面','番茄'], line:'给平常的一天加一点小约会感。' },
  { id:'dumplings', name:'水饺', icon:'🥟', kind:'food', category:'meal', tastes:['light','rich'], budget:'low', moods:['comfort','tired'], weight:8, tags:['热乎','面食'], line:'一口一个，稳稳的幸福。' },
  { id:'salad', name:'沙拉碗', icon:'🥗', kind:'food', category:'meal', tastes:['light'], budget:'mid', moods:['happy'], weight:7, tags:['清爽','蔬菜','苦瓜'], line:'清爽的一餐，给今天留点轻盈。' },
  { id:'baozi', name:'小笼包', icon:'🥟', kind:'food', category:'snack', tastes:['light','rich'], budget:'low', moods:['comfort','tired'], weight:8, tags:['热乎','面食'], line:'小小一笼，装得下大大的满足。' },
  { id:'skewers', name:'烤串', icon:'🍢', kind:'food', category:'snack', tastes:['spicy','rich'], budget:'mid', moods:['happy','annoyed'], weight:7, tags:['辣','烧烤'], line:'把今天的快乐串起来。' },
  { id:'fries', name:'薯条', icon:'🍟', kind:'food', category:'snack', tastes:['rich'], budget:'low', moods:['happy','comfort'], weight:7, tags:['酥脆','快餐'], line:'偷一点小快乐，不用理由。' },
  { id:'pancake', name:'煎饼', icon:'🫓', kind:'food', category:'snack', tastes:['rich'], budget:'low', moods:['tired','happy'], weight:7, tags:['面食','快餐','香菜'], line:'香香脆脆，今天也能被治愈。' },
  { id:'takoyaki', name:'章鱼小丸子', icon:'🐙', kind:'food', category:'snack', tastes:['rich'], budget:'mid', moods:['happy','treat'], weight:7, tags:['日料','热乎'], line:'小小圆圆的，快乐刚好一口。' },
  { id:'cake', name:'草莓蛋糕', icon:'🍰', kind:'food', category:'dessert', tastes:['sweet'], budget:'high', moods:['treat','happy','comfort'], weight:8, tags:['蛋糕','草莓','甜'], line:'今天就宠自己一下吧。' },
  { id:'ice-cream', name:'冰淇淋', icon:'🍨', kind:'food', category:'dessert', tastes:['sweet'], budget:'low', moods:['happy','annoyed'], weight:8, tags:['甜','冰'], line:'甜甜的，坏心情先融化。' },
  { id:'bread', name:'奶油面包', icon:'🥐', kind:'food', category:'dessert', tastes:['sweet'], budget:'low', moods:['comfort','tired'], weight:7, tags:['面包','奶油','甜'], line:'软乎乎的一口，温柔补给。' },
  { id:'pudding', name:'焦糖布丁', icon:'🍮', kind:'food', category:'dessert', tastes:['sweet'], budget:'mid', moods:['comfort','treat'], weight:7, tags:['甜','焦糖'], line:'让今天慢慢地甜起来。' },
  { id:'tanghulu', name:'糖葫芦', icon:'🍡', kind:'food', category:'dessert', tastes:['sweet'], budget:'low', moods:['happy','annoyed'], weight:6, tags:['甜','酸'], line:'酸酸甜甜，像今天的小彩蛋。' }
]

export const drinks: DrinkItem[] = [
  { id:'milk-tea', name:'珍珠奶茶', icon:'🧋', kind:'drink', category:'milk-tea', temperatures:['iced','room','hot'], sweetness:['low','normal'], caffeine:true, budget:'mid', moods:['happy','comfort'], weight:9, tags:['奶茶','甜'], line:'你的快乐饮品已出现。' },
  { id:'brown-sugar', name:'黑糖鲜奶', icon:'🥛', kind:'drink', category:'milk-tea', temperatures:['iced','hot'], sweetness:['normal'], caffeine:false, budget:'high', moods:['treat','comfort'], weight:7, tags:['奶茶','甜','奶'], line:'甜一点，今天就被温柔包围。' },
  { id:'taro-milk', name:'芋泥奶茶', icon:'🧋', kind:'drink', category:'milk-tea', temperatures:['iced','hot'], sweetness:['low','normal'], caffeine:true, budget:'high', moods:['comfort','treat'], weight:7, tags:['奶茶','芋泥'], line:'绵绵的芋泥，绵绵的好心情。' },
  { id:'americano', name:'美式咖啡', icon:'☕', kind:'drink', category:'coffee', temperatures:['room','hot'], sweetness:['none'], caffeine:true, budget:'low', moods:['tired'], weight:7, tags:['咖啡','太苦的','苦'], line:'清醒一点，今天也能轻松过关。' },
  { id:'iced-americano', name:'冰美式', icon:'🧊', kind:'drink', category:'coffee', temperatures:['iced'], sweetness:['none'], caffeine:true, budget:'low', moods:['tired','annoyed'], weight:7, tags:['咖啡','太苦的','苦'], line:'冰冰一口，思路也清爽了。' },
  { id:'latte', name:'热拿铁', icon:'☕', kind:'drink', category:'coffee', temperatures:['hot'], sweetness:['none','low'], caffeine:true, budget:'mid', moods:['tired','comfort'], weight:8, tags:['咖啡','奶'], line:'温温柔柔地，为你续一点电。' },
  { id:'iced-latte', name:'冰拿铁', icon:'🥤', kind:'drink', category:'coffee', temperatures:['iced'], sweetness:['none','low'], caffeine:true, budget:'mid', moods:['happy','tired'], weight:8, tags:['咖啡','奶'], line:'奶香和咖啡香，刚好合拍。' },
  { id:'lemon-tea', name:'柠檬茶', icon:'🍋', kind:'drink', category:'fruit-tea', temperatures:['iced','room'], sweetness:['low','normal'], caffeine:true, budget:'low', moods:['happy','annoyed'], weight:9, tags:['果茶','酸'], line:'酸酸甜甜，给今天换个频道。' },
  { id:'peach-tea', name:'蜜桃果茶', icon:'🍑', kind:'drink', category:'fruit-tea', temperatures:['iced','room'], sweetness:['low','normal'], caffeine:false, budget:'mid', moods:['happy','treat'], weight:8, tags:['果茶','甜'], line:'桃子味的小确幸，已经送达。' },
  { id:'grapefruit-tea', name:'西柚果茶', icon:'🍊', kind:'drink', category:'fruit-tea', temperatures:['iced','room'], sweetness:['low'], caffeine:false, budget:'mid', moods:['happy'], weight:7, tags:['果茶','酸'], line:'清清爽爽，像吹来一阵小风。' },
  { id:'oolong', name:'乌龙茶', icon:'🍵', kind:'drink', category:'hot-drink', temperatures:['room','hot'], sweetness:['none'], caffeine:true, budget:'low', moods:['tired'], weight:7, tags:['茶','清爽'], line:'让节奏慢下来，喝一口茶。' },
  { id:'matcha-latte', name:'抹茶拿铁', icon:'🍵', kind:'drink', category:'hot-drink', temperatures:['iced','hot'], sweetness:['low','normal'], caffeine:true, budget:'high', moods:['comfort','treat'], weight:7, tags:['抹茶','奶'], line:'抹茶色的温柔，给你一点好运。' },
  { id:'hot-cocoa', name:'热可可', icon:'☕', kind:'drink', category:'hot-drink', temperatures:['hot'], sweetness:['normal'], caffeine:false, budget:'mid', moods:['tired','comfort'], weight:8, tags:['巧克力','甜','热乎'], line:'把手和心都暖一暖。' },
  { id:'soy-milk', name:'热豆浆', icon:'🥛', kind:'drink', category:'hot-drink', temperatures:['hot'], sweetness:['none','low'], caffeine:false, budget:'low', moods:['tired','comfort'], weight:7, tags:['豆浆','热乎'], line:'朴素又安心，今天刚刚好。' },
  { id:'cola', name:'可乐', icon:'🥤', kind:'drink', category:'soda', temperatures:['iced','room'], sweetness:['normal'], caffeine:true, budget:'low', moods:['happy','annoyed'], weight:8, tags:['碳酸','太甜的','甜'], line:'咕嘟咕嘟，快乐冒泡啦。' },
  { id:'sparkling-water', name:'气泡水', icon:'🫧', kind:'drink', category:'soda', temperatures:['iced','room'], sweetness:['none'], caffeine:false, budget:'low', moods:['happy'], weight:7, tags:['碳酸','清爽'], line:'轻盈的小气泡，陪你松口气。' },
  { id:'orange-soda', name:'橘子汽水', icon:'🍊', kind:'drink', category:'soda', temperatures:['iced'], sweetness:['normal'], caffeine:false, budget:'mid', moods:['happy','treat'], weight:7, tags:['碳酸','太甜的','甜'], line:'今天的快乐，是橘子味的。' },
  { id:'mango-sago', name:'杨枝甘露', icon:'🥭', kind:'drink', category:'fruit-tea', temperatures:['iced'], sweetness:['normal'], caffeine:false, budget:'high', moods:['treat','happy'], weight:8, tags:['芒果','甜','果茶'], line:'一口芒果味的奖励，请收好。' },
  { id:'strawberry-milk', name:'草莓牛乳', icon:'🍓', kind:'drink', category:'milk-tea', temperatures:['iced','room'], sweetness:['low','normal'], caffeine:false, budget:'mid', moods:['comfort','happy'], weight:8, tags:['奶','草莓','甜'], line:'粉粉甜甜，今天适合被宠一下。' }
]

export const allItems: Item[] = [...foods, ...drinks]
export const itemById = new Map(allItems.map(item => [item.id, item]))
