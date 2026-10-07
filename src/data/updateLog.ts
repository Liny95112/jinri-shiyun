export interface UpdateLogEntry {
  version: string
  date: string
  showPopup: boolean
  sections: { title: string; items: string[] }[]
}

// Keep these entries in step with CHANGELOG.md. Only highlighted releases open a popup.
export const UPDATE_LOG: UpdateLogEntry[] = [
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
    version: '0.4.0', date: '2026-10-06', showPopup: false,
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
    version: '0.3.0', date: '2026-10-05', showPopup: false,
    sections: [{ title: '新增与优化', items: [
      '新增按设备本地时间段调整权重的智能推荐，并在首页与结果页显示轻量提示。',
      '根据最近吃喝记录自动降权，并在当前抽取会话中降低重复结果概率。',
      '“今天不想”沿用现有本地记录，当天大幅降权、跨天自动清理；永久不喜欢仍直接排除。',
      '美食图鉴抽取与首页共用加权推荐逻辑，始终限定在当前筛选结果内。',
      '开发环境可在控制台查看排名靠前的候选分数。'
    ] }]
  },
  {
    version: '0.2.0', date: '2026-10-05', showPopup: false,
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
