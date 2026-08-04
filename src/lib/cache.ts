import fs from "fs";
import path from "path";

/**
 * Module-level cache that invalidates when any .mdx file under a content
 * directory changes (mtime fingerprint). Reading file *contents* is expensive;
 * stat-ing them is cheap. After a PATCH edit / new file, the fingerprint
 * changes and the next call recomputes — so the cache never serves stale data.
 */

const MARKERS = [".mdx"];

function collectFingerprint(dir: string): string {
  if (!fs.existsSync(dir)) return "0";
  const walk = (d: string): string[] => {
    const out: string[] = [];
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        out.push(...walk(full));
      } else if (MARKERS.some((m) => entry.name.endsWith(m))) {
        const st = fs.statSync(full);
        out.push(`${entry.name}:${st.mtimeMs}`);
      }
    }
    return out;
  };
  const parts = walk(dir);
  parts.sort();
  return `${parts.length}#${parts.join("|")}`;
}

export function memoizeOnContent<T>(contentDir: string, fn: () => T): () => T {
  let key = "";
  let value: T | null = null;
  return () => {
    const k = collectFingerprint(contentDir);
    if (k !== key || value === null) {
      key = k;
      value = fn();
    }
    return value as T;
  };
}
