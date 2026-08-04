import type { TagInfo, DashboardStats } from "./types";
import { getAllRetroProjects, getPendingReviewProjects } from "./retros";
import { getAllPitfalls } from "./pitfalls";

// Compute dashboard statistics
export function getDashboardStats(): DashboardStats {
  const projects = getAllRetroProjects();
  const pitfalls = getAllPitfalls();
  const pendingReview = getPendingReviewProjects();

  return {
    totalProjects: projects.length,
    ongoing: projects.filter((p) => p.frontmatter.status === "ongoing").length,
    completed: projects.filter((p) => p.frontmatter.status === "completed").length,
    abandoned: projects.filter((p) => p.frontmatter.status === "abandoned").length,
    totalPitfalls: pitfalls.length,
    pendingReview: pendingReview.length,
  };
}

// Get all tags (merged from retros + pitfalls) with counts
export function getAllTags(): TagInfo[] {
  const projects = getAllRetroProjects();
  const pitfalls = getAllPitfalls();
  const tagMap = new Map<string, { retroCount: number; pitfallCount: number }>();

  for (const project of projects) {
    for (const tag of project.frontmatter.tags) {
      const entry = tagMap.get(tag) || { retroCount: 0, pitfallCount: 0 };
      entry.retroCount++;
      tagMap.set(tag, entry);
    }
  }

  for (const pitfall of pitfalls) {
    for (const tag of pitfall.frontmatter.tags) {
      const entry = tagMap.get(tag) || { retroCount: 0, pitfallCount: 0 };
      entry.pitfallCount++;
      tagMap.set(tag, entry);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, { retroCount, pitfallCount }]) => ({
      name,
      count: retroCount + pitfallCount,
      retroCount,
      pitfallCount,
    }))
    .sort((a, b) => b.count - a.count);
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Strip markdown/MDX content to plain text (for search indexing)
export function stripMarkdown(content: string): string {
  return content
    .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]+`/g, "") // Remove inline code
    .replace(/#{1,6}\s/g, "") // Remove headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links -> text
    .replace(/[*_~]{1,3}/g, "") // Remove emphasis markers
    .replace(/\n{2,}/g, "\n") // Collapse multiple newlines
    .trim();
}

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
