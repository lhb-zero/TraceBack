import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { getAllRetroProjects, getPendingReviewProjects } from "@/lib/retros";
import { getAllPitfalls } from "@/lib/pitfalls";
import { getDashboardStats, getAllTags } from "@/lib/utils";

export default function Home() {
  const stats = getDashboardStats();
  const projects = getAllRetroProjects();
  const pitfalls = getAllPitfalls();
  const pendingReview = getPendingReviewProjects();
  const tags = getAllTags();

  // Merge projects and pitfalls into a unified timeline
  type TimelineEntry = {
    type: "project" | "pitfall";
    title: string;
    date: string;
    tags: string[];
    status: string;
    resolved?: boolean;
    href: string;
  };

  const timeline: TimelineEntry[] = [
    ...projects.map((p) => ({
      type: "project" as const,
      title: p.frontmatter.title,
      date: p.frontmatter.date,
      tags: p.frontmatter.tags,
      status: p.frontmatter.status,
      href: `/retros/${p.year}/${p.slug}`,
    })),
    ...pitfalls.map((p) => ({
      type: "pitfall" as const,
      title: p.frontmatter.title,
      date: p.frontmatter.date,
      tags: p.frontmatter.tags,
      status: p.frontmatter.resolved ? "resolved" : "unsolved",
      resolved: p.frontmatter.resolved,
      href: `/pitfalls/${p.year}/${p.slug}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group timeline by year
  const grouped = new Map<string, TimelineEntry[]>();
  for (const entry of timeline) {
    const year = entry.date.slice(0, 4);
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(entry);
  }

  const statusBadge = (status: string, resolved?: boolean) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(70,181,112,0.28)] bg-[var(--tb-success-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-success"><span className="h-1.5 w-1.5 rounded-full bg-state-success" />已完成</span>;
      case "ongoing":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(79,147,214,0.28)] bg-[var(--tb-info-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-info"><span className="h-1.5 w-1.5 rounded-full bg-state-info" />进行中</span>;
      case "abandoned":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(107,116,132,0.30)] bg-[var(--tb-neutral-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-neutral"><span className="h-1.5 w-1.5 rounded-full bg-state-neutral" />已废弃</span>;
      case "resolved":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(70,181,112,0.28)] bg-[var(--tb-success-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-success"><span className="h-1.5 w-1.5 rounded-full bg-state-success" />已解决</span>;
      case "unsolved":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-warning"><span className="h-1.5 w-1.5 rounded-full bg-state-warning" />未解决</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <TopNav activeKey="home" />

      <main className="flex-1">
        <div className="mx-auto max-w-[1040px] px-6 py-12">
          {/* Hero */}
          <section className="mb-10">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-foreground">
              技术成长档案
            </h1>
            <p className="mt-3 text-[17px] leading-[1.75] text-foreground">
              记录每一次技术成长 — 项目复盘、踩坑归档、知识沉淀
            </p>
            <p className="mt-4 font-mono text-[13px] text-muted">
              {stats.totalProjects} projects · {stats.totalPitfalls} pitfalls · {tags.length} tags
            </p>
          </section>

          {/* Stats */}
          <section className="mb-12">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-border bg-surface p-6">
                <div className="font-mono text-[30px] font-bold leading-none tracking-[-0.01em] text-foreground">
                  {stats.totalProjects}
                </div>
                <div className="mt-1 font-mono text-xs text-subtle">项目复盘</div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-6">
                <div className="font-mono text-[30px] font-bold leading-none tracking-[-0.01em] text-state-warning">
                  {stats.totalPitfalls}
                </div>
                <div className="mt-1 font-mono text-xs text-subtle">踩坑记录</div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-6">
                <div className="font-mono text-[30px] font-bold leading-none tracking-[-0.01em] text-foreground">
                  {tags.length}
                </div>
                <div className="mt-1 font-mono text-xs text-subtle">标签</div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-6">
                <div className="font-mono text-[30px] font-bold leading-none tracking-[-0.01em] text-state-info">
                  {stats.pendingReview}
                </div>
                <div className="mt-1 font-mono text-xs text-subtle">待回顾</div>
              </div>
            </div>
          </section>

          {/* Pending Review */}
          {pendingReview.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-4 text-[22px] font-bold tracking-[-0.015em] text-foreground">
                待回顾
              </h2>
              <div className="space-y-3">
                {pendingReview.map((p) => (
                  <Link
                    key={`${p.year}/${p.slug}`}
                    href={`/retros/${p.year}/${p.slug}`}
                    className="block rounded-lg border border-border border-l-[3px] border-l-state-warning bg-surface p-5 no-underline transition-colors duration-150 hover:border-border-strong"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[17px] font-semibold text-foreground">
                        {p.frontmatter.title}
                      </span>
                      {statusBadge(p.frontmatter.status)}
                    </div>
                    <p className="mt-1 font-mono text-xs text-subtle">
                      标记回顾: {p.frontmatter.review_after} · 理解度: {p.frontmatter.understanding_score ?? "-"}/5
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="mb-6 text-[22px] font-bold tracking-[-0.015em] text-foreground">
              最近动态
            </h2>
            <div className="relative pl-7">
              {/* Vertical line */}
              <div className="absolute bottom-1.5 left-[7px] top-1.5 w-px bg-border" />

              {Array.from(grouped.entries()).map(([year, entries]) => (
                <div key={year}>
                  {/* Year marker */}
                  <div className="relative mb-4 mt-8 font-mono text-[15px] font-bold text-foreground first:mt-0">
                    <span className="absolute -left-7 top-1/2 h-[15px] w-[15px] -translate-y-1/2 rotate-45 border border-border-strong bg-surface" />
                    {year}
                  </div>

                  {/* Entries */}
                  {entries.map((entry, i) => (
                    <div key={`${entry.href}-${i}`} className="relative mb-4">
                      {/* Node dot */}
                      <span className="absolute -left-7 top-1.5 flex h-[15px] w-[15px] items-center justify-center">
                        {entry.type === "project" ? (
                          <span className="relative z-10 h-[9px] w-[9px] rounded-full bg-primary shadow-[0_0_0_3px_var(--tb-primary-tint)]" />
                        ) : (
                          <span
                            className={`relative z-10 h-[9px] w-[9px] rounded-full border-2 bg-surface ${
                              entry.resolved ? "border-state-neutral" : "border-state-warning"
                            }`}
                          />
                        )}
                      </span>

                      {/* Card */}
                      <Link
                        href={entry.href}
                        className={`block rounded-lg border border-border bg-surface p-5 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong ${
                          entry.status === "unsolved" ? "border-l-[3px] border-l-state-warning" : ""
                        }`}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          {/* Type badge */}
                          {entry.type === "project" ? (
                            <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(224,168,81,0.28)] bg-[var(--tb-primary-tint)] px-[9px] py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.03em] text-primary">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />复盘
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] px-[9px] py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.03em] text-state-warning">
                              <span className="h-1.5 w-1.5 rounded-full bg-state-warning" />踩坑
                            </span>
                          )}
                          <span className="text-[17px] font-semibold text-foreground">
                            {entry.title}
                          </span>
                          {statusBadge(entry.status, entry.resolved)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-subtle">{entry.date}</span>
                          {entry.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-xs font-medium text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="mb-4 text-[22px] font-bold tracking-[-0.015em] text-foreground">
              快速访问
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link href="/pitfalls" className="block rounded-lg border border-border bg-surface p-5 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong">
                <div className="mb-1 text-[17px] font-semibold text-foreground">浏览全部踩坑</div>
                <p className="text-[13px] leading-[1.5] text-muted">
                  查看 {stats.totalPitfalls} 条踩坑记录与解决方案
                </p>
              </Link>
              <Link href="/tags" className="block rounded-lg border border-border bg-surface p-5 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong">
                <div className="mb-1 text-[17px] font-semibold text-foreground">按标签筛选</div>
                <p className="text-[13px] leading-[1.5] text-muted">
                  通过 {tags.length} 个标签快速定位知识
                </p>
              </Link>
              <Link href="/search" className="block rounded-lg border border-border bg-surface p-5 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong">
                <div className="mb-1 text-[17px] font-semibold text-foreground">全站搜索</div>
                <p className="text-[13px] leading-[1.5] text-muted">
                  跨项目、踩坑、标签全文检索
                </p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
