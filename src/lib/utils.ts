import type { TagInfo } from "./types";
import { getAllRetroProjects } from "./retros";
import { getAllPitfalls } from "./pitfalls";

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
