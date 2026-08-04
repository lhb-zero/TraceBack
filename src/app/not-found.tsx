import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <TopNav activeKey="" />
      <main className="flex-1">
        <div className="mx-auto flex max-w-[900px] flex-col items-center px-6 py-24 text-center">
          <div className="font-mono text-[72px] font-bold leading-none tracking-[-0.03em] text-primary">
            404
          </div>
          <p className="mt-5 text-[17px] font-semibold text-foreground">页面不存在</p>
          <p className="mt-2 font-mono text-[13px] text-muted">
            内容可能被移动或删除了 · 检查一下链接？
          </p>
          <Link
            href="/"
            className="mt-9 rounded-sm bg-primary px-5 py-2.5 font-mono text-[13px] font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary-strong"
          >
            返回首页
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
