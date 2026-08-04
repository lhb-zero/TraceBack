import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { memoizeOnContent } from "./cache";
import type {
  RetroProject,
  Milestone,
  SubDocContent,
  RetroFrontmatter,
  MilestoneFrontmatter,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "retros");

// Get all year directories (exclude _template)
function getYearDirs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_template" && /^\d{4}$/.test(d.name))
    .map((d) => d.name)
    .sort()
    .reverse();
}

// Get all project slugs for a given year
function getProjectSlugs(year: string): string[] {
  const yearDir = path.join(CONTENT_DIR, year);
  if (!fs.existsSync(yearDir)) return [];
  return fs
    .readdirSync(yearDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

// Read milestones from logs/ directory
function readMilestones(projectDir: string): Milestone[] {
  const logsDir = path.join(projectDir, "logs");
  if (!fs.existsSync(logsDir)) return [];

  return fs
    .readdirSync(logsDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const filePath = path.join(logsDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      // Normalize date fields
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().split("T")[0];
      }
      return {
        slug: file.replace(/\.mdx$/, ""),
        frontmatter: data as MilestoneFrontmatter,
        content: content.trim(),
      };
    });
}

// Read sub-documents (decisions.mdx, ai-collaboration.mdx, etc.)
function readSubDocs(projectDir: string, subDocDefs: { file: string; title: string }[]): SubDocContent[] {
  if (!subDocDefs || subDocDefs.length === 0) return [];

  return subDocDefs
    .map((def) => {
      const filePath = path.join(projectDir, def.file);
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, "utf-8");
      const { content } = matter(raw);
      return {
        file: def.file,
        title: def.title,
        content: content.trim(),
      };
    })
    .filter((d): d is SubDocContent => d !== null);
}

// Normalize date fields that gray-matter may parse as Date objects
function normalizeDates(data: Record<string, unknown>): void {
  for (const key of ["date", "review_after"]) {
    if (data[key] instanceof Date) {
      data[key] = (data[key] as Date).toISOString().split("T")[0];
    }
  }
}

// Normalize frontmatter so missing fields never leak `undefined` into render
function normalizeRetroFrontmatter(data: Record<string, unknown>, slug: string): RetroFrontmatter {
  const status = data.status as string;
  const reviewStatus = data.review_status as string;
  return {
    title: typeof data.title === "string" && data.title ? data.title : slug,
    date: typeof data.date === "string" ? data.date : "",
    period: typeof data.period === "string" ? data.period : undefined,
    status: ["ongoing", "completed", "abandoned"].includes(status)
      ? (status as RetroFrontmatter["status"])
      : "ongoing",
    tags: Array.isArray(data.tags)
      ? data.tags.filter((t): t is string => typeof t === "string")
      : [],
    template_version: typeof data.template_version === "number" ? data.template_version : 1,
    summary: typeof data.summary === "string" ? data.summary : "",
    highlight: typeof data.highlight === "string" ? data.highlight : undefined,
    understanding_score: typeof data.understanding_score === "number" ? data.understanding_score : null,
    review_after: typeof data.review_after === "string" ? data.review_after : null,
    review_status: ["pending", "reviewing", "reviewed"].includes(reviewStatus)
      ? (reviewStatus as RetroFrontmatter["review_status"])
      : null,
    repo: typeof data.repo === "string" ? data.repo : undefined,
    commits: Array.isArray(data.commits) ? data.commits : undefined,
    prs: Array.isArray(data.prs) ? data.prs : undefined,
    sub_docs: Array.isArray(data.sub_docs) ? data.sub_docs : undefined,
  };
}

// Get a single project by year and slug
export function getRetroProject(year: string, slug: string): RetroProject | null {
  const projectDir = path.join(CONTENT_DIR, year, slug);
  const indexPath = path.join(projectDir, "index.mdx");

  if (!fs.existsSync(indexPath)) return null;

  const raw = fs.readFileSync(indexPath, "utf-8");
  const { data, content } = matter(raw);
  normalizeDates(data);
  const frontmatter = normalizeRetroFrontmatter(data, slug);

  const milestones = readMilestones(projectDir);
  const subDocs = readSubDocs(projectDir, frontmatter.sub_docs || []);

  return {
    slug,
    year,
    frontmatter,
    content: content.trim(),
    milestones,
    subDocs,
  };
}

// Get all projects (sorted by date descending), cached by content mtime
export const getAllRetroProjects = memoizeOnContent(CONTENT_DIR, () => {
  const years = getYearDirs();
  const projects: RetroProject[] = [];

  for (const year of years) {
    const slugs = getProjectSlugs(year);
    for (const slug of slugs) {
      const project = getRetroProject(year, slug);
      if (project) projects.push(project);
    }
  }

  return projects.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
});

// Get all unique tags with counts
export function getRetroTags(): Map<string, number> {
  const tags = new Map<string, number>();
  for (const project of getAllRetroProjects()) {
    for (const tag of project.frontmatter.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    }
  }
  return tags;
}

// Get projects by tag
export function getRetroProjectsByTag(tag: string): RetroProject[] {
  return getAllRetroProjects().filter((p) => p.frontmatter.tags.includes(tag));
}

// Get all project slugs (for static generation)
export function getAllRetroSlugs(): { year: string; slug: string }[] {
  const years = getYearDirs();
  const slugs: { year: string; slug: string }[] = [];

  for (const year of years) {
    for (const slug of getProjectSlugs(year)) {
      slugs.push({ year, slug });
    }
  }

  return slugs;
}

// Find a retro project by its slug across all years (for cross-links
// from pitfalls' `related_project`, which only stores the slug).
export function findRetroBySlug(
  slug: string
): { year: string; slug: string; title: string; date: string } | null {
  const hit = getAllRetroSlugs().find((s) => s.slug === slug);
  if (!hit) return null;
  const project = getRetroProject(hit.year, hit.slug);
  if (!project) return null;
  return {
    year: hit.year,
    slug: hit.slug,
    title: project.frontmatter.title,
    date: project.frontmatter.date,
  };
}
