import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import PitfallEditor from "@/components/PitfallEditor";
import { mdxComponents } from "@/components/MDXComponents";
import FloatingToc from "@/components/FloatingToc";
import { getPitfall, getAllPitfallSlugs } from "@/lib/pitfalls";
import { findRetroBySlug } from "@/lib/retros";
import { extractHeadings, headingId } from "@/lib/headings";

export function generateStaticParams() {
  return getAllPitfallSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const pitfall = getPitfall(year, slug);
  return {
    title: pitfall ? `${pitfall.frontmatter.title} · TraceBack` : "踩坑 · TraceBack",
  };
}

export default async function PitfallDetailPage({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const pitfall = getPitfall(year, slug);
  if (!pitfall) notFound();

  const fm = pitfall.frontmatter;
  const headings = extractHeadings(pitfall.content);
  const relatedRetro = fm.related_project ? findRetroBySlug(fm.related_project) : null;

  return (
    <>
      <TopNav activeKey="pitfalls" />
      <main className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-8 pb-16">
          {/* Back link */}
          <Link href="/pitfalls" className="inline-flex items-center gap-1.5 py-1 font-mono text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            返回踩坑列表
          </Link>

          {/* Header */}
          <header className="mt-6 mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {fm.severity && (
                <span className={`inline-flex items-center gap-[5px] rounded-sm border px-[9px] py-1 font-mono text-xs font-medium ${
                  fm.severity === "high"
                    ? "border-[rgba(224,86,79,0.30)] bg-[var(--tb-error-tint)] text-state-error"
                    : fm.severity === "medium"
                      ? "border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] text-state-warning"
                      : "border-[rgba(107,116,132,0.30)] bg-[var(--tb-neutral-tint)] text-state-neutral"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    fm.severity === "high" ? "bg-state-error" : fm.severity === "medium" ? "bg-state-warning" : "bg-state-neutral"
                  }`} />
                  {fm.severity === "high" ? "严重" : fm.severity === "medium" ? "中等" : "轻微"}
                </span>
              )}
              {fm.resolved ? (
                <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(70,181,112,0.28)] bg-[var(--tb-success-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-state-success" />已解决
                </span>
              ) : (
                <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-warning">
                  <span className="h-1.5 w-1.5 rounded-full bg-state-warning" />未解决
                </span>
              )}
            </div>

            <h1 className="mb-4 text-[30px] font-bold leading-[1.2] tracking-[-0.02em]">{fm.title}</h1>

            <div className="mb-6 flex flex-wrap gap-2">
              {fm.tags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-xs font-medium text-muted no-underline transition-colors hover:border-pitfall/40 hover:bg-[var(--tb-pitfall-tint)] hover:text-pitfall">
                  {tag}
                </Link>
              ))}
            </div>

            {/* Meta */}
            <div className="grid gap-4 border-t border-border pt-6 [grid-template-columns:repeat(auto-fit,minmax(200px,auto))]">
              <div className="flex flex-col gap-[7px]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">发现时间</span>
                <span className="font-mono text-[13px] font-semibold text-foreground">{fm.date}</span>
              </div>
              {fm.related_project && (
                <div className="flex flex-col gap-[7px]">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">相关项目</span>
                  <span className="font-mono text-[13px] font-semibold text-foreground">{fm.related_project}</span>
                </div>
              )}
              <div className="flex flex-col gap-[7px]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">状态</span>
                <span className="font-mono text-[13px] font-semibold text-foreground">{fm.resolved ? "已解决" : "未解决"}</span>
              </div>
            </div>
          </header>

          {/* Quick editor */}
          <div className="mb-8">
            <PitfallEditor
              year={year}
              slug={slug}
              initialResolved={fm.resolved}
              initialSeverity={fm.severity ?? null}
            />
          </div>

          {/* TOC (level-2 headings of the article) */}
          {headings.length > 0 && (
            <nav className="mb-8 rounded-lg border border-border bg-surface p-5" aria-label="目录">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
                目录
              </span>
              <ol className="mt-3 space-y-1.5">
                {headings.map((h, i) => (
                  <li key={h}>
                    <a
                      href={`#${headingId(h)}`}
                      className="group flex items-baseline gap-3 rounded-sm px-2 py-1 font-mono text-[13px] text-muted no-underline transition-colors hover:bg-surface-2 hover:text-primary"
                    >
                      <span className="shrink-0 text-[11px] text-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{h}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Content (MDX rendered) */}
          <article className="prose-tb">
            <MDXRemote
              source={pitfall.content}
              components={mdxComponents}
              options={{ parseFrontmatter: false, mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } }}
            />
          </article>

          {/* Related project link */}
          {relatedRetro && (
            <section className="mt-12 border-t border-border pt-8">
              <h3 className="mb-4 text-[17px] font-semibold">相关复盘</h3>
              <Link
                href={`/retros/${relatedRetro.year}/${relatedRetro.slug}`}
                className="flex items-center gap-3 rounded-md border border-border border-l-[3px] border-l-primary bg-surface px-5 py-4 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-2"
              >
                <span className="flex-1">
                  <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-primary">
                    Retro · {relatedRetro.date}
                  </span>
                  <span className="mt-1 block text-[15px] font-semibold text-foreground">
                    {relatedRetro.title}
                  </span>
                </span>
                <svg className="text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <FloatingToc headings={headings} />
    </>
  );
}
