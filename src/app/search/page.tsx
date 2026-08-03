"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

interface SearchEntry {
  type: "retro" | "pitfall";
  slug: string;
  year: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
  date: string;
  status?: string;
  severity?: string;
  resolved?: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "retro" | "pitfall">("all");
  const [index, setIndex] = useState<SearchEntry[]>([]);

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data) => setIndex(data))
      .catch(() => setIndex([]));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "summary", weight: 1.5 },
          { name: "content", weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [index]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const raw = fuse.search(query).map((r) => r.item);
    if (filter === "all") return raw;
    return raw.filter((item) => item.type === filter);
  }, [query, filter, fuse]);

  const href = (entry: SearchEntry) => {
    if (entry.type === "retro") {
      // slug might contain /logs/... for milestones
      const baseSlug = entry.slug.split("/logs/")[0];
      return `/retros/${entry.year}/${baseSlug}`;
    }
    return `/pitfalls/${entry.year}/${entry.slug}`;
  };

  return (
    <>
      <TopNav activeKey="search" />
      <main className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-12">
          <h1 className="text-[22px] font-bold tracking-[-0.015em]">搜索</h1>
          <p className="mt-2 text-[13px] text-muted">搜索项目复盘、踩坑记录和标签</p>

          {/* Search input */}
          <div className="relative mt-5">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入关键词搜索..."
              autoFocus
              className="w-full rounded-md border border-border bg-surface py-3 pl-12 pr-14 text-base text-foreground outline-none transition-all placeholder:text-subtle focus:border-primary focus:shadow-[0_0_0_3px_var(--tb-primary-tint)]"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded-[3px] border border-border px-[5px] py-px font-mono text-[11px] text-subtle">
              ↵
            </kbd>
          </div>

          {/* Filter pills */}
          <div className="mt-4 inline-flex items-center gap-0.5 rounded-md border border-border bg-surface p-[3px]">
            {([["all", "全部"], ["retro", "项目"], ["pitfall", "踩坑"]] as const).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-sm px-[13px] py-1.5 font-mono text-[13px] font-medium transition-colors ${
                    filter === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* Results meta */}
          {query.trim() && (
            <div className="mb-3 mt-5 flex items-center justify-between">
              <span className="font-mono text-[13px] text-muted">{results.length} 个结果</span>
              <span className="font-mono text-xs text-subtle">按相关度排序</span>
            </div>
          )}

          {/* Results */}
          <div className="flex flex-col gap-3">
            {results.map((entry, i) => (
              <Link
                key={`${entry.type}-${entry.slug}-${i}`}
                href={href(entry)}
                className={`block rounded-md border border-border bg-surface px-6 py-4 no-underline transition-colors hover:border-border-strong hover:bg-surface-2 ${
                  entry.type === "retro"
                    ? "border-l-[3px] border-l-primary"
                    : "border-l-[3px] border-l-state-warning"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  {entry.type === "retro" ? (
                    <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(224,168,81,0.28)] bg-[var(--tb-primary-tint)] px-[9px] py-1 font-mono text-xs font-medium text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />复盘
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-warning">
                      <span className="h-1.5 w-1.5 rounded-full bg-state-warning" />踩坑
                    </span>
                  )}
                  <span className="font-mono text-xs text-subtle">{entry.date}</span>
                </div>
                <h3 className="text-[17px] font-semibold text-foreground">{entry.title}</h3>
                {entry.summary && (
                  <p className="mt-1 text-sm leading-[1.6] text-muted">
                    {entry.summary.slice(0, 120)}
                    {entry.summary.length > 120 ? "..." : ""}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {!query.trim() && (
            <p className="mt-10 text-center text-[13px] text-muted">
              输入关键词开始搜索，或按 / 快捷键
            </p>
          )}
          {query.trim() && results.length === 0 && (
            <p className="mt-10 text-center text-[13px] text-muted">
              没有找到匹配的结果，试试其他关键词
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
