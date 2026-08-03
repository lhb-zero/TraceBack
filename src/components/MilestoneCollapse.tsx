"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/* ============================================================
   MilestoneCollapse — 里程碑折叠卡片
   默认收纳（只看标题+日期），点击展开渲染 MDX 正文。
   children 为服务端渲染的 MDX，本组件只控制显隐（grid-rows 动画）。
   ============================================================ */

interface Props {
  title: string;
  date: string;
  children: ReactNode;
}

export default function MilestoneCollapse({ title, date, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-150 hover:border-border-strong">
      {/* Header (always visible, toggles) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
        <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_var(--tb-primary-tint)]" />
        <span className="text-[15px] font-semibold text-foreground">{title}</span>
        <span className="ml-auto font-mono text-xs text-subtle">{date}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Collapsible body */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="prose-tb border-t border-border px-5 pb-5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
