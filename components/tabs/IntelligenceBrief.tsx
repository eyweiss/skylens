"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Eye,
  BookOpen,
  Target,
} from "lucide-react";
import type { StructuredBrief, BriefSignal, BriefThreat, BriefOpportunity, BriefWatchpoint } from "@/app/api/intelligence-brief/route";

// ─── Signal colours ────────────────────────────────────────────────────────────

const SIGNAL_COLORS: Record<string, string> = {
  "MARKET ALERT":    "#dc2626",
  "COMPETITOR MOVE": "#ea580c",
  "OPPORTUNITY":     "#16a34a",
  "REGULATORY":      "#2563eb",
  "TREND":           "#7c3aed",
};

const URGENCY_COLORS: Record<string, string> = {
  High:   "#ff5630",
  Medium: "#ffab00",
  Low:    "#36b37e",
};

const HORIZON_COLORS: Record<string, string> = {
  "Near term":   "#36b37e",
  "Medium term": "#2684ff",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 rounded"
          style={{
            backgroundColor: "var(--border)",
            width: i === lines - 1 ? "65%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border)", borderLeft: `4px solid ${accent}` }}
      >
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
        <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Article type ──────────────────────────────────────────────────────────────

interface Article {
  title: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  description: string | null;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function IntelligenceBrief() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [brief, setBrief] = useState<StructuredBrief | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

  const fetchBrief = useCallback(async (articleList: Article[]) => {
    if (articleList.length === 0) return;
    setBriefLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/intelligence-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: articleList.slice(0, 15) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setBrief(data.structured ?? null);
      setGeneratedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate brief");
    } finally {
      setBriefLoading(false);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      const fetched: Article[] = data.articles || [];
      setArticles(fetched);
      fetchBrief(fetched);
    } catch {
      setError("Failed to fetch news articles");
    } finally {
      setNewsLoading(false);
    }
  }, [fetchBrief]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const isLoading = newsLoading || briefLoading;

  const weekRange = (() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  })();

  return (
    <div className="space-y-6">
      {/* ── Brief Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Sparkles className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Weekly Intelligence Brief
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {weekRange}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "var(--accent)", color: "white" }}
            >
              AI Generated
            </span>
            {generatedAt && (
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                · Generated {generatedAt.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => fetchBrief(articles)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity disabled:opacity-50 hover:opacity-80"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--muted)",
            borderColor: "var(--border)",
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate Brief
        </button>
      </div>

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {error && (
        <div
          className="p-4 rounded-xl border text-sm"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "#ff7452" }}
        >
          {error}
        </div>
      )}

      {/* ── Loading state ─────────────────────────────────────────────────── */}
      {isLoading && !brief && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="h-11 animate-pulse" style={{ backgroundColor: "var(--border)" }} />
              <div className="p-5">
                <Skeleton lines={i === 0 ? 4 : 3} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Brief content ─────────────────────────────────────────────────── */}
      {brief && (
        <div className="space-y-4">
          {/* 1. Executive Summary */}
          <Section icon={BookOpen} title="Executive Summary" accent="#2684ff">
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {brief.executiveSummary}
            </p>
          </Section>

          {/* 2. Key Market Signals */}
          <Section icon={TrendingUp} title="Key Market Signals" accent="#7c3aed">
            <ul className="space-y-0">
              {(brief.signals as BriefSignal[]).map((sig, i) => {
                const color = SIGNAL_COLORS[sig.type] ?? "#6b7280";
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-3"
                    style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                  >
                    <span
                      className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide mt-0.5"
                      style={{
                        backgroundColor: color,
                        color: "white",
                        minWidth: "112px",
                        textAlign: "center",
                      }}
                    >
                      {sig.type || "NOTE"}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {sig.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Section>

          {/* 3. Threats to Watch */}
          <Section icon={AlertTriangle} title="Threats to Watch" accent="#ff5630">
            <div className="space-y-4">
              {(brief.threats as BriefThreat[]).map((threat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: "rgba(255,86,48,0.06)",
                    borderLeftColor: URGENCY_COLORS[threat.urgency] ?? "#ff5630",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: URGENCY_COLORS[threat.urgency]
                          ? `${URGENCY_COLORS[threat.urgency]}22`
                          : "transparent",
                        color: URGENCY_COLORS[threat.urgency] ?? "#ff5630",
                      }}
                    >
                      {threat.urgency} Urgency
                    </span>
                    {threat.exposedTo.map((party, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        {party}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm mb-2" style={{ color: "var(--foreground)" }}>
                    {threat.description}
                  </p>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    <span className="font-semibold">Recommended action: </span>
                    {threat.action}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 4. Opportunities */}
          <Section icon={Target} title="Opportunities" accent="#36b37e">
            <div className="space-y-4">
              {(brief.opportunities as BriefOpportunity[]).map((opp, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: "rgba(54,179,126,0.06)",
                    borderLeftColor: HORIZON_COLORS[opp.horizon] ?? "#36b37e",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: HORIZON_COLORS[opp.horizon]
                          ? `${HORIZON_COLORS[opp.horizon]}22`
                          : "transparent",
                        color: HORIZON_COLORS[opp.horizon] ?? "#36b37e",
                      }}
                    >
                      {opp.horizon}
                    </span>
                    {opp.beneficiary.map((party, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        {party}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm mb-2" style={{ color: "var(--foreground)" }}>
                    {opp.description}
                  </p>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    <span className="font-semibold">How to act: </span>
                    {opp.howToAct}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 5. Watchpoints for Next Week */}
          <Section icon={Eye} title="Watchpoints for Next Week" accent="#ffab00">
            <div className="space-y-3">
              {(brief.watchpoints as BriefWatchpoint[]).map((wp, i) => (
                <div
                  key={i}
                  className="flex gap-3 py-3"
                  style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                    style={{ backgroundColor: "rgba(255,171,0,0.14)", color: "#ffab00" }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                      {wp.item}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      {wp.why}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 6. Analyst Note */}
          <Section icon={Sparkles} title="Analyst Note" accent="var(--accent)">
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {brief.analystNote}
            </p>
          </Section>
        </div>
      )}

      {/* Footer note */}
      {(brief || isLoading) && (
        <div className="text-xs text-center" style={{ color: "var(--muted)" }}>
          Generated from the latest 15 aviation news articles · Refreshes every 3 hours
        </div>
      )}
    </div>
  );
}
