"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ReviewStatus = "pending" | "reviewing" | "reviewed" | null;

interface Props {
  year: string;
  slug: string;
  initialScore: number | null;
  initialStatus: string;
  initialReviewStatus: ReviewStatus;
  initialReviewAfter: string | null;
}

const REVIEW_OPTIONS: { key: NonNullable<ReviewStatus>; label: string }[] = [
  { key: "pending", label: "待回顾" },
  { key: "reviewing", label: "回顾中" },
  { key: "reviewed", label: "已回顾" },
];

export default function RetroEditor({
  year,
  slug,
  initialScore,
  initialStatus,
  initialReviewStatus,
  initialReviewAfter,
}: Props) {
  const router = useRouter();

  const [score, setScore] = useState<number | null>(initialScore);
  const [status, setStatus] = useState(initialStatus);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>(initialReviewStatus);
  const [reviewAfter, setReviewAfter] = useState<string | null>(initialReviewAfter);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track whether anything changed vs initial values
  const isDirty =
    score !== initialScore ||
    status !== initialStatus ||
    reviewStatus !== initialReviewStatus ||
    reviewAfter !== initialReviewAfter;

  const handleConfirm = async () => {
    if (!isDirty || saving) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/retros/${year}/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          understanding_score: score,
          status,
          review_status: reviewStatus,
          review_after: reviewAfter,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `保存失败 (${res.status})`);
        return;
      }

      // Refresh server-rendered page data without full reload
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
          快速编辑
        </span>
        {isDirty && !saving && (
          <span className="font-mono text-xs text-state-warning">● 有未保存的修改</span>
        )}
        {saving && <span className="font-mono text-xs text-muted">保存中...</span>}
      </div>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-5">
        {/* Understanding score */}
        <div className="flex flex-col gap-[7px]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
            理解度
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setScore(score === i + 1 ? null : i + 1)}
                className={`h-[18px] w-[18px] rounded-[3px] border transition-all duration-100 ${
                  i < (score ?? 0)
                    ? "border-primary bg-primary hover:bg-primary-strong"
                    : "border-border-strong bg-transparent hover:border-primary hover:bg-[var(--tb-primary-tint)]"
                }`}
                aria-label={`理解度 ${i + 1}/5`}
              />
            ))}
            <span className="ml-2 font-mono text-[13px] text-muted">
              {score != null ? `${score} / 5` : "未评"}
            </span>
          </div>
        </div>

        {/* Project status */}
        <div className="flex flex-col gap-[7px]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
            状态
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-sunken p-[3px]">
            {([["ongoing", "进行中"], ["completed", "已完成"], ["abandoned", "已废弃"]] as const).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatus(key)}
                  className={`rounded-sm px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                    status === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Review status */}
        <div className="flex flex-col gap-[7px]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
            回顾状态
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-sunken p-[3px]">
            {REVIEW_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  const next = reviewStatus === key ? null : key;
                  setReviewStatus(next);
                  // Marking reviewed closes the loop: clear the review date
                  if (next === "reviewed") setReviewAfter(null);
                }}
                className={`rounded-sm px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                  reviewStatus === key
                    ? key === "reviewed"
                      ? "bg-state-success text-[#0d1117]"
                      : key === "reviewing"
                        ? "bg-state-info text-[#0d1117]"
                        : "bg-state-warning text-[#0d1117]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Review date (review_after) */}
        <div className="flex flex-col gap-[7px]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
            回顾日期
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={reviewAfter ?? ""}
              onChange={(e) => {
                setReviewAfter(e.target.value || null);
                // Setting a new date re-opens the review loop
                if (reviewStatus === "reviewed") setReviewStatus("pending");
              }}
              className="rounded-sm border border-border bg-sunken px-2.5 py-1 font-mono text-[13px] text-foreground outline-none transition-colors hover:border-border-strong focus:border-primary"
              style={{ colorScheme: "dark" }}
              aria-label="回顾日期"
            />
            {reviewAfter && (
              <button
                type="button"
                onClick={() => setReviewAfter(null)}
                className="rounded-sm border border-border bg-sunken px-2 py-1 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {/* Confirm button */}
        <div className="ml-auto flex items-center gap-3 self-end">
          {error && <span className="font-mono text-xs text-state-error">{error}</span>}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isDirty || saving}
            className={`rounded-sm px-4 py-1.5 font-mono text-[13px] font-semibold transition-all duration-150 ${
              isDirty && !saving
                ? "bg-primary text-primary-foreground hover:bg-primary-strong"
                : "cursor-not-allowed border border-border bg-sunken text-subtle"
            }`}
          >
            {saving ? "保存中..." : "确定"}
          </button>
        </div>
      </div>
    </div>
  );
}
