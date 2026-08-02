import { NextRequest, NextResponse } from "next/server";
import { updateFrontmatter } from "@/lib/write";

// Allowed fields to be updated via API
const ALLOWED_FIELDS = ["understanding_score", "review_after", "review_status", "status"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ year: string; slug: string }> }
) {
  const { year, slug } = await params;
  const body = await request.json();

  // Filter to only allowed fields
  const updates: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update. Allowed: " + ALLOWED_FIELDS.join(", ") },
      { status: 400 }
    );
  }

  // Validate status enum
  if ("status" in updates && !["ongoing", "completed", "abandoned"].includes(updates.status as string)) {
    return NextResponse.json(
      { error: "status must be one of: ongoing, completed, abandoned" },
      { status: 400 }
    );
  }

  // Validate understanding_score range
  if ("understanding_score" in updates) {
    const score = updates.understanding_score;
    if (score !== null && (typeof score !== "number" || score < 1 || score > 5)) {
      return NextResponse.json(
        { error: "understanding_score must be null or an integer 1-5" },
        { status: 400 }
      );
    }
  }

  // Validate review_status enum
  if ("review_status" in updates) {
    const rs = updates.review_status;
    if (rs !== null && !["pending", "reviewing", "reviewed"].includes(rs as string)) {
      return NextResponse.json(
        { error: "review_status must be null or one of: pending, reviewing, reviewed" },
        { status: 400 }
      );
    }
  }

  const relativePath = `retros/${year}/${slug}/index.mdx`;
  const success = updateFrontmatter(relativePath, updates);

  if (!success) {
    return NextResponse.json(
      { error: `File not found: ${relativePath}` },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, updated: updates });
}
