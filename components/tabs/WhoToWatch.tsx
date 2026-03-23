"use client";

import { Eye, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { Airlines } from "./Airlines";

// These counts mirror the threat data in Airlines.tsx
// High = 10, Medium = 7, Low = 3  (from the 20-airline dataset)
const HIGH_THREAT = 10;
const MEDIUM_THREAT = 7;
const LOW_THREAT = 3;

export function WhoToWatch() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Eye className="w-5 h-5" style={{ color: "var(--accent)" }} />
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Who to Watch
          </h2>
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Competitive threat assessment across global carriers
        </p>
      </div>

      {/* Why It Matters */}
      <div
        className="p-5 rounded-xl border-l-4"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          borderLeftColor: "var(--accent)",
        }}
      >
        <div className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--accent)" }}>
          Why It Matters
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          These carriers are making moves that could affect your routes, your hubs, or your customer
          segments. Track their fleet orders, route launches, and partnership moves to stay ahead.
          The competitive landscape shifts faster than most strategic plans account for — use this
          view to anticipate, not react.
        </p>
      </div>

      {/* Threat Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="p-4 rounded-xl border flex items-center gap-3"
          style={{ backgroundColor: "var(--card)", borderColor: "rgba(255,86,48,0.3)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,86,48,0.12)" }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "#ff5630" }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: "#ff5630" }}>
              {HIGH_THREAT}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              High threat carriers
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border flex items-center gap-3"
          style={{ backgroundColor: "var(--card)", borderColor: "rgba(255,171,0,0.3)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,171,0,0.12)" }}
          >
            <AlertCircle className="w-5 h-5" style={{ color: "#ffab00" }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: "#ffab00" }}>
              {MEDIUM_THREAT}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              Carriers to monitor
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border flex items-center gap-3"
          style={{ backgroundColor: "var(--card)", borderColor: "rgba(54,179,126,0.3)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(54,179,126,0.12)" }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: "#36b37e" }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: "#36b37e" }}>
              {LOW_THREAT}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              Stable competitors
            </div>
          </div>
        </div>
      </div>

      {/* Airlines component — full card view + competitive map */}
      <Airlines />
    </div>
  );
}
