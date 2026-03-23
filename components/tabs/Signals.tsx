"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Radio } from "lucide-react";

type SignalType =
  | "Fleet Order"
  | "Route Launch"
  | "Route Exit"
  | "Partnership"
  | "Pricing Move"
  | "Hub Investment"
  | "Leadership Change"
  | "Financial"
  | "Regulatory";

type Audience = "Airlines" | "Airports" | "OEMs";
type Urgency = "High" | "Medium" | "Low";

interface CompetitiveSignal {
  company: string;
  signalType: SignalType;
  headline: string;
  interpretation: string;
  whoShouldCare: Audience[];
  urgency: Urgency;
  source: string;
}

const SIGNAL_TYPE_COLORS: Record<SignalType, string> = {
  "Fleet Order":       "#2563eb",
  "Route Launch":      "#16a34a",
  "Route Exit":        "#dc2626",
  "Partnership":       "#7c3aed",
  "Pricing Move":      "#ea580c",
  "Hub Investment":    "#0891b2",
  "Leadership Change": "#6b7280",
  "Financial":         "#d97706",
  "Regulatory":        "#4338ca",
};

const URGENCY_COLORS: Record<Urgency, string> = {
  High:   "#dc2626",
  Medium: "#d97706",
  Low:    "#6b7280",
};

const SIGNAL_TYPE_FILTERS: ("All" | SignalType)[] = [
  "All",
  "Fleet Order",
  "Route Launch",
  "Partnership",
  "Pricing Move",
  "Hub Investment",
  "Financial",
  "Regulatory",
];

const AUDIENCE_FILTERS: ("All" | Audience)[] = ["All", "Airlines", "Airports", "OEMs"];

function SkeletonCard() {
  return (
    <div
      className="p-5 rounded-xl border animate-pulse"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 space-y-2 w-36">
          <div className="h-4 rounded" style={{ backgroundColor: "var(--border)", width: "80%" }} />
          <div className="h-5 rounded-full" style={{ backgroundColor: "var(--border)" }} />
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--border)" }} />
            <div className="h-3 rounded w-10" style={{ backgroundColor: "var(--border)" }} />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded" style={{ backgroundColor: "var(--border)", width: "90%" }} />
          <div className="h-4 rounded" style={{ backgroundColor: "var(--border)", width: "70%" }} />
          <div className="h-3 rounded mt-2" style={{ backgroundColor: "var(--border)", width: "85%" }} />
          <div className="flex gap-2 mt-3">
            <div className="h-5 rounded-full w-16" style={{ backgroundColor: "var(--border)" }} />
            <div className="h-5 rounded-full w-16" style={{ backgroundColor: "var(--border)" }} />
          </div>
        </div>
        <div className="flex-shrink-0 w-24 space-y-2">
          <div className="h-3 rounded" style={{ backgroundColor: "var(--border)" }} />
        </div>
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: CompetitiveSignal }) {
  const typeColor = SIGNAL_TYPE_COLORS[signal.signalType] ?? "#6b7280";
  const urgencyColor = URGENCY_COLORS[signal.urgency];

  return (
    <div
      className="p-5 rounded-xl border transition-all hover:shadow-sm"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start gap-4">
        {/* Left column */}
        <div className="flex-shrink-0 w-36 space-y-2">
          <div className="text-sm font-bold leading-tight" style={{ color: "var(--foreground)" }}>
            {signal.company}
          </div>
          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: typeColor, color: "white" }}
          >
            {signal.signalType}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: urgencyColor }}
            />
            <span className="text-xs font-medium" style={{ color: urgencyColor }}>
              {signal.urgency}
            </span>
          </div>
        </div>

        {/* Middle column */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug mb-1.5" style={{ color: "var(--foreground)" }}>
            {signal.headline}
          </p>
          <p className="text-xs leading-relaxed italic" style={{ color: "var(--muted)" }}>
            {signal.interpretation}
          </p>
          {signal.whoShouldCare.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {signal.whoShouldCare.map((audience) => (
                <span
                  key={audience}
                  className="px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{
                    color: "var(--foreground)",
                    borderColor: "var(--border)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  {audience}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex-shrink-0 text-right space-y-1 w-24">
          <Radio className="w-4 h-4 ml-auto" style={{ color: "var(--muted)" }} />
          <p className="text-xs leading-tight" style={{ color: "var(--muted)" }}>
            {signal.source}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Signals() {
  const [signals, setSignals] = useState<CompetitiveSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [typeFilter, setTypeFilter] = useState<"All" | SignalType>("All");
  const [audienceFilter, setAudienceFilter] = useState<"All" | Audience>("All");

  const fetchSignals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/signals");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setSignals(Array.isArray(data.signals) ? data.signals : []);
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch signals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const filtered = signals.filter((s) => {
    if (typeFilter !== "All" && s.signalType !== typeFilter) return false;
    if (audienceFilter !== "All" && !s.whoShouldCare.includes(audienceFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            Competitive Signals
          </h2>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {lastFetched
              ? `Classified intelligence from the aviation market · Updated ${lastFetched.toLocaleTimeString()}`
              : "Classified intelligence from the aviation market"}
          </div>
        </div>
        <button
          onClick={fetchSignals}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--muted)",
            borderColor: "var(--border)",
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Signal type filter */}
      <div className="flex gap-2 flex-wrap">
        {SIGNAL_TYPE_FILTERS.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={{
              backgroundColor: typeFilter === type ? "var(--accent)" : "var(--card)",
              color: typeFilter === type ? "#fff" : "var(--muted)",
              borderColor: typeFilter === type ? "var(--accent)" : "var(--border)",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Audience filter */}
      <div className="flex gap-2 flex-wrap">
        {AUDIENCE_FILTERS.map((aud) => (
          <button
            key={aud}
            onClick={() => setAudienceFilter(aud)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={{
              backgroundColor: audienceFilter === aud ? "var(--foreground)" : "var(--card)",
              color: audienceFilter === aud ? "var(--background)" : "var(--muted)",
              borderColor: audienceFilter === aud ? "var(--foreground)" : "var(--border)",
            }}
          >
            {aud}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div
          className="p-4 rounded-xl border text-sm"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <div className="font-semibold mb-1" style={{ color: "#ff7452" }}>
            Could not load signals
          </div>
          <div className="mb-3">{error}</div>
          <button
            onClick={fetchSignals}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--muted)", backgroundColor: "var(--background)" }}
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && !error && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Signal cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((signal, i) => (
            <SignalCard key={i} signal={signal} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && signals.length === 0 && (
        <div
          className="p-8 rounded-xl border text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <Radio className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            No signals detected. Refresh to analyze latest news.
          </div>
        </div>
      )}

      {/* Empty filter state */}
      {!loading && !error && signals.length > 0 && filtered.length === 0 && (
        <div
          className="p-8 rounded-xl border text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <Radio className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            No signals match the selected filters.
          </div>
        </div>
      )}

      {/* Footer note */}
      {!loading && !error && signals.length > 0 && (
        <div className="text-xs text-center pb-2" style={{ color: "var(--muted)" }}>
          Powered by Claude AI · Refreshes every 2 hours
        </div>
      )}
    </div>
  );
}
