"use client";

import { useState, useEffect } from "react";

interface SubDocRef {
  file: string;
  title: string;
}

interface Props {
  subDocs: SubDocRef[];
  milestoneCount: number;
}

/* ============================================================
   SubDocNav — 复盘详情页的子文档导航条（sticky）
   - 主文档 index：实心琥珀块（视觉锚点，始终突出）
   - 子文档：描边胶囊 + 文档图标，active 时琥珀 tint（与主文档两套样式体系）
   - 点击/滚动同步高亮；子文档多时 flex-wrap 自动换行
   ============================================================ */

const fileLabel = (file: string) => file.replace(/\.mdx$/, "");

function DocIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export default function SubDocNav({ subDocs, milestoneCount }: Props) {
  const [active, setActive] = useState<string>("index");

  // Sync highlight with reading position on scroll
  useEffect(() => {
    const indexEl = document.querySelector("article.prose-tb") as HTMLElement | null;
    if (!indexEl) return;

    const sections: { key: string; el: HTMLElement }[] = [{ key: "index", el: indexEl }];
    for (const d of subDocs) {
      const el = document.getElementById(`sub-${encodeURIComponent(d.file)}`);
      if (el) sections.push({ key: d.file, el });
    }
    if (sections.length === 1) return; // no sub-docs, nothing to track

    const onScroll = () => {
      // Offset must clear TopNav (60px) + sticky nav (~40px) AND be a bit larger
      // than scroll-mt-[120px], otherwise an anchor jump lands exactly on the
      // detection line and the section is judged "not reached yet".
      const mark = window.scrollY + 160;
      let activeKey = "index";
      for (const s of sections) {
        const top = s.el.getBoundingClientRect().top + window.scrollY;
        if (top <= mark) activeKey = s.key;
        else break;
      }
      // Scrolled past the last sub-doc section → the rest of the page (milestones,
      // commits, related pitfalls) belongs to index.mdx
      const last = sections[sections.length - 1];
      const lastBottom = last.el.getBoundingClientRect().bottom + window.scrollY;
      if (mark > lastBottom) activeKey = "index";
      setActive((prev) => (prev === activeKey ? prev : activeKey));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [subDocs]);

  const goIndex = () => {
    setActive("index");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className="sticky top-[60px] z-40 mb-12 flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2"
      aria-label="子文档导航"
    >
      <span className="px-1 py-1.5 font-mono text-xs font-semibold text-subtle">retros/</span>

      {/* 主文档：实心琥珀块（视觉锚点） */}
      <button
        type="button"
        onClick={goIndex}
        aria-pressed={active === "index"}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[13px] font-semibold no-underline transition-all duration-150 ${
          active === "index"
            ? "bg-primary-strong text-[#1a1308] shadow-[0_0_0_3px_rgba(224,168,81,0.28)]"
            : "bg-primary/75 text-primary-foreground hover:bg-primary"
        }`}
      >
        <DocIcon className={active === "index" ? "text-[#1a1308]" : ""} />
        index
      </button>

      {/* 分隔线：主文档与子文档分组 */}
      {subDocs.length > 0 && <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />}

      {/* 子文档：描边胶囊 + 文档图标 */}
      {subDocs.map((doc) => (
        <a
          key={doc.file}
          href={`#sub-${encodeURIComponent(doc.file)}`}
          onClick={() => setActive(doc.file)}
          aria-current={active === doc.file ? "true" : undefined}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[13px] font-medium no-underline transition-colors duration-150 ${
            active === doc.file
              ? "border-primary bg-[var(--tb-primary-tint)] text-primary"
              : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
          }`}
        >
          <DocIcon
            className={active === doc.file ? "text-primary" : "text-subtle group-hover:text-muted"}
          />
          {fileLabel(doc.file)}
        </a>
      ))}

      {milestoneCount > 0 && (
        <span className="ml-auto pr-1 font-mono text-[11px] text-subtle">
          {milestoneCount + 1 + subDocs.length} files
        </span>
      )}
    </nav>
  );
}
