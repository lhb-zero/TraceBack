"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  year: string;
  slug: string;
  initialResolved: boolean;
  initialSeverity: string | null;
}

export default function PitfallEditor({
  year,
  slug,
  initialResolved,
  initialSeverity,
}: Props) {
  const router = useRouter();

  const [resolved, setResolved] = useState(initialResolved);
  const [severity, setSeverity] = useState<string | null>(initialSeverity);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty =
    resolved !== initialResolved || severity !== initialSeverity;

  const handleConfirm = async () => {
    if (!isDirty || saving) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/pitfalls/${year}/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved, severity }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `保存失败 (${res.status})`);
        return;
      }

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
        {/* Resolved status */}
        <div className="flex flex-col gap-[7px]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
            解决状态
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-sunken p-[3px]">
            {([["false", "未解决"], ["true", "已解决"]] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setResolved(key === "true")}
                className={`rounded-sm px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                  String(resolved) === key
                    ? key === "true"
                      ? "bg-state-success text-[#0d1117]"
                      : "bg-state-warning text-[#0d1117]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="flex flex-col gap-[7px]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
            严重程度
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-sunken p-[3px]">
            {([["low", "轻微"], ["medium", "中等"], ["high", "严重"]] as const).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSeverity(severity === key ? null : key)}
                  className={`rounded-sm px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                    severity === key
                      ? key === "high"
                        ? "bg-state-error text-[#0d1117]"
                        : key === "medium"
                          ? "bg-state-warning text-[#0d1117]"
                          : "bg-state-neutral text-[#0d1117]"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              )
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
