import { Children, isValidElement, type ComponentPropsWithoutRef } from "react";
import CodeBlock from "./CodeBlock";

/* ============================================================
   MDX component overrides — TraceBack 深色开发者档案馆
   面向中文长文重读：行高 2.0、字距 +0.01em、段落 pretty 折行。
   结构即信息：h2 由 CSS 计数器自动编号（01–05），对应固定的复盘维度序列。
   签名元素：引用块（理解验证/根因分析）= 作者自己的声音。
   代码块交由 CodeBlock（语言标签页 + 复制）；行内/块级 code 样式由 CSS 处理。
   ============================================================ */

function H2(props: ComponentPropsWithoutRef<"h2">) {
  // Build a stable anchor id from the heading text (matches extractHeadings in utils)
  const text = Children.toArray(props.children)
    .map((c) => (typeof c === "string" ? c : ""))
    .join("")
    .trim();
  // scroll offset must clear TopNav (60px) + sticky sub-doc nav (~40px)
  return (
    <h2
      id={text ? text : undefined}
      className="tb-h2 mt-12 mb-5 scroll-mt-[120px] border-b border-border pb-3 text-[21px] font-bold leading-[1.3] tracking-[-0.015em] text-foreground first:mt-0"
      {...props}
    />
  );
}

function H3(props: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className="mt-8 mb-3 text-[17px] font-semibold leading-[1.4] text-foreground before:mr-2.5 before:inline-block before:text-[11px] before:text-primary before:content-['◆']"
      {...props}
    />
  );
}

function H4(props: ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      className="mt-6 mb-2 text-[15px] font-semibold text-foreground"
      {...props}
    />
  );
}

function P(props: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className="mb-5 text-base leading-[2.0] tracking-[0.01em] text-foreground [text-wrap:pretty]"
      {...props}
    />
  );
}

function Ul(props: ComponentPropsWithoutRef<"ul">) {
  return <ul className="tb-ul mb-5 list-none space-y-2.5 pl-0" {...props} />;
}

function Ol(props: ComponentPropsWithoutRef<"ol">) {
  return <ol className="tb-ol mb-5 list-none space-y-2.5 pl-0" {...props} />;
}

function Li(props: ComponentPropsWithoutRef<"li">) {
  return (
    <li
      className="relative pl-7 text-base leading-[1.9] tracking-[0.01em] text-foreground"
      {...props}
    />
  );
}

/* 签名元素：理解验证 / 根因分析 —— 作者自己的声音 */
function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="tb-quote-mark relative my-6 rounded-r-md border-l-2 border-primary bg-[var(--tb-primary-tint)] px-5 py-4 transition-colors duration-200 hover:bg-[var(--tb-primary-tint-strong)] [&_p]:mb-0 [&_p]:text-[15px] [&_p]:leading-[1.9]"
      {...props}
    />
  );
}

function A(props: ComponentPropsWithoutRef<"a">) {
  const isExternal = props.href?.startsWith("http");
  return (
    <a
      className="font-medium text-primary underline decoration-primary/40 decoration-1 underline-offset-[3px] transition-colors duration-150 hover:text-primary-strong hover:decoration-primary-strong"
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...props}
    >
      {props.children}
      {isExternal ? <span aria-hidden="true"> ↗</span> : null}
    </a>
  );
}

function Hr(props: ComponentPropsWithoutRef<"hr">) {
  return <hr className="my-10 border-border" {...props} />;
}

function Strong(props: ComponentPropsWithoutRef<"strong">) {
  return <strong className="font-semibold text-foreground" {...props} />;
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-md border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  );
}

function Th(props: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="border-b border-border bg-surface px-4 py-2.5 text-left font-mono text-xs font-semibold uppercase tracking-[0.05em] text-subtle"
      {...props}
    />
  );
}

function Td(props: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-border px-4 py-2.5 align-top leading-[1.7] text-foreground transition-colors duration-150"
      {...props}
    />
  );
}

function Tr(props: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr
      className="transition-colors duration-150 last:[&>td]:border-b-0 hover:bg-surface-2"
      {...props}
    />
  );
}

function Img(props: ComponentPropsWithoutRef<"img">) {
  return (
    <img
      className="my-6 max-w-full rounded-md border border-border"
      loading="lazy"
      {...props}
    />
  );
}

/* pre wrapper: extract code language on the server side and pass it down
   as a prop, so the client CodeBlock renders identically during hydration */
function Pre(props: ComponentPropsWithoutRef<"pre">) {
  let lang = "";
  const child = props.children;
  if (isValidElement(child)) {
    const cls = (child.props as { className?: string })?.className || "";
    const m = cls.match(/language-([\w-]+)/);
    if (m) lang = m[1];
  }
  return <CodeBlock lang={lang} {...props} />;
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  pre: Pre,
  a: A,
  hr: Hr,
  strong: Strong,
  table: Table,
  th: Th,
  td: Td,
  tr: Tr,
  img: Img,
};
