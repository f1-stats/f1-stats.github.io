# F1 Stats

F1 Stats 是一个支持英文和中文的 Formula 1 数据与工具网站，展示 2026 赛季积分榜、赛程与比赛结果，并提供车手/车队对比和实用计算器。

## 功能

- 车手和车队积分榜及详情页
- 赛历、周末赛程、排位赛、冲刺赛和正赛结果
- 排位圈速图、单场正赛积分图和车手赛季积分图
- 车手与车队对比；车手和车队的逐站冠军形势模拟
- 正赛积分、圈速差和进站策略计算器
- 桌面与手机布局，界面支持英文和中文
- 自动生成 sitemap，并部署到 GitHub Pages

## 技术栈

- Next.js 15、React 19、TypeScript
- Tailwind CSS 4、Lucide React
- GitHub Pages 静态导出
- 比赛数据来自 Jolpica F1 API，作为 JSON 快照保存在 `data/`

## 本地开发

需要 Node.js 20 或兼容版本。

```sh
npm install
npm run dev
```

开发服务器默认运行在 <http://localhost:3000>。

## 构建与部署

```sh
npm run build
```

Next.js 静态导出生成在 `out/`。GitHub Actions 工作流 `.github/workflows/pages.yml` 会在推送到 `main` 或手动触发时安装依赖、构建并部署到 GitHub Pages。

## 页面路由

| 路由 | 内容 |
| --- | --- |
| `/` | 首页、积分榜摘要和最近/下一场比赛 |
| `/drivers`、`/drivers/[driverId]` | 车手列表与赛季详情 |
| `/teams`、`/teams/[teamId]` | 车队列表与车队详情 |
| `/races`、`/races/[round]` | 赛历与比赛周末详情 |
| `/compare` | 车手/车队对比和冠军情景模拟 |
| `/tools` | 计算器目录 |
| `/tools/points-calculator` | 正赛和冲刺赛积分计算器 |
| `/tools/lap-time-calculator` | 圈速差计算器 |
| `/tools/pit-stop-calculator` | 进站策略计算器 |
| `/policy` | 隐私政策 |

## 数据

页面使用仓库中的静态 JSON 数据，不会在每次访问时实时请求外部 API。数据读取逻辑位于 `lib/f1.ts`，数据快照和来源/更新时间元数据位于 `data/`。更新赛季数据时，需一并更新相应 JSON 文件和 `data/meta.json`。
