# Kevin Woo剑指Offer

<p align="center">
  <img src="./docs/public/logo.svg" width="96" alt="剑指Offer Logo" />
</p>

<p align="center">
  <strong>面向前端面试、工程实践与知识体系沉淀的 Rspress 文档站</strong>
</p>

<p align="center">
  <a href="https://github.com/moxiaonai/febook"><img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-moxiaonai%2Ffebook-181717?logo=github" /></a>
  <img alt="Rspress" src="https://img.shields.io/badge/Rspress-1.47.2-3b82f6" />
  <img alt="Copyright" src="https://img.shields.io/badge/Copyright-2026%20Kevin%20Woo-blue" />
</p>

---

## 项目简介

**Kevin Woo剑指Offer** 是一个基于 **Rspress** 构建的前端知识库与面试复盘站点。它围绕前端工程化、Vue、React、TypeScript、JavaScript、HTML & CSS、算法与面试专题进行系统整理，目标是把零散知识沉淀成一套可以长期维护、快速检索、反复复习的个人知识体系。

这个站点既适合作为面试前的复习手册，也适合作为日常学习中的技术笔记库。内容会持续补充，后续还会加入 Kevin Woo 的真实项目实践、源码阅读记录和专题复盘。

## 站点亮点

- **面试导向**：围绕高频前端问题、算法笔试和面试表达进行整理。
- **体系化沉淀**：按工程化、框架、语言基础、CSS、算法、面试等维度组织内容。
- **阅读体验优化**：定制首页视觉、导航透明渐变、暗黑模式、文章目录和代码行号。
- **Rspress 驱动**：使用轻量、快速的文档框架，支持 Markdown / MDX 编写。
- **可持续扩展**：项目区当前为占位结构，后续可逐步替换为真实项目卡片。

## 内容导航

当前站点主要包含以下内容板块：

| 板块 | 内容说明 |
| --- | --- |
| 前端工程化 | Webpack、模块化、包管理、性能优化、CSS 工程化等 |
| Vue.js | Vue 响应式、组件通信、生命周期、Diff、Vue Router、Vuex 等 |
| React | Fiber、Hooks、Redux、路由、组件通信、渲染机制等 |
| TypeScript | TS 基础、类型系统、泛型、类型推导与实践 |
| 前端三件套 | JavaScript、HTML、CSS、异步处理、代理与反射、迭代器等 |
| 知识碎片 | 实用代码片段、工程技巧、浏览器机制、工具函数等 |
| 算法 | 高频算法题、刷题思路、复杂度分析 |
| 面试 | 面试题、算法笔试、模拟面试专题与回答思路 |

## 技术栈

- [Rspress](https://rspress.rs/)：文档站点框架
- Markdown / MDX：内容编写
- TypeScript：配置与工程能力
- CSS：自定义主题样式、首页视觉、暗黑模式适配
- pnpm：包管理

## 快速开始

> 如果你已经在本地装好依赖，可以直接运行开发或构建命令。首次克隆项目时再执行安装即可。

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 生产构建
pnpm build

# 本地预览构建产物
pnpm preview
```

默认开发服务会以 `0.0.0.0` 启动，方便在局域网或容器环境中访问。

## 项目结构

```text
.
├── .rspress/                 # Rspress 导航与侧边栏配置
│   ├── defaultSidebar.ts      # 主导航 / 侧边栏入口
│   ├── engineer.ts            # 前端工程化目录
│   ├── fragment.ts            # 知识碎片目录
│   ├── hc.ts                  # HTML & CSS 目录
│   ├── mock.ts                # 面试模拟目录
│   ├── react.ts               # React 目录
│   └── vue.ts                 # Vue 目录
├── docs/                      # 文档内容
│   ├── index.md               # 首页
│   ├── getting-started.mdx    # 项目区占位页
│   ├── front-end-engineering/ # 前端工程化
│   ├── vue/                   # Vue 专题
│   ├── react/                 # React 专题
│   ├── js/                    # JavaScript 专题
│   ├── ts/                    # TypeScript 专题
│   ├── html-css/              # HTML & CSS 专题
│   ├── fragment/              # 知识碎片
│   ├── algorithm/             # 算法内容
│   └── interview/             # 面试内容
├── styles/index.css           # 全局样式与主题定制
├── rspress.config.ts          # Rspress 配置
├── package.json               # 项目脚本与依赖
└── TODO.md                    # 后续内容规划
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务 |
| `pnpm build` | 构建生产产物，输出到 `doc_build/` |
| `pnpm preview` | 本地预览生产构建结果 |

## 部署说明

项目的 Rspress 配置使用：

```ts
base: '/'
```

因此部署到 `fe.fenewbee.com` 后可以直接从域名根路径访问。构建产物输出到 `doc_build/`，可部署到 Cloudflare Pages、GitHub Pages、静态服务器或其他静态托管平台。

如果后续要部署到子路径，可以根据目标访问路径调整 `rspress.config.ts` 中的 `base` 配置。

## 个性化配置

站点身份信息集中在 [rspress.config.ts](./rspress.config.ts)：

- 站点标题：`Kevin Woo剑指Offer`
- Logo 文案：`剑指Offer`
- GitHub 入口：`https://github.com/moxiaonai`
- 页脚版权：`Copyright © 2026 Kevin Woo`

首页内容位于 [docs/index.md](./docs/index.md)，项目占位页位于 [docs/getting-started.mdx](./docs/getting-started.mdx)。

## 后续规划

- [ ] 补充 Kevin Woo 的真实项目列表和项目卡片
- [ ] 为高频面试题增加更清晰的回答模板
- [ ] 按难度和场景整理算法专题
- [ ] 补充更多源码阅读笔记
- [ ] 增加部署流程说明和自动化发布方案
- [ ] 持续优化暗黑模式和移动端阅读体验

## 适合谁阅读

- 正在准备前端面试，希望系统复习知识点的人
- 想梳理 Vue / React / TypeScript / 工程化知识体系的人
- 需要一个长期维护的个人技术知识库的人
- 希望把碎片化学习内容沉淀为文档站的人

## 维护者

**Kevin Woo**

- GitHub: [moxiaonai](https://github.com/moxiaonai)
- Repository: [moxiaonai/febook](https://github.com/moxiaonai/febook)

## 版权

Copyright © 2026 Kevin Woo.

