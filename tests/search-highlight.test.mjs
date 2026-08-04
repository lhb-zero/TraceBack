import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeRegExp, queryTerms, makeSnippet, splitHighlight } from "../src/lib/search-highlight.ts";

test("queryTerms 拆分、去重、小写", () => {
  assert.deepEqual(queryTerms("  Python  RAG  python "), ["python", "rag"]);
  assert.deepEqual(queryTerms("   "), []);
});

test("escapeRegExp 转义正则元字符", () => {
  assert.equal(escapeRegExp("a.b"), "a\\.b");
  assert.equal(escapeRegExp("(x)"), "\\(x\\)");
  assert.equal(escapeRegExp("a+b"), "a\\+b");
});

test("splitHighlight 标记全部命中（大小写不敏感）", () => {
  const segs = splitHighlight("Python 与 RAG 的 python 实践", ["python"]);
  const hits = segs.filter((s) => s.hit).map((s) => s.part);
  assert.deepEqual(hits, ["Python", "python"]);
  // 无损拼接（原文大小写保留）
  assert.equal(segs.map((s) => s.part).join(""), "Python 与 RAG 的 python 实践");
});

test("splitHighlight 多词命中", () => {
  const segs = splitHighlight("搜索 RAG 项目里的部署问题", ["rag", "部署"]);
  assert.deepEqual(segs.filter((s) => s.hit).map((s) => s.part), ["RAG", "部署"]);
});

test("splitHighlight 空 terms 或空文本原样返回", () => {
  assert.deepEqual(splitHighlight("hello", []), [{ part: "hello", hit: false }]);
  assert.deepEqual(splitHighlight("", ["x"]), [{ part: "", hit: false }]);
});

test("splitHighlight 无命中时单段", () => {
  assert.deepEqual(splitHighlight("没有命中", ["zzz"]), [{ part: "没有命中", hit: false }]);
});

test("makeSnippet 短文本不截断", () => {
  assert.equal(makeSnippet("短文本", ["x"]), "短文本");
});

test("makeSnippet 无命中时从头截断并加省略号", () => {
  const long = "a".repeat(200);
  const s = makeSnippet(long, ["zzz"]);
  assert.equal(s.length, 121);
  assert.ok(s.endsWith("…"));
});

test("makeSnippet 命中在深处时围绕命中截断", () => {
  const text = "a".repeat(100) + "关键命中" + "b".repeat(100);
  const s = makeSnippet(text, ["关键命中"]);
  assert.ok(s.includes("关键命中"));
  assert.ok(s.startsWith("…"));
  assert.ok(s.endsWith("…"));
  // 120 内容 + 前后省略号
  assert.equal(s.length, 122);
});
