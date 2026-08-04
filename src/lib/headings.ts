// Pure heading utilities — safe to import from client components
// (no fs / server-only dependencies)

// Generate a stable anchor id from a heading's plain text.
// The raw text is used as the DOM id (UTF-8 ids are valid); hrefs must be
// encodeURIComponent-ed to survive URL encoding.
export function headingId(text: string): string {
  return encodeURIComponent(text);
}

// Extract level-2 heading texts from raw MDX content (for TOC navigation).
// Uses the m flag so `$` matches before \n even with CRLF line endings
// (`.` never matches \r, so per-line matching would fail on Windows files).
export function extractHeadings(mdx: string): string[] {
  const matches = mdx.match(/^##\s+(.+)$/gm);
  if (!matches) return [];
  return matches
    .map((m) => m.replace(/^##\s+/, ""))
    .map((h) => h.replace(/[*_`]/g, "").trim());
}
