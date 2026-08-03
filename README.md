# TraceBack · 项目复盘系统

个人开发者专用的项目复盘与技术成长追踪系统。

做完项目用 AI 生成结构化复盘并归档；几个月后回来快速回忆项目全貌；遇到类似问题时搜索历史踩坑记录。内容全部以标准 MDX 纯文本存储，任何编辑器可打开，不依赖任何运行时服务。

## 特性

- **结构化复盘**：项目五维度（项目概述 / 技术要点 / AI 协作记录 / 踩坑与解决 / 我学到了什么）+ 里程碑记录 + 技术决策（ADR-lite）+ AI 协作深度记录
- **独立踩坑库**：技术问题独立收录（问题现象 → 环境 → 排查过程 → 根因 → 解决方案 → 预防），与项目无关的坑也能归档和搜索
- **三种内容浏览方式**：
  - 时间线（首页，按年份浏览）
  - 全文搜索（Fuse.js 加权：标题 3 > 标签 2 > 摘要 1.5 > 正文 1，含搜索历史）
  - 标签主题聚合（同一标签下的复盘 + 踩坑聚在一起）
- **前端快速编辑**：理解度、项目状态、回顾状态等元数据在详情页直接修改（本地 dev，PATCH API 写回 `.mdx` frontmatter，无需手改文件）
- **待回顾闭环**：设置回顾日期 → 到期首页提醒 → 标记已回顾自动退出并清空日期
- **纯文本原则**：内容为标准 MDX（YAML frontmatter + Markdown），核心依赖仅 4 个（next / tailwind / fuse.js / gray-matter），最坏情况换框架零迁移成本

## 技术栈

Next.js 16（App Router，页面 SSG）· React 19 · TypeScript · Tailwind CSS 4 · gray-matter · next-mdx-remote · fuse.js

## 快速开始

```bash
npm install
npm run dev      # 开发：http://localhost:3000
npm run build    # 构建（先生成搜索索引，再 next build）
```

## 目录结构

```
content/
├── retros/{year}/{slug}/   # 项目复盘（文件夹制：index.mdx + logs/ + decisions.mdx + ai-collaboration.mdx）
└── pitfalls/{year}/        # 踩坑记录（单文件制：YYYY-MM-DD-简述.mdx）

guides/                     # 系统操作指南（AI-PROMPT / WRITING-GUIDE / UI-DESIGN-PROMPT）
src/app/                    # 页面与 API（App Router）
scripts/                    # 构建脚本（搜索索引生成）
```

## 内容说明

`content/` 中的内容为示例数据，仅用于演示。直接删除 `content/` 下的示例目录即可开始记录自己的项目；写作规范见 `guides/WRITING-GUIDE.md`，AI 复盘生成模板见 `guides/AI-PROMPT.md`。
