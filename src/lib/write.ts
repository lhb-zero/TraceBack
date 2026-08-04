import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Update specific frontmatter fields in an MDX file without touching the body.
 * Returns true on success, false if file not found.
 * `contentDir` is injectable for tests (defaults to the real content/).
 */
export function updateFrontmatter(
  relativePath: string,
  updates: Record<string, unknown>,
  contentDir: string = CONTENT_DIR
): boolean {
  const filePath = path.join(contentDir, relativePath);

  if (!fs.existsSync(filePath)) return false;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Merge updates into existing frontmatter
  const updated = { ...data, ...updates };

  // Rebuild the file: frontmatter + original body
  const output = matter.stringify(content, updated);
  fs.writeFileSync(filePath, output, "utf-8");

  return true;
}
