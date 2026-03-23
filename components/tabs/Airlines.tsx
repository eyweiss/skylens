"use client";

import { useState } from "react";
import { Plane, ChevronDown, ChevronUp } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

type AirlineRegion = "North America" | "Europe" | "Middle East" | "Asia-Pacific" | "Other";
type FilterRegion = "All" | AirlineRegion;
type StrategicDirection = "Hub Builder" | "LCC" | "Premium" | "Leisure" | "Regional" | "Gulf Carrier";
type ThreatLevel = "High" | "Medium" | "Low";

interface Airline {
  name: string;
  country: string;
  iata: string;
  hub: string;
  fleet: number;
  region: AirlineRegion;
  strategicDirection: StrategicDirection;
  recentMoves: string[];
  targetMarkets: string[];
  threatLevel: ThreatLevel;
  threatReason: string;
  costPosition: number;    // 0–100: Low Cost → High Cost
  networkStrength: number; // 0–100: Regional → Global
}

// ─── Color maps ────────────────────────────────────────────────────────────────

const directionColors: Record<StrategicDirection, string> = {
  "Hub Builder": "#2684ff",
  "LCC":         "#ff8b00",
  "Premium":     "#8777d9",
  "Leisure":     "#36b37e",
  "Regional":    "#6b778c",
  "Gulf Carrier":"#00b8d9",
};

const directionBg: Record<StrategicDirection, string> = {
  "Hub Builder": "rgba(38,132,255,0.14)",
  "LCC":         "rgba(255,139,0,0.14)",
  "Premium":     "rgba(135,119,217,0.14)",
  "Leisure":     "rgba(54,179,126,0.14)",
  "Regional":    "rgba(107,119,140,0.14)",
  "Gulf Carrier":"rgba(0,184,217,0.14)",
};

const threatColor: Record<ThreatLevel, string> = {
  High:   "#ff5630",
  Medium: "#ffab00",
  Low:    "#6b778c",
};

const threatBg: Record<ThreatLevel, string> = {
  High:   "rgba(255,86,48,0.14)",
  Medium: "rgba(255,171,0,0.14)",
  Low:    "rgba(107,119,140,0.14)",
};

const regionColorsDark: Record<string, string> = {
  "North America": "#2684ff",
  "Europe":        "#36b37e",
  "Middle East":   "#ffab00",
  "Asia-Pacific":  "#ff7452",
  "Other":         "#8777d9",
};

// ─── Airline data ──────────────────────────────────────────────────────────────

