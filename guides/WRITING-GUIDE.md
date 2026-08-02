# 写作规范

本文档定义了项目复盘系统的内容组织规则，人和 AI 共同遵守。

---

## 一、目录结构

```
content/
├── retros/                    # 项目复盘
│   ├── _template/             # 模板（不要修改）
│   └── {year}/
│       └── {project-slug}/    # 项目文件夹
│           ├── index.mdx      # [必须] 项目主页
│           ├── logs/          # [选填] 里程碑记录
│           │   └── YYYY-MM-DD-标题.mdx
│           ├── decisions.mdx  # [选填] 技术决策
│           └── ai-collaboration.mdx  # [选填] AI协作详情
└── pitfalls/                  # 踩坑记录
    ├── _template.mdx          # 模板（不要修改）
    └── {year}/
        └── YYYY-MM-DD-问题简述.mdx
```

## 二、文件命名规则

### 项目文件夹（retros）
- 使用小写英文 + 连字符：`rag-chatbot`、`todo-app`、`blog-system`
- 简洁但能识别：不要用 `project-1`、`test` 这种无意义名称
- 年份目录：`2026/`、`2027/`

### 里程碑文件（logs/）
- 格式：`YYYY-MM-DD-简短标题.mdx`
- 示例：`2026-07-10-rag管道完成.mdx`
- 标题可用中文，日期必须在前

### 踩坑文件（pitfalls）
- 格式：`YYYY-MM-DD-问题简述.mdx`
- 示例：`2026-08-01-cuda-install-error.mdx`
- 问题简述用英文小写连字符（便于文件系统兼容）

## 三、Frontmatter 字段说明

### 项目主页 (index.mdx)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 项目名称 |
| date | date | 是 | 首次复盘日期 |
| period | string | 否 | 项目时间跨度 |
| status | enum | 是 | ongoing / completed / abandoned |
| tags | array | 是 | 至少1个标签 |
| template_version | number | 是 | 当前为 1 |
| summary | string | 是 | 一句话总结 |
| highlight | string | 否 | 最大收获 |
| understanding_score | number | 否 | 1-5 整数 |
| review_after | date | 否 | 建议回顾日期 |
| repo | string | 否 | GitHub 仓库 URL |
| commits | array | 否 | [{hash, note}] |
| prs | array | 否 | PR URL 列表 |
| sub_docs | array | 否 | [{file, title}] |

### 踩坑记录 (pitfalls)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 问题简述 |
| date | date | 是 | 记录日期 |
| tags | array | 是 | 至少1个标签 |
| severity | enum | 否 | low / medium / high |
| related_project | string | 否 | 关联项目 slug |
| resolved | boolean | 是 | 是否已解决 |

## 四、操作流程

### 新增项目复盘

1. 在 `content/retros/{year}/` 下创建项目文件夹
2. 复制 `_template/index.mdx` 到项目文件夹
3. 用 AI 或手动填写内容
4. 如有里程碑，创建 `logs/` 目录并添加记录
5. 如有子文档，在 index.mdx 的 `sub_docs` 中声明

### 新增踩坑记录

1. 在 `content/pitfalls/{year}/` 下创建 .mdx 文件
2. 参照 `_template.mdx` 格式填写
3. 如与某项目相关，填写 `related_project` 字段

### 更新已有项目

- 新增里程碑：在 `logs/` 下添加文件
- 修改状态：更新 index.mdx 的 `status` 字段
- 补充子文档：添加文件并更新 `sub_docs`

## 五、标签使用建议

- 使用小写英文：`python`、`langchain`、`docker`
- 框架/库用全名：`langchain`、`fastapi`、`next.js`
- 领域标签：`rag`、`llm`、`cv`、`devops`
- 问题类型：`环境配置`、`权限问题`、`版本兼容`
- 不要过于细碎：不需要 `python-3.11`，用 `python` 即可

## 六、模板版本

- 当前版本：`template_version: 1`
- 模板升级时，旧文件无需修改，前端兼容渲染
- 新版本模板会更新 `_template/` 目录和本文档
