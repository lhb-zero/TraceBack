"use client";

import { useState, useEffect, useRef } from "react";
import { headingId } from "@/lib/headings";

interface Props {
  headings: string[];
}

/* ============================================================
   FloatingToc — 右侧浮动目录抽屉
   - 琥珀色垂直抽屉把手（A5 决策保留），面板向左弹出
   - 面板结构：头部（标题+条目数+关闭）→ 可滚动条目列表 → 阅读进度条
   - 滚动时高亮当前阅读章节（琥珀左边框 + tint），进度条同步阅读位置
   - 过渡动画：展开/收起平滑滑入滑出；点外部 / Esc / 跳转后自动关闭
   ============================================================ */

export default function FloatingToc({ headings }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Track current reading section + scroll progress
  useEffect(() => {
    const onScroll = () => {
      const mark = window.scrollY + 140; // clear TopNav (60px) + sub-doc nav (~40px) + breathing room
      let current = -1;
      for (let i = 0; i < headings.length; i++) {
        const el =
          document.getElementById(headings[i]) ??
          document.getElementById(headingId(headings[i]));
        if (el && el.getBoundingClientRect().top + window.scrollY <= mark) {
          current = i;
        } else if (current !== -1) {
          break;
        }
      }
      if (current === -1) current = 0;
      setActive((prev) => (prev === current ? prev : current));

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setProgress((prev) => (Math.abs(prev - pct) < 0.5 ? prev : pct));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Drawer handle: amber vertical bar on the right edge, vertically centered */}
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        aria-label={open ? "关闭目录" : "打开目录"}
        aria-expanded={open}
        className={`fixed right-3 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5 transition-all duration-200 ${
          open
            ? "border-primary bg-primary-strong text-primary-foreground shadow-[0_0_24px_rgba(224,168,81,0.5)]"
            : "border-primary/50 bg-gradient-to-b from-primary to-primary-strong text-primary-foreground shadow-[0_0_16px_rgba(224,168,81,0.35)] hover:border-primary hover:shadow-[0_0_28px_rgba(224,168,81,0.55)]"
        }`}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span className="font-mono text-[11px] font-bold tracking-[0.05em]">目录</span>
      </button>

      {/* Panel: slides out to the left of the handle, always mounted for animation */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="目录"
        className={`fixed right-16 top-1/2 z-50 w-72 max-w-[calc(100vw-5rem)] -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-surface shadow-[0_20px_56px_-16px_rgba(0,0,0,0.65)] ring-1 ring-primary/10 transition-all duration-300 ease-out ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-6 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              aria-hidden="true"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle">
              目录
            </span>
            <span className="rounded-sm bg-[var(--tb-primary-tint)] px-1.5 py-px font-mono text-[10px] font-semibold text-primary">
              {headings.length}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-sm px-1.5 py-0.5 font-mono text-sm text-subtle transition-colors hover:bg-sunken hover:text-foreground"
            aria-label="关闭目录"
          >
            ×
          </button>
        </div>

        {/* Scrollable list */}
        <nav className="max-h-[52vh] overflow-y-auto px-2 py-2" aria-label="目录导航">
          <ol className="space-y-0.5">
            {headings.map((h, i) => (
              <li key={h}>
                <a
                  href={`#${headingId(h)}`}
                  onClick={() => setOpen(false)}
                  className={`group flex items-baseline gap-2.5 rounded-md border-l-2 px-2.5 py-[7px] font-mono text-[13px] no-underline transition-colors duration-150 ${
                    active === i
                      ? "border-l-primary bg-[var(--tb-primary-tint)] text-primary"
                      : "border-l-transparent text-muted hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`shrink-0 text-[10px] transition-colors ${
                      active === i ? "text-primary" : "text-subtle group-hover:text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{h}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Reading progress */}
        <div className="border-t border-border px-4 py-2.5">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-sunken">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-strong transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-subtle">
            <span>
              {String(active + 1).padStart(2, "0")} / {String(headings.length).padStart(2, "0")}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
