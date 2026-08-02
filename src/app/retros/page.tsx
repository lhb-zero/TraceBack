import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { getAllRetroProjects } from "@/lib/retros";

export default function RetrosPage() {
  const projects = getAllRetroProjects();

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(70,181,112,0.28)] bg-[var(--tb-success-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-success"><span className="h-1.5 w-1.5 rounded-full bg-state-success" />已完成</span>;
      case "ongoing":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(79,147,214,0.28)] bg-[var(--tb-info-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-info"><span className="h-1.5 w-1.5 rounded-full bg-state-info" />进行中</span>;
      case "abandoned":
        return <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(107,116,132,0.30)] bg-[var(--tb-neutral-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-neutral"><span className="h-1.5 w-1.5 rounded-full bg-state-neutral" />已废弃</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <TopNav activeKey="retros" />
      <main className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-8">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-1.5 py-1 font-mono text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            返回首页
          </Link>

          {/* Header */}
          <div className="mt-5">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em]">项目复盘</h1>
            <p className="mt-2 text-[13px] text-muted">归档每个项目的技术决策、AI 协作经验与认知成长</p>
            <p className="mt-3 font-mono text-[13px] text-muted">
              总计 {projects.length} 个 · 已完成 {projects.filter(p => p.frontmatter.status === "completed").length} · 进行中 {projects.filter(p => p.frontmatter.status === "ongoing").length}
            </p>
          </div>

          {/* Project list */}
          <div className="mt-8 space-y-4">
            {projects.map((project) => (
              <Link
                key={`${project.year}/${project.slug}`}
                href={`/retros/${project.year}/${project.slug}`}
                className="block rounded-lg border border-border bg-surface p-6 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong"
              >
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="text-[17px] font-semibold text-foreground">{project.frontmatter.title}</span>
                  {statusBadge(project.frontmatter.status)}
                </div>
                <p className="text-sm leading-[1.7] text-muted">{project.frontmatter.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-subtle">{project.frontmatter.date}</span>
                  {project.frontmatter.period && (
                    <span className="font-mono text-xs text-subtle">· {project.frontmatter.period}</span>
                  )}
                  {project.frontmatter.tags.map((tag) => (
                    <span key={tag} className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-xs font-medium text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-4">
                  {project.milestones.length > 0 && (
                    <span className="font-mono text-xs text-subtle">里程碑 {project.milestones.length} 条</span>
                  )}
                  {project.frontmatter.understanding_score != null && (
                    <span className="inline-flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-[2px] border ${
                            i < (project.frontmatter.understanding_score ?? 0)
                              ? "border-primary bg-primary"
                              : "border-border-strong bg-transparent"
                          }`}
                        />
                      ))}
                      <span className="ml-1 font-mono text-xs text-subtle">{project.frontmatter.understanding_score}/5</span>
                    </span>
                  )}
                  {project.frontmatter.repo && (
                    <span className="font-mono text-xs text-subtle">↗ GitHub</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
