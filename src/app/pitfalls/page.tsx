import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { getAllPitfalls } from "@/lib/pitfalls";

export default function PitfallsPage() {
  const pitfalls = getAllPitfalls();
  const resolved = pitfalls.filter((p) => p.frontmatter.resolved).length;
  const unsolved = pitfalls.length - resolved;

  const severityLabel = (s?: string) =>
    s === "high" ? "严重" : s === "medium" ? "中等" : s === "low" ? "轻微" : s;

  return (
    <>
      <TopNav activeKey="pitfalls" />
      <main className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-8">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-1.5 py-1 font-mono text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            返回首页
          </Link>

          {/* Header */}
          <div className="mt-5">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em]">踩坑记录</h1>
            <p className="mt-2 text-[13px] text-muted">归档开发过程中遇到的问题、解决方案与经验</p>
            <p className="mt-3 font-mono text-[13px] text-muted">
              总计 {pitfalls.length} 条 · 未解决 {unsolved} 条 · 已解决 {resolved} 条
            </p>
          </div>

          {/* Pitfall cards grid */}
          <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(380px,1fr))]">
            {pitfalls.map((pitfall) => (
              <Link
                key={`${pitfall.year}/${pitfall.slug}`}
                href={`/pitfalls/${pitfall.year}/${pitfall.slug}`}
                className={`block h-full rounded-lg border border-border bg-surface p-5 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong ${
                  !pitfall.frontmatter.resolved ? "border-l-[3px] border-l-state-warning" : ""
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  {pitfall.frontmatter.resolved ? (
                    <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(70,181,112,0.28)] bg-[var(--tb-success-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-state-success" />已解决
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-warning">
                      <span className="h-1.5 w-1.5 rounded-full bg-state-warning" />未解决
                    </span>
                  )}
                  {pitfall.frontmatter.severity && (
                    <span className={`inline-flex items-center gap-[5px] rounded-sm border px-[9px] py-1 font-mono text-xs font-medium ${
                      pitfall.frontmatter.severity === "high"
                        ? "border-[rgba(224,86,79,0.30)] bg-[var(--tb-error-tint)] text-state-error"
                        : pitfall.frontmatter.severity === "medium"
                          ? "border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] text-state-warning"
                          : "border-[rgba(107,116,132,0.30)] bg-[var(--tb-neutral-tint)] text-state-neutral"
                    }`}>
                      {severityLabel(pitfall.frontmatter.severity)}
                    </span>
                  )}
                  <span className="ml-auto font-mono text-xs text-subtle">{pitfall.frontmatter.date}</span>
                </div>
                <h3 className="text-[17px] font-semibold text-foreground">{pitfall.frontmatter.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pitfall.frontmatter.tags.map((tag) => (
                    <span key={tag} className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-xs font-medium text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {/* Browse by tags */}
          <div className="mt-8">
            <Link href="/tags" className="inline-flex items-center gap-1.5 font-mono text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary">
              按标签浏览
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
