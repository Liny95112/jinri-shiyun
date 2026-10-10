export interface UpdateLogEntry {
  version: string
  date: string
  showPopup?: boolean
  sections: { title: string; items: string[] }[]
}

// Keep entries in step with CHANGELOG.md. Only showPopup: true announces an upgrade.
export const UPDATE_LOG: UpdateLogEntry[] = [
  {
    version: '0.8.0', date: '2026-10-10', showPopup: true,
    sections: [{ title: '今日菜单大扩容', items: [
      '新增大量日常美食、早点、小吃与甜品。',
      '增加更多咖啡、奶茶、果茶和传统饮品。',
      '加入霸王茶姬、星巴克、瑞幸、喜茶等常见品牌的代表选择。',
      '美食图鉴现在能翻到更多好吃好喝的啦。'
    ] }]
  },
  {
    version: '0.7.5', date: '2026-10-09', showPopup: false,
    sections: [{ title: '新增', items: [
      '接入匿名网站访问与核心功能使用统计。'
    ] }]
  },
  {
    version: '0.7.4', date: '2026-10-09', showPopup: false,
    sections: [
      { title: '修复', items: [
        '修复首页小猫走路时轮廓不完整的问题，左右走路改为四帧像素动作。',
        '待机帧改为完整图片交替显示。'
      ] },
      { title: '优化', items: [
        '小型修复版本不再自动弹出更新公告。'
      ] }
    ]
  },
  {
    version: '0.7.3', date: '2026-10-09', showPopup: false,
    sections: [{ title: '优化', items: [
      '首页小猫会在小食堂门前偶尔散步，在左、中、右三个位置停留。',
      '小猫换上独立的像素走路帧；减少动态效果时保持安静。'
    ] }]
  },
  {
    version: '0.7.2', date: '2026-10-09', showPopup: true,
    sections: [
      { title: '首页氛围升级', items: [
        '早晨、白天与夜晚的小食堂更有各自的光线和颜色；夜晚变成外冷内暖的深蓝街景。',
        '门帘和小猫有轻轻的待机动作，首页配色也更清爽。'
      ] },
      { title: '修复', items: [
        '修复小食堂画面左右露出白边的问题。'
      ] }
    ]
  },
  {
    version: '0.7.1', date: '2026-10-07', showPopup: true,
    sections: [{ title: '首页氛围升级', items: [
      '首页小食堂会根据本地时间展示早晨、白天或夜晚的像素风景。',
      '小店门帘加入轻量待机动作，夜晚的灯笼也会温柔亮起来。'
    ] }]
  },
  {
    version: '0.7.0', date: '2026-10-07', showPopup: true,
    sections: [{ title: '像素画风升级', items: [
      '首页小食堂换上正式像素美术。',
      '吃什么、喝什么入口重新设计，按钮和图标更像像素小游戏。',
      '喜好、最近吃喝、收藏与图鉴入口统一为像素图标。',
      '首页与今日食签的日式像素小店画风更加统一。'
    ] }]
  },
  {
    version: '0.6.1', date: '2026-10-07', showPopup: false,
    sections: [{ title: '优化', items: [
      '今日食签摇签升级为 6 张完整像素帧，并改为慢启动、快速摇动、自然减速。',
      '增加签筒下压预备动作，签纸改为分段整数像素弹出。',
      '三处星光依次闪现，食签结果按签运、今日宜、幸运吃喝、口味和食语逐段揭晓。'
    ] }]
  },
  {
    version: '0.6.0', date: '2026-10-07', showPopup: true,
    sections: [{ title: '像素画风升级', items: [
      '今日食签换上全新正式像素美术。',
      '新增像素签筒与抽签动画。',
      '食签结果卡视觉升级。',
      '开始建立统一的《今日食运》像素画风。'
    ] }]
  },
  {
    version: '0.5.1', date: '2026-10-07', showPopup: false,
    sections: [{ title: '优化', items: [
      '优化版本更新提示，仅在升级后首次打开时显示。',
      '更新公告不再常驻首页。',
      '首页界面更加简洁，弹窗直接展示本次变化。'
    ] }]
  },
  {
    version: '0.5.0', date: '2026-10-07', showPopup: true,
    sections: [
      { title: '新增', items: [
        '新增每日「今日食签」提醒。',
        '新增「更新公告」页面与首页入口。',
        '新版本首次打开时可查看本次更新内容。'
      ] },
      { title: '优化', items: [
        '新的一天会提醒尚未领取今日食签的用户。',
        '选择“稍后再说”后，当天不再重复提醒。'
      ] }
    ]
  },
  {
    version: '0.4.1', date: '2026-10-06', showPopup: false,
    sections: [{ title: '修复', items: [
      '修复进入“美食图鉴”时可能继承上一页面滚动位置、停留在页面中部或底部的问题。',
      '修复进入“我的喜好”时可能继承上一页面滚动位置的问题。'
    ] }]
  },
  {
    version: '0.4.0', date: '2026-10-06', showPopup: true,
    sections: [{ title: '新增', items: [
      '新增像素风「今日食签」，每天按设备本地日期领取一张固定食签，并提供轻量抽签揭晓动画。',
      '新增大吉、中吉、小吉、吉、平五种正向签运，以及幸运食物、饮品、口味、今日宜和今日食语。',
      '幸运吃喝复用现有加权推荐，抽签时忽略当前时段偏向；可进入原结果确认流程并记入最近吃喝。',
      '食签保存在现有本地数据中，旧版喜好、收藏、历史和推荐记录保持兼容。'
    ] }]
  },
  {
    version: '0.3.1', date: '2026-10-06', showPopup: false,
    sections: [{ title: '优化', items: [
      '完善“今天吃什么”的心情选项，加入压力大、没胃口、嘴馋了、随便啦，并将“想吃好的”整理为“犒劳自己”。',
      '根据现有类别、口味、预算、心情和标签细化不同心情的推荐权重；“随便啦”不施加心情权重。',
      '心情按钮在手机上按三列显示，保留旧版心情值与已有本地数据兼容。'
    ] }]
  },
  {
    version: '0.3.0', date: '2026-10-05', showPopup: true,
    sections: [{ title: '新增与优化', items: [
      '新增按设备本地时间段调整权重的智能推荐，并在首页与结果页显示轻量提示。',
      '根据最近吃喝记录自动降权，并在当前抽取会话中降低重复结果概率。',
      '“今天不想”沿用现有本地记录，当天大幅降权、跨天自动清理；永久不喜欢仍直接排除。',
      '美食图鉴抽取与首页共用加权推荐逻辑，始终限定在当前筛选结果内。',
      '开发环境可在控制台查看排名靠前的候选分数。'
    ] }]
  },
  {
    version: '0.2.0', date: '2026-10-05', showPopup: true,
    sections: [{ title: '新增', items: [
      '新增美食图鉴，直接展示现有全部食品与饮品。',
      '支持名称实时搜索、按现有分类和标签筛选，并显示当前结果数量。',
      '可在图鉴中收藏、标记喜欢或不喜欢，状态与原有页面同步。',
      '可从当前筛选结果中随机抽取，复用抽取动画，并将确认结果记入最近吃喝。'
    ] }]
  },
  {
    version: '0.1.0', date: '2026-10-05', showPopup: false,
    sections: [{ title: '基础版本', items: [
      '建立统一应用版本号，并在首页底部显示。',
      '当前测试版包含吃喝筛选、抽取推荐、喜好、历史、收藏和 PWA 离线访问。',
      '内置 161 种食物、88 种饮品。'
    ] }]
  }
]

/** Only explicitly highlighted releases may open an update notice. */
export function shouldShowUpdatePopup(version: string, lastSeenVersion?: string, entries: readonly UpdateLogEntry[] = UPDATE_LOG): boolean {
  return lastSeenVersion !== version && entries.some(entry => entry.version === version && entry.showPopup === true)
}
