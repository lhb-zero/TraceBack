import Link from "next/link";

const navItems = [
  { href: "/", label: "首页", key: "home" },
  { href: "/retros", label: "复盘", key: "retros" },
  { href: "/pitfalls", label: "踩坑", key: "pitfalls" },
  { href: "/tags", label: "标签", key: "tags" },
];

export default function TopNav({ activeKey }: { activeKey?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/82 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[60px] max-w-[1040px] items-center gap-6 px-6">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-[9px] no-underline">
          <span
            className="inline-block h-[11px] w-[11px] rounded-[2px] bg-primary shadow-[0_0_0_3px_var(--tb-primary-tint)]"
            aria-hidden="true"
          />
          <span className="font-mono text-[16px] font-bold tracking-[-0.01em] text-foreground">
            TraceBack
          </span>
          <span className="font-mono text-xs text-subtle">// 记录每一次技术成长</span>
        </Link>

        {/* Navigation */}
        <nav className="ml-2 flex items-center gap-0.5" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative rounded-sm px-[13px] py-[7px] font-mono text-[13px] font-medium no-underline transition-colors duration-150 ${
                activeKey === item.key
                  ? "text-primary after:absolute after:bottom-[3px] after:left-[13px] after:right-[13px] after:h-[2px] after:rounded-[1px] after:bg-primary"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search button */}
        <Link
          href="/search"
          className="ml-auto inline-flex items-center gap-[7px] rounded-sm border border-border bg-surface px-3 py-1.5 font-mono text-[13px] text-muted no-underline transition-colors duration-150 hover:border-primary hover:text-foreground"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span>搜索</span>
          <kbd className="rounded-[3px] border border-border px-[5px] py-px font-mono text-[11px] text-subtle">
            /
          </kbd>
        </Link>
      </div>
    </header>
  );
}
