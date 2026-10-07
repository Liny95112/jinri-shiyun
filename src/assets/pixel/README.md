# 今日食运 · 像素美术规范（第一阶段）

画风：温暖的日式街角小食堂。第一批素材使用受限的 SNES 风格、右上方光源、深棕描边。中文内容由 HTML 文字负责，图片不承载关键文字。

## 规格

- 基础逻辑网格：16×16；图标 32×32；签筒和签纸 64×64。
- 资源格式：透明 PNG，alpha 只能是 0 或 255，不能有抗锯齿。
- 页面中的 Sprite 仅以原尺寸或 2、3、4 倍整数尺寸显示，并使用 `image-rendering: pixelated`。
- 每张图片优先不超过 10 色；全局共享 16 色。新增素材先修改生成脚本中的锁定色板，再逐张运行 Skill 的 `quality_audit.py`。
- 动画使用独立帧硬切换、`steps()` 和整数像素位移。保持无障碍的减少动态效果设置。

## 锁定色板

| 用途 | 颜色 |
| --- | --- |
| 描边 | `#3F302D` |
| 木质阴影、木棕、浅木 | `#6A4539`、`#8F5B4A`、`#E3B990` |
| 奶油白、签纸、纸张阴影 | `#FFF7E7`、`#F7E5C5`、`#D9C49C` |
| 灯笼红、夕阳橙、柔粉 | `#BF5F4E`、`#D88B58`、`#E7A1A1` |
| 抹茶深绿、浅绿 | `#78946C`、`#9FBE91` |
| 冰蓝、浅冰蓝 | `#88B5BC`、`#CEE7E5` |
| 金色、可可棕 | `#EFC56D`、`#A06D52` |

## 目录

- `fortune/`：签筒待机帧与 6 张摇签帧、签纸、通用签运徽章。签筒每帧 64×64；签运文字由 HTML 显示。
- `fx/`：16×16 闪光 3 帧。
- `food/`：32×32 拉面、寿司样板。
- `drink/`：32×32 奶茶、咖啡样板。
- `home/`：0.7.0 首页小食堂主视觉、吃喝入口图标与四个辅助 UI 图标。

运行 `python scripts/generate-pixel-fortune.py` 可复现这批 PNG；网页构建不需要 Python。后续扩充食品图标前，先沿用这套规格和色板。

## 0.6.1 抽签帧与节奏

- `fortune_jar_idle.png` 是中位；`fortune_jar_shake_01` / `02` 为轻左 / 深左，`03` 为中位签条摆动，`04` / `05` 为深右 / 轻右，`06` 为回中签条摆动。
- 播放顺序与每姿势持续时间写在 `DailyFortunePage.tsx` 的 `shakeSequence`，总摇签时间 1,250ms；之后下压 2px 持续 80ms。
- 签纸是原有 `fortune_paper.png`，用 430ms 的整数像素阶梯位移弹出；三处星光错开 85ms，各自切换现有 3 帧。
- 可用 `python scripts/generate-pixel-fortune.py --asset fortune_jar_shake_04.png` 单独重制一张，再立即用 `pixel-art` Skill 审计。

## 0.7.0 首页素材

| 文件 | 原始尺寸 | 用途与缩放 |
| --- | --- | --- |
| `home/home_shop.png` | 160×96 | 日式街角小食堂；常规手机 2 倍、窄屏 1 倍；不拉伸 |
| `home/home_food_icon.png` | 32×32 | “今天吃什么”饭碗；原尺寸显示 |
| `home/home_drink_icon.png` | 32×32 | “今天喝什么”中性饮品杯；原尺寸显示 |
| `home/icon_heart.png` | 16×16 | 我的喜好；2 倍显示 |
| `home/icon_history.png` | 16×16 | 最近吃喝；2 倍显示 |
| `home/icon_favorite.png` | 16×16 | 收藏结果；2 倍显示 |
| `home/icon_dex.png` | 16×16 | 美食图鉴；2 倍显示 |

小店画面包含木质店面、暖帘、灯笼、出餐窗、菜单牌与盆栽，保持静态。以上 7 张 PNG 与食签素材共享原有 16 色锁定色板、深棕描边与右上方光源；没有半透明边缘，图片统一使用 `image-rendering: pixelated`。用 `python scripts/generate-pixel-home.py --asset home_shop.png` 等命令可逐张重制并审计。
