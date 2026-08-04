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
   - index.mdx 与各子文档（decisions / ai-collaboration 等）标签
   - 点击子文档 → 锚点跳转 + 该标签高亮；点击 index → 回到正文顶部
   - 滚动时按阅读位置同步高亮（越过正文/子文档内容区自动切回 index）
   ============================================================ */

const ACTIVE_CLS =
  "rounded-sm border border-[var(--tb-primary-tint-strong)] bg-[var(--tb-primary-tint)] px-3 py-1.5 font-mono text-[13px] font-medium text-primary no-underline";
const IDLE_CLS =
  "rounded-sm border border-transparent px-3 py-1.5 font-mono text-[13px] font-medium text-muted no-underline transition-colors duration-150 hover:bg-surface-2 hover:text-foreground";

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
      className="sticky top-[60px] z-40 mb-12 flex flex-wrap items-center gap-1 rounded-md border border-border bg-surface px-3 py-2"
      aria-label="子文档导航"
    >
      <span className="px-1.5 py-1.5 font-mono text-xs font-semibold text-subtle">retros/</span>
      <button
        type="button"
        onClick={goIndex}
        className={active === "index" ? ACTIVE_CLS : IDLE_CLS}
      >
        index.mdx
      </button>
      {subDocs.map((doc) => (
        <a
          key={doc.file}
          href={`#sub-${encodeURIComponent(doc.file)}`}
          onClick={() => setActive(doc.file)}
          className={active === doc.file ? ACTIVE_CLS : IDLE_CLS}
        >
          {doc.file}
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