const airlines: Airline[] = [
  {
    name: "American Airlines", country: "United States", iata: "AA", hub: "DFW", fleet: 950, region: "North America",
    strategicDirection: "Hub Builder",
    recentMoves: [
      "Expanding transatlantic joint venture with British Airways",
      "Reducing unprofitable domestic routes to cut costs",
      "Premium cabin investment and flagship lounge upgrades at hubs",
    ],
    targetMarkets: ["Business travelers", "Corporate accounts", "Premium leisure"],
    threatLevel: "High",
    threatReason: "Dominant hub network and deep BA partnership give AA unmatched transatlantic pricing power.",
    costPosition: 62, networkStrength: 83,
  },
  {
    name: "Delta Air Lines", country: "United States", iata: "DL", hub: "ATL", fleet: 1000, region: "North America",
    strategicDirection: "Premium",
    recentMoves: [
      "Rolling out Delta One Suites across the widebody fleet",
      "Expanding SkyMiles premium credit card partnerships",
      "Growing equity stake in Air France-KLM for deeper Atlantic coordination",
    ],
    targetMarkets: ["Premium travelers", "Corporate accounts", "Business travelers"],
    threatLevel: "High",
    threatReason: "Industry-leading loyalty program and premium cabin margins make Delta the benchmark competitor.",
    costPosition: 68, networkStrength: 85,
  },
  {
    name: "United Airlines", country: "United States", iata: "UA", hub: "ORD", fleet: 900, region: "North America",
    strategicDirection: "Hub Builder",
    recentMoves: [
      "United Next fleet expansion with 270+ aircraft on order",
      "Polaris premium cabin upgrades across the widebody fleet",
      "Aggressively rebuilding Pacific network post-COVID",
    ],
    targetMarkets: ["Corporate accounts", "International travelers", "Business travelers"],
    threatLevel: "High",
    threatReason: "Unique hub geography spanning all three US coasts gives United unrivaled domestic-to-international feed.",
    costPosition: 65, networkStrength: 84,
  },
  {
    name: "Southwest Airlines", country: "United States", iata: "WN", hub: "DAL", fleet: 770, region: "North America",
    strategicDirection: "LCC",
    recentMoves: [
      "Introducing assigned seating following activist investor pressure",
      "Launching premium cabin product in 2026 to stem share loss",
      "Pruning underperforming domestic markets for profitability",
    ],
    targetMarkets: ["Leisure travelers", "Price-sensitive flyers", "Short-haul domestic"],
    threatLevel: "Medium",
    threatReason: "Largest domestic US LCC with a loyal customer base and point-to-point model that bypasses hub congestion.",
    costPosition: 18, networkStrength: 38,
  },
  {
    name: "Air Canada", country: "Canada", iata: "AC", hub: "YYZ", fleet: 180, region: "North America",
    strategicDirection: "Hub Builder",
    recentMoves: [
      "Expanding Aeroplan credit card partnerships with TD and CIBC",
      "Growing Toronto Pearson as a primary North Atlantic hub",
      "Adding widebody capacity to Asia-Pacific routes post-COVID",
    ],
    targetMarkets: ["Canadian domestic travelers", "Transatlantic premium", "Corporate accounts"],
    threatLevel: "Medium",
    threatReason: "Controls the dominant share of Canadian aviation with a growing international premium footprint.",
    costPosition: 60, networkStrength: 72,
  },
  {
    name: "Lufthansa", country: "Germany", iata: "LH", hub: "FRA", fleet: 300, region: "Europe",
    strategicDirection: "Premium",
    recentMoves: [
      "Acquiring 41% stake in ITA Airways to expand southern European feed",
      "Launching Allegris premium cabin product on long-haul routes",
      "Integrating Swiss and Austrian sub-brands for group-wide synergies",
    ],
    targetMarkets: ["Business travelers", "Premium leisure", "Corporate accounts"],
    threatLevel: "High",
    threatReason: "Europe's largest airline group with unmatched hub dominance in Frankfurt and multiple premium sub-brands.",
    costPosition: 72, networkStrength: 87,
  },
  {
    name: "Ryanair", country: "Ireland", iata: "FR", hub: "DUB", fleet: 580, region: "Europe",
    strategicDirection: "LCC",
    recentMoves: [
      "Ordering 300 additional Boeing 737 MAX jets to secure capacity advantage",
      "Expanding primary airport strategy to reduce dependence on slot-constrained hubs",
      "Launching Ryanair Labs initiative for ancillary revenue technology",
    ],
    targetMarkets: ["Leisure travelers", "Price-sensitive Europeans", "Short-haul intra-EU"],
    threatLevel: "Medium",
    threatReason: "Europe's largest airline by passenger volume with relentless cost discipline and aggressive capacity growth.",
    costPosition: 8, networkStrength: 42,
  },
  {
    name: "Air France-KLM", country: "France", iata: "AF", hub: "CDG", fleet: 550, region: "Europe",
    strategicDirection: "Hub Builder",
    recentMoves: [
      "Scaling Flying Blue loyalty program across all subsidiaries",
      "Expanding Transavia LCC operations across Southern Europe",
      "Deepening Delta equity partnership for transatlantic coordination",
    ],
    targetMarkets: ["Premium leisure", "Business travelers", "Transatlantic corporate"],
    threatLevel: "High",
    threatReason: "Twin-hub model at CDG and AMS gives AF-KLM dominant European long-haul feed and full SkyTeam scale.",
    costPosition: 65, networkStrength: 86,
  },
  {
    name: "IAG / British Airways", country: "United Kingdom", iata: "BA", hub: "LHR", fleet: 280, region: "Europe",
    strategicDirection: "Premium",
    recentMoves: [
      "Club Suite rollout completing across entire long-haul fleet",
      "Expanding Iberia as a cost-effective European feeder hub",
      "Growing American Airlines transatlantic joint venture scope",
    ],
    targetMarkets: ["Premium travelers", "Business travelers", "Corporate accounts"],
    threatLevel: "High",
    threatReason: "Heathrow's slot constraints create a near-impenetrable moat for BA's premium transatlantic franchise.",
    costPosition: 75, networkStrength: 83,
  },
  {
    name: "easyJet", country: "United Kingdom", iata: "U2", hub: "LTN", fleet: 340, region: "Europe",
    strategicDirection: "LCC",
    recentMoves: [
      "Growing easyJet holidays package business to increase per-passenger revenue",
      "Expanding at primary European airports following disputes with Ryanair",
      "Investing in cabin refresh and in-flight Wi-Fi rollout",
    ],
    targetMarkets: ["Leisure travelers", "Price-sensitive Europeans", "Short-haul city-pairs"],
    threatLevel: "Low",
    threatReason: "Focused on leisure short-haul where it competes primarily with Ryanair rather than network carriers.",
    costPosition: 20, networkStrength: 35,
  },
  {
    name: "Emirates", country: "UAE", iata: "EK", hub: "DXB", fleet: 260, region: "Middle East",
    strategicDirection: "Gulf Carrier",
    recentMoves: [
      "A380 network expansion adding 8 new destinations to the fleet",
      "Challenging Lufthansa and AF-KLM on European connecting traffic",
      "Premium economy rollout accelerating across long-haul fleet",
    ],
    targetMarkets: ["Premium leisure", "Business travelers", "Connecting traffic"],
    threatLevel: "High",
    threatReason: "Dubai hub model enables Emirates to undercut legacy carriers on virtually any intercontinental routing.",
    costPosition: 55, networkStrength: 92,
  },
  {
    name: "Qatar Airways", country: "Qatar", iata: "QR", hub: "DOH", fleet: 230, region: "Middle East",
    strategicDirection: "Gulf Carrier",
    recentMoves: [
      "Launching QSuite Next Gen product on A380 fleet",
      "Expanding codeshares following IAG equity stake increase",
      "Growing oneworld influence through new carrier partnerships",
    ],
    targetMarkets: ["Business travelers", "Premium leisure", "Connecting traffic"],
    threatLevel: "High",
    threatReason: "Consistently rated world's best airline with a product and network that directly challenges every premium carrier.",
    costPosition: 60, networkStrength: 90,
  },
  {
    name: "Etihad Airways", country: "UAE", iata: "EY", hub: "AUH", fleet: 100, region: "Middle East",
    strategicDirection: "Gulf Carrier",
    recentMoves: [
      "Returning to sustained profitability after a decade of equity alliance losses",
      "Rightsizing the network following Alitalia and airberlin collapses",
      "Targeting disciplined growth without new minority equity partnerships",
    ],
    targetMarkets: ["Premium travelers", "Abu Dhabi connecting traffic", "Business travelers"],
    threatLevel: "Medium",
    threatReason: "Rebuilt as a leaner carrier with Abu Dhabi government backing, but limited scale caps competitive reach.",
    costPosition: 62, networkStrength: 68,
  },
  {
    name: "Turkish Airlines", country: "Turkey", iata: "TK", hub: "IST", fleet: 430, region: "Middle East",
    strategicDirection: "Hub Builder",
    recentMoves: [
      "Fully operational at Istanbul Airport, one of the world's largest hubs",
      "Flying to more countries than any other airline globally",
      "Expanding MRO and cargo operations as revenue diversifiers",
    ],
    targetMarkets: ["Connecting traffic", "Price-conscious international", "Emerging market travelers"],
    threatLevel: "High",
    threatReason: "Istanbul's geography lets Turkish undercut Gulf carriers on Africa/Asia routes while rivaling European hubs.",
    costPosition: 42, networkStrength: 88,
  },
  {
    name: "flydubai", country: "UAE", iata: "FZ", hub: "DXB", fleet: 80, region: "Middle East",
    strategicDirection: "LCC",
    recentMoves: [
      "Deepening code-share integration with Emirates across the network",
      "Opening new Boeing 737 MAX routes across Africa and Central Asia",
      "Expanding premium economy on select medium-haul routes",
    ],
    targetMarkets: ["Price-sensitive travelers", "Secondary market feed for Emirates", "Leisure travelers"],
    threatLevel: "Low",
    threatReason: "Primarily feeds the Dubai hub rather than competing independently, limiting direct competitive impact.",
    costPosition: 22, networkStrength: 48,
  },
  {
    name: "Singapore Airlines", country: "Singapore", iata: "SQ", hub: "SIN", fleet: 130, region: "Asia-Pacific",
    strategicDirection: "Premium",
    recentMoves: [
      "Acquiring Air India stake via Tata Group partnership",
      "Launching redesigned Suites product on A380 routes",
      "Expanding dedicated cargo freighter capacity post-pandemic",
    ],
    targetMarkets: ["Premium travelers", "Business travelers", "Premium leisure"],
    threatLevel: "High",
    threatReason: "World-class product and Singapore's strategic location make SQ the benchmark for Asia-Pacific premium travel.",
    costPosition: 78, networkStrength: 84,
  },
  {
    name: "Cathay Pacific", country: "Hong Kong", iata: "CX", hub: "HKG", fleet: 200, region: "Asia-Pacific",
    strategicDirection: "Premium",
    recentMoves: [
      "Fully rebuilding capacity after COVID disruption and pilot shortage",
      "Launching The Aria Suite on new A330-900neo routes",
      "Strengthening Hong Kong cargo hub position with freighter investment",
    ],
    targetMarkets: ["Premium travelers", "Business travelers", "Hong Kong connecting traffic"],
    threatLevel: "Medium",
    threatReason: "Strong premium brand but Hong Kong hub constraints limit growth versus rival Asian hubs.",
    costPosition: 70, networkStrength: 76,
  },
  {
    name: "ANA", country: "Japan", iata: "NH", hub: "NRT", fleet: 230, region: "Asia-Pacific",
    strategicDirection: "Hub Builder",
    recentMoves: [
      "Expanding Star Alliance partnerships across Southeast Asia",
      "Growing Narita and Haneda international slot allocations",
      "Launching ANA Neo economy product on long-haul routes",
    ],
    targetMarkets: ["Japanese corporate accounts", "International business travelers", "Premium leisure"],
    threatLevel: "Medium",
    threatReason: "Japan's largest airline with a strong corporate base but constrained international growth due to slot limits.",
    costPosition: 65, networkStrength: 74,
  },
  {
    name: "Japan Airlines", country: "Japan", iata: "JL", hub: "NRT", fleet: 220, region: "Asia-Pacific",
    strategicDirection: "Premium",
    recentMoves: [
      "Ordering 20 Airbus A350-900s for fleet modernization",
      "Expanding oneworld connections via Haneda slot allocation",
      "Launching a global refresh of JAL Business Class product",
    ],
    targetMarkets: ["Premium travelers", "Japanese corporate", "Transatlantic business"],
    threatLevel: "Medium",
    threatReason: "Recovering strongly post-bankruptcy with a focused premium strategy and renewed fleet investment.",
    costPosition: 68, networkStrength: 72,
  },
  {
    name: "Qantas", country: "Australia", iata: "QF", hub: "SYD", fleet: 130, region: "Asia-Pacific",
    strategicDirection: "Premium",
    recentMoves: [
      "Project Sunrise ultra-long-haul service launching in 2026",
      "Acquiring Air Noumea to expand Pacific island presence",
      "Premium cabin refresh across domestic and international fleet",
    ],
    targetMarkets: ["Premium travelers", "Australian corporate accounts", "Premium leisure"],
    threatLevel: "Medium",
    threatReason: "Dominant Australian carrier with a loyal Frequent Flyer program and unique ultra-long-haul ambitions.",
    costPosition: 67, networkStrength: 72,
  },
];

