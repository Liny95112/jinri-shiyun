# 饮品库本地扩容核对记录

本轮仅修改原有 `src/data/items.ts` 的 `drinks` 数组。旧 ID、旧数据和存档结构均保留；随 v0.10.0 发布，公告仅在升级后首次进入时显示。

## 数量

| 指标 | 扩容前 | 扩容后 |
| --- | ---: | ---: |
| 饮品条目 | 154 | 344 |
| 名称规范化后有效条目 | 154 | 344 |
| 有品牌前缀的条目 | 46 | 116 |
| 品牌数（按展示前缀） | 11 | 19 |
| 奶茶 | 35 | 75 |
| 咖啡 | 35 | 70 |
| 果茶及果饮 | 40 | 95 |
| 气泡及即饮 | 12 | 35 |
| 茶、乳、谷物及传统饮品（沿用现有 `hot-drink` 分类） | 32 | 69 |

新增 190 条，其中品牌款 70 条，通用饮品 120 条。

品牌分布（扩容后）：霸王茶姬 7、星巴克 19、瑞幸 11、喜茶 3、奈雪 6、茶百道 7、古茗 3、沪上阿姨 2、CoCo 11、蜜雪冰城 7、书亦烧仙草 7、东方树叶 3、可口可乐 2、芬达 4、美汁源 7、益禾堂 6、1点点 4、M Stand 6、Tims 1。饮品模型目前只有五种分类，因此果汁、果昔沿用 `fruit-tea`，瓶装茶及豆乳等沿用 `hot-drink`；本轮不更改分类类型与界面。

## 品牌来源核对

这里的“核对”指名称可在品牌官网或品牌公开资料找到，**不保证在每个城市、每家门店、当前时刻均有售**。瑞幸等历史发布资料仅证明该品牌推出过相应产品。品牌未有可靠产品页时未补写虚构款。

- [星巴克中国菜单](https://www.starbucks.com.cn/menu)：冰摇桃桃乌龙茶、冰摇红莓黑加仑茶、抹茶星冰乐、焦糖浓缩咖啡星冰乐、阿馥奇朵等。
- [瑞幸官方投资者资料（2024 Q2）](https://investor.luckincoffee.com/static-files/82644e4d-ae3b-46b8-a5e3-317f0e2f5ebb)、[2025 Q1](https://investor.luckincoffee.com/static-files/0de49c0b-dd16-4052-82ed-a7fbcfeee48a)：椰皇拿铁、柠C美式、椰子冻拿铁等；[椰云拿铁官方资料](https://investor.luckincoffee.com/static-files/180c6c99-902f-47db-a22e-04457fe3c6fe)。
- [奈雪品牌介绍](https://www.naixuecha.com/about)：超能牛油果酸奶昔、霸气玉油柑、浓抹干酪香水椰等。
- [茶百道产品页](https://www.chabaidao.com/home/product/index/id/2.html)：粉上芭乐提、青提茉莉、西瓜啵啵、阳光青提冰奶。
- [CoCo 都可产品页](https://www.coco-tea.com.cn/detail/153.html)：CoCo奶茶、双倍鲜芋奶绿、鲜芋牛奶、现煮绿豆冰等；[轻乳茶](https://www.coco-tea.com.cn/detail/67.html)、[手打柠檬鸭屎香](https://www.coco-tea.com.cn/detail/82.html)。
- [蜜雪冰城产品实力页](https://www.mxbc.com/product_strength.html)：草莓摇摇奶昔、茉莉奶绿、雪王雪顶咖啡、经典厚奶茶。
- [农夫山泉产品页](https://www.nongfuspring.com/mobile/goods/detail-all.html?id=1&pid=2)：东方树叶茉莉花茶、青柑普洱、黑乌龙。
- [可口可乐中国](https://www.coca-cola.com/cn/zh/brands/coca-cola)、[芬达](https://www.coca-cola.com/cn/zh/brands/fanta)、[美汁源](https://www.coca-cola.com/cn/zh/brands/minute-maid)：香草及蜜桃味可乐、芬达果味汽水、美汁源果粒橙与果汁气泡饮等。
- [益禾堂产品页](https://www.yihetang.com/product_list/1.html)：益禾烤奶、薄荷奶绿、禾风奶绿、益杯烧仙草、薄荷柠檬水等。
- [1点点产品页](https://www.alittle-tea.com/ourdrinks/milkteaseries/)：波霸奶茶、小珍珠奶茶、四季春珍波椰、布丁奶茶。
- [M Stand 产品页](https://mstand.cn/ProductInfoCategory?categoryId=575736)：燕麦曲奇拿铁、鲜椰冰咖等；[坚果拿铁](https://www.mstand.cn/productinfo/747735.html)、[太妃芝士奶咖](https://www.mstand.cn/productinfo/747738.html)。
- [书亦烧仙草产品页](https://www.shuyisxc.com/home/product/index/id/34.html)、[果茶页](https://shuyisxc.com/home/product/index/id/33.html)：生椰烧仙草、书亦烧仙草、橙漫山茶花、黑桑葚生椰莓莓等。
- [Tims 天好咖啡官网](https://www.timhortons.com.cn/home/mycoffee)：鲜萃咖啡。

通用饮品不冒充品牌在售商品：例如意式浓缩、可塔朵、金桔百香果茶、火龙果汁、姜汁汽水、黑豆豆浆、洛神花茶。它们按独立原料或制作方式区分，不通过冰/热、糖度或杯量复制条目。Manner、库迪等品牌在本轮没有找到足够明确的官方产品名称资料，因此没有擅自录入品牌款。

## 验证方式

运行 `node scripts/test-drink-expansion.cjs`，检查 ID、名称规范化去重、字段完整性、所有饮品可通过现有 `pickRecommendation` 抽中，并用固定种子完成全池与每个类别各 1000 次抽取。再运行 `pnpm run test:recommend` 和 `pnpm run build`。


固定种子 1000 次全池连续抽取：336/344 种被抽到，相邻与最近 5 次重复率均为 0%，高频前 10 种占 6.8%；星巴克 3.6%、瑞幸 3.3%、CoCo 3.1%，未见单一品牌霸榜。1000 次独立抽取覆盖 321/344 种，其中 172/190 种新增饮品出现。每个类别独立做 1000 次连续抽取，均覆盖本类全部候选。
