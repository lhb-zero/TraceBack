import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import { updateFrontmatter } from "../src/lib/write.ts";

/** Create a temp content dir with one realistic MDX file (special chars, Chinese, code). */
function makeFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "traceback-write-test-"));
  const mdx = `---
title: 测试项目
date: 2026-08-05
tags:
  - python
  - 部署
status: ongoing
---

## 技术要点

正文含 <10万条 比较符号与 \`inline code\`，以及中文内容。
`;
  fs.mkdirSync(path.join(dir, "retros", "2026", "demo"), { recursive: true });
  fs.writeFileSync(path.join(dir, "retros", "2026", "demo", "index.mdx"), mdx, "utf-8");
  return dir;
}

test("updateFrontmatter 更新字段并原样保留正文", () => {
  const dir = makeFixture();
  const rel = path.join("retros", "2026", "demo", "index.mdx");
  const ok = updateFrontmatter(rel, { status: "completed", understanding_score: 4 }, dir);
  assert.equal(ok, true);
  const after = fs.readFileSync(path.join(dir, rel), "utf-8");
  assert.match(after, /^status: completed/m);
  assert.match(after, /^understanding_score: 4/m);
  // 正文逐字保留（含 < 符号与中文）
  assert.ok(after.includes("正文含 <10万条 比较符号与 `inline code`，以及中文内容。"));
  fs.rmSync(dir, { recursive: true, force: true });
});

test("updateFrontmatter 文件不存在返回 false", () => {
  const dir = makeFixture();
  const ok = updateFrontmatter(path.join("retros", "2026", "nope", "index.mdx"), { status: "completed" }, dir);
  assert.equal(ok, false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("updateFrontmatter 数组/日期字段 roundtrip 后可被 gray-matter 重新解析", () => {
  const dir = makeFixture();
  const rel = path.join("retros", "2026", "demo", "index.mdx");
  updateFrontmatter(rel, { tags: ["python", "部署", "上线"], review_after: "2026-09-01" }, dir);
  const raw = fs.readFileSync(path.join(dir, rel), "utf-8");
  const { data, content } = matter(raw);
  assert.deepEqual(data.tags, ["python", "部署", "上线"]);
  assert.equal(data.review_after, "2026-09-01");
  assert.equal(data.status, "ongoing"); // 未更新的字段保留
  assert.ok(content.includes("正文含"));
  fs.rmSync(dir, { recursive: true, force: true });
});
