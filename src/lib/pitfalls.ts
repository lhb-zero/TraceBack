import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Pitfall, PitfallFrontmatter } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "pitfalls");

// Get all year directories (exclude _template.mdx)
function getYearDirs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}$/.test(d.name))
    .map((d) => d.name)
    .sort()
    .reverse();
}

// Normalize date fields that gray-matter may parse as Date objects
function normalizeDates(data: Record<string, unknown>): void {
  for (const key of ["date"]) {
    if (data[key] instanceof Date) {
      data[key] = (data[key] as Date).toISOString().split("T")[0];
    }
  }
}

// Get a single pitfall by year and slug
export function getPitfall(year: string, slug: string): Pitfall | null {
  const filePath = path.join(CONTENT_DIR, year, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  normalizeDates(data);

  return {
    slug,
    year,
    frontmatter: data as PitfallFrontmatter,
    content: content.trim(),
  };
}

// Get all pitfalls (sorted by date descending)
export function getAllPitfalls(): Pitfall[] {
  const years = getYearDirs();
  const pitfalls: Pitfall[] = [];

  for (const year of years) {
    const yearDir = path.join(CONTENT_DIR, year);
    const files = fs.readdirSync(yearDir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const pitfall = getPitfall(year, slug);
      if (pitfall) pitfalls.push(pitfall);
    }
  }

  return pitfalls.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

// Get pitfalls related to a specific project
export function getPitfallsByProject(projectSlug: string): Pitfall[] {
  return getAllPitfalls().filter(
    (p) => p.frontmatter.related_project === projectSlug
  );
}

// Get all unique pitfall tags with counts
export function getPitfallTags(): Map<string, number> {
  const tags = new Map<string, number>();
  for (const pitfall of getAllPitfalls()) {
    for (const tag of pitfall.frontmatter.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    }
  }
  return tags;
}

// Get pitfalls by tag
export function getPitfallsByTag(tag: string): Pitfall[] {
  return getAllPitfalls().filter((p) => p.frontmatter.tags.includes(tag));
}

// Get all pitfall slugs (for static generation)
export function getAllPitfallSlugs(): { year: string; slug: string }[] {
  const years = getYearDirs();
  const slugs: { year: string; slug: string }[] = [];

  for (const year of years) {
    const yearDir = path.join(CONTENT_DIR, year);
    const files = fs.readdirSync(yearDir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      slugs.push({ year, slug: file.replace(/\.mdx$/, "") });
    }
  }

  return slugs;
}
