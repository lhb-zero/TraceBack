import type { ComponentPropsWithoutRef } from "react";

/* ============================================================
   MDX component overrides — TraceBack design tokens
   Maps raw HTML elements from MDX to styled components.
   ============================================================ */

function H2(props: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className="mt-10 mb-4 border-l-2 border-primary pl-4 text-[22px] font-bold tracking-[-0.015em] text-foreground first:mt-0"
      {...props}
    />
  );
}

function H3(props: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className="mt-8 mb-3 text-[17px] font-semibold text-foreground"
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
    <p className="mb-4 text-base leading-[1.8] text-foreground" {...props} />
  );
}

function Ul(props: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className="mb-4 list-none space-y-2 pl-0"
      {...props}
    />
  );
}

function Ol(props: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className="mb-4 list-decimal space-y-2 pl-6 marker:font-mono marker:text-sm marker:text-primary"
      {...props}
    />
  );
}

function Li(props: ComponentPropsWithoutRef<"li">) {
  return (
    <li
      className="relative pl-6 text-base leading-[1.8] text-foreground before:absolute before:left-0 before:top-0 before:font-mono before:font-semibold before:text-primary before:content-['—']"
      {...props}
    />
  );
}

function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="my-5 rounded-r-sm border-l-2 border-primary bg-[var(--tb-primary-tint)] px-5 py-3.5"
      {...props}
    />
  );
}

function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return (
    <div className="my-5 overflow-hidden rounded-md border border-border">
      <pre
        className="overflow-x-auto bg-sunken p-4 font-mono text-[13px] leading-[1.7] text-foreground"
        {...props}
      />
    </div>
  );
}

function InlineCode(props: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="rounded-sm border border-border bg-sunken px-1.5 py-px font-mono text-[0.92em] text-primary-strong"
      {...props}
    />
  );
}

function A(props: ComponentPropsWithoutRef<"a">) {
  const isExternal = props.href?.startsWith("http");
  return (
    <a
      className="text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary-strong hover:decoration-primary"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}

function Hr(props: ComponentPropsWithoutRef<"hr">) {
  return <hr className="my-8 border-border" {...props} />;
}

function Strong(props: ComponentPropsWithoutRef<"strong">) {
  return <strong className="font-semibold text-foreground" {...props} />;
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-5 overflow-x-auto rounded-md border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  );
}

function Th(props: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="border-b border-border bg-surface px-4 py-2.5 text-left font-mono text-xs font-semibold uppercase tracking-[0.04em] text-subtle"
      {...props}
    />
  );
}

function Td(props: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-border px-4 py-2.5 text-foreground"
      {...props}
    />
  );
}

// Placeholder for future custom components (e.g. <UnderstandingVerification />)
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
  code: InlineCode,
  a: A,
  hr: Hr,
  strong: Strong,
  table: Table,
  th: Th,
  td: Td,
};
