"use client";

import { TrendingUp, AlertTriangle, Leaf, Globe, ShieldAlert, HelpCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ─── Static data ───────────────────────────────────────────────────────────────

const kpis = [
  { label: "Commercial Aviation Market 2025", value: "$388B", sub: "Global market size" },
  { label: "Projected Market Size 2032", value: "$697B", sub: "+79% growth" },
  { label: "Aircraft on Order Globally", value: "26,000+", sub: "Record backlog" },
  { label: "Annual Passenger Growth CAGR", value: "4.7%", sub: "2025–2032 forecast" },
];

const marketData = [
  { year: "2020", market: 198, passengers: 1.8 },
  { year: "2021", market: 238, passengers: 2.3 },
  { year: "2022", market: 290, passengers: 3.2 },
  { year: "2023", market: 340, passengers: 3.9 },
  { year: "2024", market: 368, passengers: 4.3 },
  { year: "2025", market: 388, passengers: 4.7 },
  { year: "2026", market: 418, passengers: 5.1 },
  { year: "2027", market: 458, passengers: 5.6 },
  { year: "2028", market: 502, passengers: 6.1 },
  { year: "2029", market: 548, passengers: 6.6 },
  { year: "2030", market: 598, passengers: 7.2 },
  { year: "2031", market: 648, passengers: 7.8 },
  { year: "2032", market: 697, passengers: 8.4 },
];

const regionData = [
  { region: "North America", share: 32, aircraft: 7400 },
  { region: "Europe", share: 26, aircraft: 5800 },
  { region: "Asia-Pacific", share: 28, aircraft: 6200 },
  { region: "Middle East", share: 8, aircraft: 1800 },
  { region: "Other", share: 6, aircraft: 1400 },
];

const trends = [
  {
    icon: TrendingUp,
    title: "Narrowbody Dominance",
    desc: "737 MAX and A320neo backlog at record highs, with airlines prioritizing fuel-efficient narrowbodies for short-haul recovery.",
  },
  {
    icon: AlertTriangle,
    title: "Supply Chain Crisis Delaying Deliveries",
    desc: "Component shortages, labor disputes, and quality control issues are pushing aircraft delivery timelines 12–24 months behind schedule across all OEMs.",
  },
  {
    icon: Leaf,
    title: "Sustainability Pressure Accelerating SAF and Hybrid Programs",
    desc: "Regulatory mandates and investor pressure are forcing OEMs and carriers to accelerate sustainable aviation fuel adoption and next-gen propulsion R&D.",
  },
  {
    icon: Globe,
    title: "Asia-Pacific Becoming World's Largest Aviation Market",
    desc: "Rapid middle-class growth in India, China, and Southeast Asia is driving unprecedented demand for new aircraft and airport capacity.",
  },
  {
    icon: ShieldAlert,
    title: "Boeing Quality Crisis Opening Doors for Airbus and COMAC",
    desc: "Ongoing safety and quality scrutiny at Boeing has accelerated Airbus order intake and created a rare market opening for China's COMAC in non-Western markets.",
  },
];

// ─── State of the Market indicators ───────────────────────────────────────────

type IndicatorStatus = "growing" | "stable" | "contracting" | "tight" | "balanced" | "oversupply" | "strong" | "moderate" | "weak";

interface MarketIndicator {
  label: string;
  value: string;
  status: IndicatorStatus;
  description: string;
}

const marketIndicators: MarketIndicator[] = [
  {
    label: "Demand Health",
    value: "Growing",
    status: "growing",
    description: "Passenger volumes continue recovering above pre-pandemic baselines in most regions.",
  },
  {
    label: "Capacity Discipline",
    value: "Oversupply Risk",
    status: "oversupply",
    description: "Several markets are adding seats faster than demand is recovering, especially Southeast Asia.",
  },
  {
    label: "Yield Environment",
    value: "Moderate",
    status: "moderate",
    description: "Yields holding in premium cabins; economy yields under pressure from LCC capacity additions.",
  },
];

const indicatorColor: Record<IndicatorStatus, string> = {
  growing:     "#36b37e",
  stable:      "#ffab00",
  contracting: "#ff5630",
  tight:       "#36b37e",
  balanced:    "#ffab00",
  oversupply:  "#ff5630",
  strong:      "#36b37e",
  moderate:    "#ffab00",
  weak:        "#ff5630",
};

const indicatorBg: Record<IndicatorStatus, string> = {
  growing:     "rgba(54,179,126,0.12)",
  stable:      "rgba(255,171,0,0.12)",
  contracting: "rgba(255,86,48,0.12)",
  tight:       "rgba(54,179,126,0.12)",
  balanced:    "rgba(255,171,0,0.12)",
  oversupply:  "rgba(255,86,48,0.12)",
  strong:      "rgba(54,179,126,0.12)",
  moderate:    "rgba(255,171,0,0.12)",
  weak:        "rgba(255,86,48,0.12)",
};

// ─── Strategic Questions ───────────────────────────────────────────────────────

const strategicQuestions = [
  {
    question: "Where is capacity growing faster than demand?",
    answer:
      "Southeast Asia and transatlantic leisure routes seeing aggressive seat additions outpacing demand recovery.",
  },
  {
    question: "Which competitor segment is most aggressive?",
    answer:
      "Gulf carriers expanding European feed aggressively via IST and DXB hubs, pressuring legacy European carriers.",
  },
  {
    question: "What macro factor poses the biggest risk?",
    answer:
      "US government shutdown creating TSA staffing gaps at major hubs, suppressing near-term domestic demand.",
  },
  {
    question: "Where is the biggest opportunity?",
    answer:
      "Premium leisure demand outpacing economy — carriers with strong premium cabin product seeing significant yield uplift.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function MarketPulse() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : true;
  const gridColor = isDark ? "#1a2a4a" : "#dde3f0";
  const textColor = isDark ? "#7a8aaa" : "#6b7a99";
  const accent = isDark ? "#2684ff" : "#0052cc";

  return (
    <div className="space-y-8">
      {/* ── State of the Market ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            State of the Market
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--border)", color: "var(--muted)" }}>
            Q1 2026
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {marketIndicators.map((ind) => (
            <div
              key={ind.label}
              className="p-5 rounded-xl border"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                {ind.label}
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-2"
                style={{
                  backgroundColor: indicatorBg[ind.status],
                  color: indicatorColor[ind.status],
                }}
              >
                {ind.value}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {ind.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key Strategic Questions ──────────────────────────────────────── */}
      <div>
        <h3 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Key Strategic Questions This Quarter
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strategicQuestions.map((q, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <div className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
                  {q.question}
                </div>
              </div>
              <p className="text-sm leading-relaxed pl-6" style={{ color: "var(--muted)" }}>
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="text-3xl font-bold mb-1" style={{ color: accent }}>
              {k.value}
            </div>
            <div className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
              {k.label}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-card p-6">
          <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Global Market Size Trend ($B)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={marketData}>
              <defs>
                <linearGradient id="marketGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="year" tick={{ fill: textColor, fontSize: 11 }} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0d1829" : "#fff",
                  border: `1px solid ${gridColor}`,
                  borderRadius: 8,
                  color: isDark ? "#e8edf5" : "#0c1a3d",
                }}
              />
              <Area
                type="monotone"
                dataKey="market"
                stroke={accent}
                strokeWidth={2}
                fill="url(#marketGrad)"
                name="Market ($B)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card p-6">
          <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Regional Fleet Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: textColor, fontSize: 11 }} />
              <YAxis dataKey="region" type="category" tick={{ fill: textColor, fontSize: 11 }} width={110} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0d1829" : "#fff",
                  border: `1px solid ${gridColor}`,
                  borderRadius: 8,
                  color: isDark ? "#e8edf5" : "#0c1a3d",
                }}
              />
              <Bar dataKey="aircraft" fill={accent} name="Aircraft" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Key Trends ───────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Key Market Trends
        </h3>
        <div className="space-y-3">
          {trends.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="flex gap-4 p-4 rounded-xl border"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "var(--accent-light)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    {t.title}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {t.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