// ─── Custom scatter tooltip ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = payload[0]?.payload as any;
  if (!d) return null;
  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        minWidth: 180,
      }}
    >
      <div className="text-sm font-bold mb-1" style={{ color: "var(--foreground)" }}>
        {d.name}
      </div>
      <div
        className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full inline-block"
        style={{
          backgroundColor: directionBg[d.strategicDirection as StrategicDirection],
          color: directionColors[d.strategicDirection as StrategicDirection],
        }}
      >
        {d.strategicDirection}
      </div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
        Hub: <span style={{ color: "var(--foreground)" }}>{d.hub}</span>
      </div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        Fleet: <span style={{ color: "var(--foreground)" }}>{d.fleet.toLocaleString()}</span>
      </div>
      <div className="text-xs mt-1" style={{ color: threatColor[d.threatLevel as ThreatLevel] }}>
        {d.threatLevel} Threat
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function Airlines() {
  const [regionFilter, setRegionFilter] = useState<FilterRegion>("All");
  const [view, setView] = useState<"cards" | "map">("cards");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const highThreatCount = airlines.filter((a) => a.threatLevel === "High").length;

  const regionFilters: FilterRegion[] = ["All", "North America", "Europe", "Middle East", "Asia-Pacific"];

  const filtered = regionFilter === "All" ? airlines : airlines.filter((a) => a.region === regionFilter);
  const grouped = filtered.reduce<Record<string, Airline[]>>((acc, a) => {
    if (!acc[a.region]) acc[a.region] = [];
    acc[a.region].push(a);
    return acc;
  }, {});

  const scatterData = airlines.map((a) => ({
    x: a.costPosition,
    y: a.networkStrength,
    z: a.fleet,
    name: a.name,
    iata: a.iata,
    hub: a.hub,
    fleet: a.fleet,
    strategicDirection: a.strategicDirection,
    threatLevel: a.threatLevel,
  }));

  return (
    <div className="space-y-5">
      {/* ── Summary stats bar ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <div className="kpi-card">
          <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {airlines.length}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Airlines tracked
          </div>
        </div>
        <div className="kpi-card">
          <div className="text-2xl font-bold" style={{ color: "#ff5630" }}>
            {highThreatCount}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            High threat
          </div>
        </div>
        {(
          [
            { label: "Americas",     region: "North America" as AirlineRegion, color: "#2684ff" },
            { label: "Europe",       region: "Europe"        as AirlineRegion, color: "#36b37e" },
            { label: "Mid East",     region: "Middle East"   as AirlineRegion, color: "#ffab00" },
            { label: "Asia-Pacific", region: "Asia-Pacific"  as AirlineRegion, color: "#ff7452" },
          ] as const
        ).map(({ label, region, color }) => (
          <div key={region} className="kpi-card">
            <div className="text-2xl font-bold" style={{ color }}>
              {airlines.filter((a) => a.region === region).length}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── View toggle + region filter ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* View toggle */}
        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          {(["cards", "map"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: view === v ? "var(--accent)" : "transparent",
                color: view === v ? "#fff" : "var(--muted)",
              }}
            >
              {v === "cards" ? "Card View" : "Competitive Map"}
            </button>
          ))}
        </div>

        {/* Region filter – card view only */}
        {view === "cards" && (
          <div className="flex gap-2 flex-wrap">
            {regionFilters.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                style={{
                  backgroundColor: regionFilter === r ? "var(--accent)" : "var(--card)",
                  color: regionFilter === r ? "#fff" : "var(--muted)",
                  borderColor: regionFilter === r ? "var(--accent)" : "var(--border)",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Card View ─────────────────────────────────────────────────────── */}
      {view === "cards" &&
        Object.entries(grouped).map(([region, items]) => (
          <div key={region}>
            {/* Region heading */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: regionColorsDark[region] || "#2684ff" }}
              />
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {region}
              </h3>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                ({items.length} airlines)
              </span>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {items.map((a) => {
                const isExpanded = expanded.has(a.name);
                const dirColor = directionColors[a.strategicDirection];
                return (
                  <div
                    key={a.name}
                    className="rounded-xl border overflow-hidden"
                    style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                  >
                    {/* Card body */}
                    <div className="p-4">
                      {/* Name + IATA */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                            {a.name}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                            {a.country}
                          </div>
                        </div>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--accent-light)",
                            color: regionColorsDark[region] || "#2684ff",
                          }}
                        >
                          {a.iata}
                        </span>
                      </div>

                      {/* Strategic direction + threat badges */}
                      <div className="flex gap-1.5 flex-wrap mb-3">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: directionBg[a.strategicDirection], color: dirColor }}
                        >
                          {a.strategicDirection}
                        </span>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: threatBg[a.threatLevel],
                            color: threatColor[a.threatLevel],
                          }}
                        >
                          {a.threatLevel} Threat
                        </span>
                      </div>

                      {/* Hub & Fleet */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>Hub</div>
                          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                            {a.hub}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>Fleet</div>
                          <div className="flex items-center gap-1">
                            <Plane className="w-3 h-3" style={{ color: "var(--accent)" }} />
                            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                              {a.fleet.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fleet bar – colored by strategic direction */}
                      <div className="mt-3">
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (a.fleet / 1000) * 100)}%`,
                              backgroundColor: dirColor,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleExpanded(a.name)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs border-t transition-colors hover:opacity-80"
                      style={{ color: "var(--muted)", borderColor: "var(--border)" }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" /> Hide details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" /> Route Intelligence
                        </>
                      )}
                    </button>

                    {/* Expandable: route intelligence */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                        <div>
                          <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
                            Recent Moves
                          </div>
                          <ul className="space-y-1.5">
                            {a.recentMoves.map((move, i) => (
                              <li key={i} className="text-xs flex gap-2" style={{ color: "var(--foreground)" }}>
                                <span style={{ color: dirColor, flexShrink: 0 }}>•</span>
                                {move}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
                            Target Markets
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {a.targetMarkets.map((m, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>
                            Threat to Competitors
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                            {a.threatReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* ── Competitive Map ───────────────────────────────────────────────── */}
      {view === "map" && (
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="mb-1">
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Competitive Positioning Map
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Bubble size = fleet size. Hover for details.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 mb-4">
            {(Object.entries(directionColors) as [StrategicDirection, string][]).map(([dir, color]) => (
              <div key={dir} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {dir}
                </span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={480}>
            <ScatterChart margin={{ top: 10, right: 30, bottom: 48, left: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 100]}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                tickLine={false}
                label={{
                  value: "Cost Position  (Low Cost → High Cost)",
                  position: "insideBottom",
                  offset: -32,
                  fill: "var(--muted)",
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[0, 100]}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                tickLine={false}
                label={{
                  value: "Network Strength  (Regional → Global)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -34,
                  fill: "var(--muted)",
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" dataKey="z" domain={[80, 1000]} range={[40, 700]} />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              {/* Quadrant dividers */}
              <ReferenceLine x={50} stroke="var(--border)" strokeDasharray="5 4" strokeWidth={1.5} />
              <ReferenceLine y={50} stroke="var(--border)" strokeDasharray="5 4" strokeWidth={1.5} />
              <Scatter data={scatterData} fillOpacity={0.82}>
                {scatterData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={directionColors[entry.strategicDirection as StrategicDirection]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
