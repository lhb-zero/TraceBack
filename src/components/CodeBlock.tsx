"use client";

import { useRef, useState, isValidElement } from "react";
import type { ComponentPropsWithoutRef } from "react";

/* ============================================================
   CodeBlock — 代码块容器
   顶部语言标签页 + 复制按钮，悬停边框提亮。
   语言从嵌套 <code> 的 className="language-xxx" 中提取。
   ============================================================ */

export default function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Extract language from the nested code element's className
  let lang = "";
  if (isValidElement(children)) {
    const cls = (children.props as { className?: string }).className || "";
    const m = cls.match(/language-([\w-]+)/);
    if (m) lang = m[1];
  }

  const handleCopy = async () => {
    const text = preRef.current?.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="group my-6 overflow-hidden rounded-md border border-border transition-colors duration-200 hover:border-border-strong">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`rounded-sm border px-2 py-0.5 font-mono text-[11px] transition-colors ${
            copied
              ? "border-[rgba(70,181,112,0.4)] bg-[var(--tb-success-tint)] text-state-success"
              : "border-border bg-transparent text-muted hover:border-border-strong hover:text-foreground"
          }`}
        >
          {copied ? "✓ 已复制" : "复制"}
        </button>
      </div>
      <pre
        ref={preRef}
        className="overflow-x-auto bg-sunken p-4 font-mono text-[13px] leading-[1.7] text-foreground"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
