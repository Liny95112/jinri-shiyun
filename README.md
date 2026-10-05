# 今日食运

手机端优先的像素风吃喝决定器。React + Vite + TypeScript + Tailwind CSS + Framer Motion；无账号、无后端，喜好与历史保存在浏览器 localStorage。

## 启动

需要 Node.js 20.19+。在本目录执行：

```bash
pnpm install
pnpm start
```

打开终端显示的本地地址。`pnpm start` 会先检查类型并构建，再启动本地预览。开发时需要热更新，可运行 `pnpm dev`。当前受限 Windows 环境中的 Vite 依赖预打包遇到 esbuild 文件访问限制，使用 `pnpm start` 可正常运行。生产构建：

```bash
pnpm build
pnpm preview
```

手机上测试 PWA 时，可将构建结果部署到 HTTPS 域名；localhost 也支持 Service Worker。浏览器菜单中选择“添加到主屏幕”。首次访问后，静态资源可离线打开。数据仅保存在当前浏览器；清除站点数据会清除喜好、收藏和历史。

## 发布到 GitHub Pages

将本项目文件上传到 GitHub 仓库的 `main` 分支，然后在仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。仓库里的 `.github/workflows/deploy.yml` 会在每次推送时安装依赖、构建并发布 `dist`。普通仓库的地址是 `https://用户名.github.io/仓库名/`；若仓库名为 `用户名.github.io`，地址位于域名根目录。构建脚本会自动调整 Vite 和 PWA 的路径。

如使用其他静态托管平台，可直接上传 `dist` 文件夹里的所有文件到站点根目录，或将仓库作为 Vite 项目构建（构建命令 `pnpm build`，发布目录 `dist`）。

## 页面与数据

- 首页：吃 / 喝入口，以及喜好、历史和收藏。
- 筛选页：食物和饮品各有独立条件；上次条件会保留。
- 抽取页：约 2.5 秒滚动动画，支持减少动态效果设置。
- 结果页：确认、换一个、拒绝理由、收藏。
- 我的喜好：添加文字偏好，或给常见选项点喜欢 / 不喜欢。
- 最近吃喝：确认选择后的记录；“最近刚吃过 / 喝过”会补一条手动记录。
- 收藏：保存喜欢的结果，并可直接决定今天选它。

`src/data/items.ts` 是内置候选目录。`src/lib/recommend.ts` 负责加权随机：优先匹配筛选条件，增加喜欢、心情与久未出现的分数，降低最近记录与重复抽中的分数，并排除明确不喜欢及今天拒绝的选项。条件冲突时会逐步放宽筛选，并在推荐理由中说明。

`src/lib/storage.ts` 统一读写 `jinri-shiyun:v1`，并给损坏或旧格式数据提供默认值。候选数据、推荐逻辑和存储已分离，后续可增加候选、调整权重，或迁移到云端同步。
