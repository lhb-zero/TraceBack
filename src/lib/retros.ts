import fs from "fs";
import path from "path";
import matter from "gray-matter";
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

// Get a single project by year and slug
export function getRetroProject(year: string, slug: string): RetroProject | null {
  const projectDir = path.join(CONTENT_DIR, year, slug);
  const indexPath = path.join(projectDir, "index.mdx");

  if (!fs.existsSync(indexPath)) return null;

  const raw = fs.readFileSync(indexPath, "utf-8");
  const { data, content } = matter(raw);
  normalizeDates(data);
  const frontmatter = data as RetroFrontmatter;

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

// Get all projects (sorted by date descending)
export function getAllRetroProjects(): RetroProject[] {
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
}

// Get projects pending review (review_after <= today)
export function getPendingReviewProjects(): RetroProject[] {
  const today = new Date().toISOString().split("T")[0];
  return getAllRetroProjects().filter(
    (p) => p.frontmatter.review_after && p.frontmatter.review_after <= today
  );
}

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
