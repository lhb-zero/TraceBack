# AI 复盘生成 Prompt

## 使用方法（vibecoding 场景）

1. 在 vibecoding 工具（Claude Code / Cursor / 任意带文件系统能力的 AI）中**打开要复盘的真实项目**
2. 把下方 **[Prompt 正文]** 发给 LLM（不需要提前填项目信息，它会自己读）
3. LLM 会：读取项目 → 自主判断输出哪些文件 → 在当前目录直接创建文件
4. 把生成的项目文件夹（`content/retros/{year}/{slug}/`）**整个复制**到 TraceBack 项目的 `content/retros/{year}/` 下
5. 补充"我学到了什么"的真实感受（AI 无法替你写）
6. 把复制好的路径交给小小冰 → 规范校验 → 渲染验证 → 提交私有仓库

> 设计原则：Prompt 为纯自然语言，不绑定任何 AI 平台的工具调用语法（换工具不废）。
> 生成位置固定在"当前工作目录"，不写绝对路径——复制到 TraceBack 时自然兼容。

---

## Prompt 正文

```
你是一个项目复盘助手。你的任务是对当前项目做一次全面复盘，并生成结构化复盘文档。

## 第一步：全面读取项目（主动考古，不要等我给信息）

动手写任何内容之前，先完整了解项目：
- 目录结构：查看目录树，识别主要模块与职责
- git 历史：查看 git log，梳理提交数量、时间线、关键提交（用 commit message 判断阶段性里程碑）
- README / 文档：项目定位、使用方式
- 代码抽样：入口文件、核心模块、关键实现思路
- 依赖清单：package.json / requirements.txt / pom.xml 等，确认技术栈与版本
- 某维度确实读不到时，标注 [信息不足]，不要编造

## 第二步：自主判断要生成哪些文件

不是所有文件都要生成，按项目实际情况取舍：
- index.mdx 【必建】项目复盘主页（五维度）
- logs/ 里程碑记录 【按需】git log 能看出明显阶段（如 基础搭建→核心功能→上线）时，每个阶段一条
- decisions.mdx 【按需】有值得记录的技术选型决策（"为什么选 A 不选 B"）时
- ai-collaboration.mdx 【按需】AI 参与开发的内容丰富时
- 踩坑记录 【按需，分两类，位置不同】：
  - **通用坑**（跨项目可复用：环境配置、依赖升级、库 API 变化、接口调试、常见框架坑）→ 生成到 `content/pitfalls/{year}/YYYY-MM-DD-问题简述.mdx`（独立文件，问题简述用英文小写连字符；frontmatter 含 severity/related_project/resolved）
  - **项目专属坑**（依赖项目特定架构/模板上下文才能看懂：如本项目表格提取的坐标调优）→ 追加到项目文件夹内 `pitfalls.mdx`（并在 index.mdx 的 sub_docs 声明）

## 第三步：直接创建文件

如果你有文件系统能力，在当前工作目录下直接创建：

  content/retros/{year}/{项目slug}/

- {year}：项目主要年份（四位数字）
- {项目slug}：小写英文 + 连字符（如 rag-chatbot）
- 文件名规范：index.mdx / logs/YYYY-MM-DD-简短标题.mdx / decisions.mdx / ai-collaboration.mdx
- 如果没有文件系统能力，则输出所有文件的完整内容，并在开头注明每个文件的路径

## 输出规范

### index.mdx 的 frontmatter（必填字段）

  title: "项目名称"
  date: YYYY-MM-DD
  period: "起始 ~ 结束"
  status: ongoing | completed | abandoned
  tags: [小写英文标签]
  template_version: 1
  summary: "一句话总结"
  highlight: "最大收获"        # 可选
  understanding_score: 1-5     # 可选
  review_after: YYYY-MM-DD     # 可选，建议回顾日期
  repo: "GitHub 仓库 URL"      # 可选
  commits: [{hash, note}]      # 可选，真实 commit
  prs: []                      # 可选
  sub_docs: [{file, title}]    # 生成了子文档时必填声明

### 正文五个二级标题（index.mdx）

## 项目概述
## 技术要点
## AI 协作记录
## 踩坑与解决
## 我学到了什么

## 硬性约束

1. 全部使用中文输出
2. 信息不足的部分标注 [信息不足]，不要编造
3. 不要写空话套话，每句话要有具体信息量
4. 技术描述要具体到工具名、版本号、具体做法
5. AI 协作部分要具体到"AI 生成了什么 → 我改了什么 → 为什么改"
6. "我学到了什么"部分用第一人称，语气自然，像写给自己的笔记
7. commit hash、PR 链接必须是项目真实存在的，填进 frontmatter 对应字段
8. 生成完成后自检：必填字段齐全、枚举值合法、五个二级标题齐全、有子文档时 sub_docs 已声明

## 项目信息（可选补充）

以下信息是代码里读不到的，你能拿到多少填多少；拿不到就直接开始，不要等：
- 时间周期：
- 项目状态（进行中/已完成/已废弃）：
- AI 参与开发的背景（哪些部分是你和 AI 协作完成的）：
- 你个人最大的收获（AI 无法替你写这个，生成后请自己补充到"我学到了什么"）：
```

---

## 历史版本

### v1（2026-08-01，已废弃）

第一版只生成单个 index.mdx 文本、依赖用户手工填项目信息，未利用 AI 读取项目与创建文件的能力。保留存档：

```
你是一个项目复盘助手。你的任务是根据我提供的项目信息，生成一份结构化的项目复盘文档。
（略，完整 v1 见 git 历史：2026-08-05 之前的 guides/AI-PROMPT.md）
```


