export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-sunken">
      <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-4 px-6 py-8">
        <div className="inline-flex items-baseline gap-2">
          <span
            className="inline-block h-[11px] w-[11px] rounded-[2px] bg-primary shadow-[0_0_0_3px_var(--tb-primary-tint)]"
            aria-hidden="true"
          />
          <span className="font-mono text-[16px] font-bold text-foreground">TraceBack</span>
          <span className="font-mono text-xs text-subtle">
            // 个人技术成长档案 · 本地归档 · SSG
          </span>
        </div>
        <span className="font-mono text-xs text-subtle">v0.1.0</span>
      </div>
    </footer>
  );
}
