import { NextRequest, NextResponse } from "next/server";
import { updateFrontmatter } from "@/lib/write";

// Allowed fields to be updated via API
const ALLOWED_FIELDS = ["resolved", "severity"];

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

  // Validate resolved is boolean
  if ("resolved" in updates && typeof updates.resolved !== "boolean") {
    return NextResponse.json(
      { error: "resolved must be a boolean" },
      { status: 400 }
    );
  }

  // Validate severity enum
  if ("severity" in updates) {
    const sev = updates.severity;
    if (sev !== null && !["low", "medium", "high"].includes(sev as string)) {
      return NextResponse.json(
        { error: "severity must be null or one of: low, medium, high" },
        { status: 400 }
      );
    }
  }

  const relativePath = `pitfalls/${year}/${slug}.mdx`;
  const success = updateFrontmatter(relativePath, updates);

  if (!success) {
    return NextResponse.json(
      { error: `File not found: ${relativePath}` },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, updated: updates });
}
