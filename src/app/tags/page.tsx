import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { getAllTags } from "@/lib/utils";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <>
      <TopNav activeKey="tags" />
      <main className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-12">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em]">标签索引</h1>
            <p className="mt-2 text-[13px] text-muted">按技术栈、领域分类浏览所有标签</p>
            <p className="mt-3 font-mono text-[13px] text-muted">
              {tags.length} 个标签 · 跨复盘与踩坑
            </p>
          </header>

          {/* Tag cloud */}
          <section className="mb-12">
            <h2 className="mb-4 text-[22px] font-bold tracking-[-0.015em]">全部标签</h2>
            <div className="flex flex-wrap items-baseline gap-2">
              {tags.map((tag) => {
                // Scale font size based on count (min 13px, max 20px)
                const maxCount = tags[0]?.count || 1;
                const scale = tag.count / maxCount;
                const fontSize = 13 + scale * 7;
                const fontWeight = scale > 0.6 ? 700 : scale > 0.3 ? 600 : 500;

                return (
                  <span
                    key={tag.name}
                    className="inline-flex cursor-default items-center rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-muted transition-colors hover:border-[rgba(224,168,81,0.4)] hover:bg-[var(--tb-primary-tint)] hover:text-primary"
                    style={{ fontSize: `${fontSize}px`, fontWeight }}
                  >
                    {tag.name}
                    <span className="ml-1 text-xs text-subtle">({tag.count})</span>
                  </span>
                );
              })}
            </div>
          </section>

          {/* Detailed list */}
          <section>
            <h2 className="mb-4 text-[22px] font-bold tracking-[-0.015em]">详细统计</h2>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center gap-4 rounded-md border border-border bg-surface px-5 py-3"
                >
                  <span className="flex-1 font-mono text-[13px] font-semibold text-foreground">
                    {tag.name}
                  </span>
                  <span className="font-mono text-xs text-subtle">
                    复盘 {tag.retroCount} · 踩坑 {tag.pitfallCount}
                  </span>
                  <span className="font-mono text-[13px] font-bold text-primary">
                    {tag.count}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Search link */}
          <div className="mt-12 border-t border-border pt-8">
            <Link href="/search" className="inline-flex items-center gap-1.5 font-mono text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary">
              全站搜索更多内容
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
