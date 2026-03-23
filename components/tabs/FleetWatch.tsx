"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plane } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Manufacturer = "Boeing" | "Airbus" | "Mixed";
type Timeline = "Near term (1-2yr)" | "Medium (3-5yr)";

interface FleetOrder {
  airline: string;
  iata: string;
  aircraft: string;
  quantity: number;
  manufacturer: Manufacturer;
  strategic: string;
  threatenedParties: string[];
  affectedRoutes: string;
  timeline: Timeline;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const orders: FleetOrder[] = [
  {
    airline: "IndiGo",
    iata: "6E",
    aircraft: "A320neo family",
    quantity: 500,
    manufacturer: "Airbus",
    strategic: "The largest single aircraft order in history signals massive India domestic expansion — IndiGo is betting on becoming the dominant carrier in the world's fastest-growing aviation market.",
    threatenedParties: ["Air India", "SpiceJet", "IndiGo regional competitors"],
    affectedRoutes: "All major Indian domestic trunk routes; secondary city development",
    timeline: "Medium (3-5yr)",
  },
  {
    airline: "Air India",
    iata: "AI",
    aircraft: "250 Airbus + 220 Boeing (mixed)",
    quantity: 470,
    manufacturer: "Mixed",
    strategic: "Post-Tata transformation fleet renewal positions Air India to compete with IndiGo domestically and with Gulf carriers on international routes for the first time in decades.",
    threatenedParties: ["IndiGo", "Emirates", "Etihad", "Singapore Airlines"],
    affectedRoutes: "India-Middle East, India-Europe, India-Southeast Asia corridors",
    timeline: "Medium (3-5yr)",
  },
  {
    airline: "American Airlines",
    iata: "AA",
    aircraft: "Boeing 737 MAX",
    quantity: 260,
    manufacturer: "Boeing",
    strategic: "Domestic network modernization — retiring older 737NG variants and right-sizing regional capacity to focus on profitable hub markets.",
    threatenedParties: ["United Airlines", "Delta Air Lines", "Southwest Airlines"],
    affectedRoutes: "US domestic hub-and-spoke; select short-haul transatlantic",
    timeline: "Near term (1-2yr)",
  },
  {
    airline: "United Airlines",
    iata: "UA",
    aircraft: "200 Boeing 737 MAX + 100 Boeing 787",
    quantity: 300,
    manufacturer: "Boeing",
    strategic: "Dual investment in domestic capacity (MAX) and international hub expansion (787) signals United's intent to compete on both coasts and across the Pacific simultaneously.",
    threatenedParties: ["American Airlines", "Delta Air Lines", "Japan Airlines", "ANA"],
    affectedRoutes: "US domestic; Transpacific; US-Europe premium routes",
    timeline: "Near term (1-2yr)",
  },
  {
    airline: "Ryanair",
    iata: "FR",
    aircraft: "Boeing 737 MAX-10",
    quantity: 300,
    manufacturer: "Boeing",
    strategic: "European LCC dominance play — the 737 MAX-10 enables Ryanair to expand range to Southern and Eastern European markets previously out of economic reach.",
    threatenedParties: ["easyJet", "Wizz Air", "legacy European carriers on short-haul"],
    affectedRoutes: "Intra-European routes; emerging Eastern European markets",
    timeline: "Medium (3-5yr)",
  },
  {
    airline: "Emirates",
    iata: "EK",
    aircraft: "150 A350 + 35 777X",
    quantity: 185,
    manufacturer: "Airbus",
    strategic: "Long-haul premium expansion with A350 enables point-to-point routes without Dubai hub, while 777X replacement maintains ultra-long-haul capacity — threatening every major hub carrier's connecting traffic.",
    threatenedParties: ["Lufthansa", "British Airways", "Singapore Airlines", "Cathay Pacific"],
    affectedRoutes: "Europe-Asia; Europe-Australasia; transatlantic via Dubai",
    timeline: "Medium (3-5yr)",
  },
  {
    airline: "Qatar Airways",
    iata: "QR",
    aircraft: "A350F freighter",
    quantity: 25,
    manufacturer: "Airbus",
    strategic: "Cargo diversification into dedicated freighters signals Qatar's intent to decouple revenue from passenger volumes and compete directly with FedEx and DHL on express cargo.",
    threatenedParties: ["Lufthansa Cargo", "Air France Cargo", "Emirates SkyCargo"],
    affectedRoutes: "Asia-Europe cargo lanes; transpacific express cargo",
    timeline: "Medium (3-5yr)",
  },
  {
    airline: "Delta Air Lines",
    iata: "DL",
    aircraft: "Airbus A321neo",
    quantity: 100,
    manufacturer: "Airbus",
    strategic: "Domestic premium focus — A321neo's range and cabin flexibility allows Delta to deploy a premium product on transcontinental and select transatlantic routes, defending yield against United and American.",
    threatenedParties: ["American Airlines", "United Airlines", "JetBlue"],
    affectedRoutes: "US transcontinental; select narrow-body transatlantic routes",
    timeline: "Near term (1-2yr)",
  },
  {
    airline: "Southwest Airlines",
    iata: "WN",
    aircraft: "Boeing 737 MAX-7",
    quantity: 150,
    manufacturer: "Boeing",
    strategic: "Network refresh replacing ageing 737-700s — combined with assigned seating rollout and premium product introduction, Southwest is repositioning away from pure LCC model.",
    threatenedParties: ["Spirit Airlines", "Frontier Airlines", "American on domestic routes"],
    affectedRoutes: "US domestic point-to-point; leisure leisure markets",
    timeline: "Near term (1-2yr)",
  },
  {
    airline: "Turkish Airlines",
    iata: "TK",
    aircraft: "Mixed fleet (widebody + narrowbody)",
    quantity: 220,
    manufacturer: "Mixed",
    strategic: "Istanbul mega-hub expansion — a larger fleet amplifies Turkish's unique geographic advantage, enabling more one-stop connections between unlikely city pairs than any other carrier.",
    threatenedParties: ["Gulf carriers", "Lufthansa on Africa routes", "Air France-KLM"],
    affectedRoutes: "Africa-Europe; Central Asia-Europe; emerging market corridors",
    timeline: "Medium (3-5yr)",
  },
];

// ─── Delivery pipeline chart data ─────────────────────────────────────────────

const deliveryData = [
  { year: "2025", Boeing: 400, Airbus: 650 },
  { year: "2026", Boeing: 450, Airbus: 720 },
  { year: "2027", Boeing: 500, Airbus: 780 },
  { year: "2028", Boeing: 520, Airbus: 800 },
];

const manufacturerColors: Record<Manufacturer, string> = {
  Boeing:  "#2684ff",
  Airbus:  "#ff8b00",
  Mixed:   "#8777d9",
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function FleetWatch() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : true;
  const gridColor = isDark ? "#1a2a4a" : "#dde3f0";
  const textColor = isDark ? "#7a8aaa" : "#6b7a99";

  const toggleExpanded = (iata: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(iata)) next.delete(iata);
      else next.add(iata);
      return next;
    });
  };

  const totalOrders = orders.reduce((s, o) => s + o.quantity, 0);
  const boeingOrders = orders.filter(o => o.manufacturer === "Boeing").reduce((s, o) => s + o.quantity, 0);
  const airbusOrders = orders.filter(o => o.manufacturer === "Airbus").reduce((s, o) => s + o.quantity, 0);
  const nearTermCount = orders.filter(o => o.timeline === "Near term (1-2yr)").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Fleet Watch
        </h2>
        <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
          Aircraft orders and deliveries as competitive intelligence
        </p>
        <div
          className="p-4 rounded-xl border-l-4 text-sm leading-relaxed"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderLeftColor: "var(--accent)",
            color: "var(--muted)",
          }}
        >
          Fleet choices reveal competitive intent before route announcements do. An A321XLR order
          signals long-thin route ambitions. A widebody order signals hub expansion. Track what
          airlines are ordering — and what it means for the competitive landscape.
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Aircraft on order", value: totalOrders.toLocaleString(), color: "var(--accent)" },
          { label: "Boeing orders", value: boeingOrders.toLocaleString(), color: "#2684ff" },
          { label: "Airbus orders", value: airbusOrders.toLocaleString(), color: "#ff8b00" },
          { label: "Near-term campaigns", value: nearTermCount.toString(), color: "#36b37e" },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Major Orders */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Major Orders on Book (2024–2026)
        </h3>
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expanded.has(order.iata + order.aircraft);
            const mfrColor = manufacturerColors[order.manufacturer];
            return (
              <div
                key={order.iata + order.aircraft}
                className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                {/* Order header row */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: `${mfrColor}18`, color: mfrColor }}
                      >
                        {order.iata}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                          {order.airline}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {order.aircraft}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Quantity */}
                      <div className="text-right">
                        <div className="text-xl font-bold" style={{ color: mfrColor }}>
                          {order.quantity}
                        </div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>aircraft</div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap mt-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${mfrColor}18`, color: mfrColor }}
                    >
                      {order.manufacturer}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: order.timeline === "Near term (1-2yr)"
                          ? "rgba(54,179,126,0.14)"
                          : "rgba(255,171,0,0.14)",
                        color: order.timeline === "Near term (1-2yr)" ? "#36b37e" : "#ffab00",
                      }}
                    >
                      {order.timeline}
                    </span>
                  </div>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => toggleExpanded(order.iata + order.aircraft)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs border-t transition-colors hover:opacity-80"
                  style={{ color: "var(--muted)", borderColor: "var(--border)" }}
                >
                  {isExpanded ? (
                    <><ChevronUp className="w-3 h-3" /> Hide analysis</>
                  ) : (
                    <><ChevronDown className="w-3 h-3" /> What it means</>
                  )}
                </button>

                {/* Expandable: strategic analysis */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4 pt-3 space-y-3"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>
                        Strategic Implication
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {order.strategic}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--muted)" }}>
                          Who Is Most Threatened
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {order.threatenedParties.map((p, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "rgba(255,86,48,0.12)", color: "#ff7452" }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>
                          Routes Likely Affected
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                          {order.affectedRoutes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Pipeline Chart */}
      <div>
        <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Global Delivery Pipeline 2025–2028
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Expected aircraft deliveries by manufacturer
        </p>
        <div className="section-card p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deliveryData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="year" tick={{ fill: textColor, fontSize: 12 }} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0d1829" : "#fff",
                  border: `1px solid ${gridColor}`,
                  borderRadius: 8,
                  color: isDark ? "#e8edf5" : "#0c1a3d",
                }}
              />
              <Legend wrapperStyle={{ color: textColor, fontSize: 12 }} />
              <Bar dataKey="Boeing" fill="#2684ff" name="Boeing" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Airbus" fill="#ff8b00" name="Airbus" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manufacturer Health */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Manufacturer Health
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Boeing */}
          <div
            className="p-5 rounded-xl border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4" style={{ color: "#2684ff" }} />
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Boeing</span>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(255,171,0,0.14)", color: "#ffab00" }}
              >
                Recovery Mode
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Backlog</div>
                <div className="text-base font-bold" style={{ color: "#2684ff" }}>5,600+</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>2025 Target</div>
                <div className="text-base font-bold" style={{ color: "var(--foreground)" }}>400 deliveries</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              Production rate increasing after 737 MAX crisis and machinists&apos; strike. Delivery delays
              persist across multiple programs. FAA certification backlog creates headwinds for new
              variants. Recovery trajectory positive but fragile.
            </p>
          </div>

          {/* Airbus */}
          <div
            className="p-5 rounded-xl border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4" style={{ color: "#ff8b00" }} />
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Airbus</span>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(255,86,48,0.14)", color: "#ff7452" }}
              >
                Capacity Constrained
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Backlog</div>
                <div className="text-base font-bold" style={{ color: "#ff8b00" }}>8,700+</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>2025 Target</div>
                <div className="text-base font-bold" style={{ color: "var(--foreground)" }}>820 deliveries</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              Demand significantly exceeds production capacity. A320neo family dominant with
              multi-year waiting lists. Engine supply chain (CFM, Pratt & Whitney) the primary
              bottleneck. A321XLR entry into service opens new route opportunities for customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
