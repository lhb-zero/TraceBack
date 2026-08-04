"use client";

import { useState, useEffect, useRef } from "react";
import { headingId } from "@/lib/headings";

interface Props {
  headings: string[];
}

export default function FloatingToc({ headings }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

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
      {/* Floating button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-lg transition-all hover:border-primary hover:text-primary"
        aria-label="打开目录"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-20 right-6 z-50 w-64 rounded-lg border border-border bg-surface p-4 shadow-2xl"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
              目录
            </span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-sm px-1.5 py-0.5 font-mono text-sm text-subtle transition-colors hover:bg-sunken hover:text-foreground"
              aria-label="关闭目录"
            >
              ×
            </button>
          </div>
          <ol className="space-y-0.5">
            {headings.map((h, i) => (
              <li key={h}>
                <a
                  href={`#${headingId(h)}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-2.5 rounded-sm px-2 py-1.5 font-mono text-[13px] text-muted no-underline transition-colors hover:bg-surface-2 hover:text-primary"
                >
                  <span className="shrink-0 text-[11px] text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{h}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}