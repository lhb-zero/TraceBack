import { notFound } from "next/navigation";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { getAllTags } from "@/lib/utils";
import { getRetroProjectsByTag } from "@/lib/retros";
import { getPitfallsByTag } from "@/lib/pitfalls";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.name }));
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const tagName = decodeURIComponent(tag);

  const retros = getRetroProjectsByTag(tagName);
  const pitfalls = getPitfallsByTag(tagName);

  if (retros.length === 0 && pitfalls.length === 0) notFound();

  return (
    <>
      <TopNav activeKey="tags" />
      <main className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-8 pb-16">
          {/* Back link */}
          <Link
            href="/tags"
            className="inline-flex items-center gap-1.5 py-1 font-mono text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            返回标签索引
          </Link>

          {/* Header */}
          <header className="mt-5 mb-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-sm border border-[rgba(224,168,81,0.4)] bg-[var(--tb-primary-tint)] px-3 py-1 font-mono text-[15px] font-semibold text-primary">
                #{tagName}
              </span>
            </div>
            <p className="mt-3 font-mono text-[13px] text-muted">
              {retros.length} 个复盘 · {pitfalls.length} 条踩坑
            </p>
          </header>

          {/* Retros with this tag */}
          {retros.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-[22px] font-bold tracking-[-0.015em]">相关复盘</h2>
              <div className="space-y-3">
                {retros.map((p) => (
                  <Link
                    key={`${p.year}/${p.slug}`}
                    href={`/retros/${p.year}/${p.slug}`}
                    className="block rounded-lg border border-border border-l-[3px] border-l-primary bg-surface p-5 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="text-[17px] font-semibold text-foreground">{p.frontmatter.title}</span>
                      <span className="ml-auto font-mono text-xs text-subtle">{p.frontmatter.date}</span>
                    </div>
                    <p className="text-sm leading-[1.7] text-muted">{p.frontmatter.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Pitfalls with this tag */}
          {pitfalls.length > 0 && (
            <section>
              <h2 className="mb-4 text-[22px] font-bold tracking-[-0.015em]">相关踩坑</h2>
              <div className="space-y-3">
                {pitfalls.map((p) => (
                  <Link
                    key={`${p.year}/${p.slug}`}
                    href={`/pitfalls/${p.year}/${p.slug}`}
                    className="block rounded-lg border border-border border-l-[3px] border-l-state-warning bg-surface p-5 no-underline transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="text-[17px] font-semibold text-foreground">{p.frontmatter.title}</span>
                      {p.frontmatter.resolved ? (
                        <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(70,181,112,0.28)] bg-[var(--tb-success-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-state-success" />已解决
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-[5px] rounded-sm border border-[rgba(217,130,58,0.30)] bg-[var(--tb-warning-tint)] px-[9px] py-1 font-mono text-xs font-medium text-state-warning">
                          <span className="h-1.5 w-1.5 rounded-full bg-state-warning" />未解决
                        </span>
                      )}
                      <span className="ml-auto font-mono text-xs text-subtle">{p.frontmatter.date}</span>
                    </div>
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
