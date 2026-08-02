import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import RetroEditor from "@/components/RetroEditor";
import { mdxComponents } from "@/components/MDXComponents";
import { getRetroProject, getAllRetroSlugs } from "@/lib/retros";
import { getPitfallsByProject } from "@/lib/pitfalls";

export function generateStaticParams() {
  return getAllRetroSlugs();
}

export default async function RetroDetailPage({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const project = getRetroProject(year, slug);
  if (!project) notFound();

  const relatedPitfalls = getPitfallsByProject(slug);
  const fm = project.frontmatter;

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
        <div className="mx-auto max-w-[900px] px-6 py-8 pb-16">
          {/* Back link */}
          <Link href="/retros" className="inline-flex items-center gap-1.5 py-1 font-mono text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            返回复盘列表
          </Link>

          {/* Header */}
          <header className="mt-6 mb-8">
            <div className="mb-4 flex items-center gap-3">
              {statusBadge(fm.status)}
            </div>
            <h1 className="mb-4 text-[30px] font-bold leading-[1.2] tracking-[-0.02em]">{fm.title}</h1>
            <div className="mb-6 flex flex-wrap gap-2">
              {fm.tags.map((tag) => (
                <Link key={tag} href={`/tags`} className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-xs font-medium text-muted no-underline transition-colors hover:border-[rgba(224,168,81,0.4)] hover:bg-[var(--tb-primary-tint)] hover:text-primary">
                  {tag}
                </Link>
              ))}
            </div>

            {/* Meta grid */}
            <div className="grid gap-4 rounded-lg border border-border bg-surface p-6 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
              {fm.period && (
                <div className="flex flex-col gap-[7px]">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">时间</span>
                  <span className="font-mono text-[13px] font-semibold text-foreground">{fm.period}</span>
                </div>
              )}
              <div className="flex flex-col gap-[7px]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">复盘日期</span>
                <span className="font-mono text-[13px] font-semibold text-foreground">{fm.date}</span>
              </div>
              {fm.understanding_score != null && (
                <div className="flex flex-col gap-[7px]">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">理解程度</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`h-2 w-2 rounded-[2px] border ${i < (fm.understanding_score ?? 0) ? "border-primary bg-primary" : "border-border-strong bg-transparent"}`} />
                      ))}
                    </span>
                    <span className="font-mono text-[13px] text-muted">{fm.understanding_score} / 5</span>
                  </span>
                </div>
              )}
              {fm.repo && (
                <div className="flex flex-col gap-[7px]">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">仓库</span>
                  <a href={fm.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[13px] text-muted no-underline transition-colors hover:text-foreground">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                    GitHub ↗
                  </a>
                </div>
              )}
            </div>
          </header>

          {/* Quick editor */}
          <div className="mb-8">
            <RetroEditor
              year={year}
              slug={slug}
              initialScore={fm.understanding_score ?? null}
              initialStatus={fm.status}
              initialReviewStatus={fm.review_status ?? null}
            />
          </div>

          {/* Sub-doc navigation */}
          {(project.subDocs.length > 0 || project.milestones.length > 0) && (
            <nav className="sticky top-[60px] z-40 mb-12 flex flex-wrap items-center gap-1 rounded-md border border-border bg-surface px-3 py-2" aria-label="子文档导航">
              <span className="px-1.5 py-1.5 font-mono text-xs font-semibold text-subtle">retros/</span>
              <span className="rounded-sm border border-[var(--tb-primary-tint-strong)] bg-[var(--tb-primary-tint)] px-3 py-1.5 font-mono text-[13px] font-medium text-primary">
                index.mdx
              </span>
              {project.subDocs.map((doc) => (
                <span key={doc.file} className="rounded-sm px-3 py-1.5 font-mono text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
                  {doc.file}
                </span>
              ))}
              {project.milestones.length > 0 && (
                <span className="ml-auto pr-1 font-mono text-[11px] text-subtle">
                  {project.milestones.length + 1 + project.subDocs.length} files
                </span>
              )}
            </nav>
          )}

          {/* Main content (MDX rendered) */}
          <article className="prose-tb">
            <MDXRemote
              source={project.content}
              components={mdxComponents}
              options={{ parseFrontmatter: false, mdxOptions: { format: "md" } }}
            />
          </article>

          {/* Milestones */}
          {project.milestones.length > 0 && (
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="mb-4 text-[22px] font-bold tracking-[-0.015em]">里程碑记录</h2>
              <div className="space-y-6">
                {project.milestones.map((ms) => (
                  <div key={ms.slug} className="rounded-lg border border-border bg-surface p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-[9px] w-[9px] rounded-full bg-primary shadow-[0_0_0_3px_var(--tb-primary-tint)]" />
                      <span className="text-[15px] font-semibold text-foreground">{ms.frontmatter.title}</span>
                      <span className="ml-auto font-mono text-xs text-subtle">{ms.frontmatter.date}</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <MDXRemote
                        source={ms.content}
                        components={mdxComponents}
                        options={{ parseFrontmatter: false, mdxOptions: { format: "md" } }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Commits */}
          {fm.commits && fm.commits.length > 0 && (
            <section className="mt-12">
              <h3 className="mb-4 text-[17px] font-semibold">提交历史</h3>
              <div>
                {fm.commits.map((commit, i) => (
                  <div key={i} className="grid items-baseline gap-3 border-b border-border py-[9px] [grid-template-columns:auto_1fr]">
                    <span className="font-mono text-[13px] font-semibold text-primary">{commit.hash}</span>
                    <span className="text-sm text-foreground">{commit.note}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related pitfalls */}
          {relatedPitfalls.length > 0 && (
            <section className="mt-12 border-t border-border pt-8">
              <h3 className="mb-4 text-[17px] font-semibold">相关踩坑</h3>
              <div className="space-y-2">
                {relatedPitfalls.map((p) => (
                  <Link
                    key={`${p.year}/${p.slug}`}
                    href={`/pitfalls/${p.year}/${p.slug}`}
                    className="flex items-center gap-3 rounded-md border border-border border-l-[3px] border-l-primary bg-surface px-5 py-4 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2"
                  >
                    <span className="flex-1">
                      <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-primary">Pitfall · {p.frontmatter.date}</span>
                      <span className="mt-1 block text-[15px] font-semibold text-foreground">{p.frontmatter.title}</span>
                    </span>
                    <svg className="text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
