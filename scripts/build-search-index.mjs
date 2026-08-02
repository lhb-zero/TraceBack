/**
 * Build search index for Fuse.js client-side search.
 * Run: node scripts/build-search-index.mjs
 * Output: public/search-index.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUTPUT_DIR = path.join(ROOT, "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "search-index.json");

// Strip markdown to plain text for search
function stripMarkdown(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]{1,3}/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// Collect all retro projects
function collectRetros() {
  const retrosDir = path.join(CONTENT_DIR, "retros");
  const entries = [];

  if (!fs.existsSync(retrosDir)) return entries;

  const years = fs
    .readdirSync(retrosDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_template" && /^\d{4}$/.test(d.name))
    .map((d) => d.name);

  for (const year of years) {
    const yearDir = path.join(retrosDir, year);
    const projects = fs
      .readdirSync(yearDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const slug of projects) {
      const indexPath = path.join(yearDir, slug, "index.mdx");
      if (!fs.existsSync(indexPath)) continue;

      const raw = fs.readFileSync(indexPath, "utf-8");
      const { data, content } = matter(raw);

      entries.push({
        type: "retro",
        slug,
        year,
        title: data.title || slug,
        summary: data.summary || "",
        tags: data.tags || [],
        content: stripMarkdown(content).slice(0, 2000),
        date: data.date || "",
        status: data.status || "",
      });

      // Also index milestone logs
      const logsDir = path.join(yearDir, slug, "logs");
      if (fs.existsSync(logsDir)) {
        const logs = fs.readdirSync(logsDir).filter((f) => f.endsWith(".mdx"));
        for (const log of logs) {
          const logRaw = fs.readFileSync(path.join(logsDir, log), "utf-8");
          const { data: logData, content: logContent } = matter(logRaw);
          entries.push({
            type: "retro",
            slug: `${slug}/logs/${log.replace(/\.mdx$/, "")}`,
            year,
            title: `${data.title || slug} — ${logData.title || log}`,
            summary: logData.title || "",
            tags: logData.tags || data.tags || [],
            content: stripMarkdown(logContent).slice(0, 1500),
            date: logData.date || "",
            status: data.status || "",
          });
        }
      }
    }
  }

  return entries;
}

// Collect all pitfalls
function collectPitfalls() {
  const pitfallsDir = path.join(CONTENT_DIR, "pitfalls");
  const entries = [];

  if (!fs.existsSync(pitfallsDir)) return entries;

  const years = fs
    .readdirSync(pitfallsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}$/.test(d.name))
    .map((d) => d.name);

  for (const year of years) {
    const yearDir = path.join(pitfallsDir, year);
    const files = fs.readdirSync(yearDir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(yearDir, file), "utf-8");
      const { data, content } = matter(raw);

      entries.push({
        type: "pitfall",
        slug,
        year,
        title: data.title || slug,
        summary: data.title || "",
        tags: data.tags || [],
        content: stripMarkdown(content).slice(0, 2000),
        date: data.date || "",
        severity: data.severity || "",
        resolved: data.resolved ?? true,
      });
    }
  }

  return entries;
}

// Main
function main() {
  const retros = collectRetros();
  const pitfalls = collectPitfalls();
  const index = [...retros, ...pitfalls];

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), "utf-8");
  console.log(`Search index built: ${index.length} entries (${retros.length} retros, ${pitfalls.length} pitfalls)`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main();
