// Type definitions for the TraceBack retrospective system

export type ProjectStatus = "ongoing" | "completed" | "abandoned";
export type Severity = "low" | "medium" | "high";
export type ReviewStatus = "pending" | "reviewing" | "reviewed";

export interface CommitRef {
  hash: string;
  note: string;
}

export interface SubDoc {
  file: string;
  title: string;
}

export interface RetroFrontmatter {
  title: string;
  date: string;
  period?: string;
  status: ProjectStatus;
  tags: string[];
  template_version: number;
  summary: string;
  highlight?: string;
  understanding_score?: number | null;
  review_after?: string | null;
  review_status?: ReviewStatus | null;
  repo?: string;
  commits?: CommitRef[];
  prs?: string[];
  sub_docs?: SubDoc[];
}

export interface MilestoneFrontmatter {
  title: string;
  date: string;
  tags?: string[];
}

export interface PitfallFrontmatter {
  title: string;
  date: string;
  tags: string[];
  severity?: Severity;
  related_project?: string;
  resolved: boolean;
}

export interface RetroProject {
  slug: string;
  year: string;
  frontmatter: RetroFrontmatter;
  content: string;
  milestones: Milestone[];
  subDocs: SubDocContent[];
}

export interface Milestone {
  slug: string;
  frontmatter: MilestoneFrontmatter;
  content: string;
}

export interface SubDocContent {
  file: string;
  title: string;
  content: string;
}

export interface Pitfall {
  slug: string;
  year: string;
  frontmatter: PitfallFrontmatter;
  content: string;
}

export interface SearchIndexEntry {
  type: "retro" | "pitfall";
  slug: string;
  year: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
  date: string;
  status?: string;
  severity?: string;
  resolved?: boolean;
}

export interface TagInfo {
  name: string;
  count: number;
  retroCount: number;
  pitfallCount: number;
}

export interface DashboardStats {
  totalProjects: number;
  ongoing: number;
  completed: number;
  abandoned: number;
  totalPitfalls: number;
  pendingReview: number;
}
