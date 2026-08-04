"use client";

import { useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";

/* ============================================================
   CodeBlock — 代码块容器
   顶部语言标签页 + 复制按钮，悬停边框提亮。
   语言由服务端（MDXComponents 的 Pre 包装）提取后经 lang prop 传入，
   避免客户端 hydration 时 children 序列化导致两端渲染不一致。
   ============================================================ */

interface CodeBlockProps extends ComponentPropsWithoutRef<"pre"> {
  lang?: string;
}

export default function CodeBlock({ lang, children, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

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
