// Pure helpers for search keyword highlighting.
// No dependencies (safe for client components), unit-testable with node:test.

export interface HighlightSegment {
  part: string;
  hit: boolean;
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Split query into deduped, lowercased search terms. */
export function queryTerms(query: string): string[] {
  const seen = new Set<string>();
  for (const t of query.trim().split(/\s+/)) {
    if (t) seen.add(t.toLowerCase());
  }
  return [...seen];
}

/**
 * Build a "snippet" of `text` centered around the first keyword hit.
 * Without this, a long summary may hide the matching part entirely.
 */
export function makeSnippet(text: string, terms: string[], max = 120): string {
  if (text.length <= max) return text;
  const re = new RegExp(terms.map(escapeRegExp).join("|"), "i");
  const m = re.exec(text);
  if (!m) return text.slice(0, max) + "…";
  const start = Math.max(0, m.index - 40);
  const end = Math.min(text.length, start + max);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

/**
 * Split `text` into segments, marking every keyword occurrence as `hit`.
 * Case-insensitive; segments keep original casing.
 */
export function splitHighlight(text: string, terms: string[]): HighlightSegment[] {
  if (!terms.length || !text) return [{ part: text, hit: false }];
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return text.split(re).map((part, i) => ({ part, hit: i % 2 === 1 }));
}
