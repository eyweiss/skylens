"use client";

import { useState } from "react";
import { Plane } from "lucide-react";

type Region = "All" | "North America" | "Europe" | "Middle East" | "Asia-Pacific" | "Other";

interface Airline {
  name: string;
  country: string;
  iata: string;
  hub: string;
  fleet: number;
  region: Region;
}

const airlines: Airline[] = [
  { name: "American Airlines", country: "United States", iata: "AA", hub: "DFW", fleet: 950, region: "North America" },
  { name: "Delta Air Lines", country: "United States", iata: "DL", hub: "ATL", fleet: 1000, region: "North America" },
  { name: "United Airlines", country: "United States", iata: "UA", hub: "ORD", fleet: 900, region: "North America" },
  { name: "Southwest Airlines", country: "United States", iata: "WN", hub: "DAL", fleet: 770, region: "North America" },
  { name: "Air Canada", country: "Canada", iata: "AC", hub: "YYZ", fleet: 180, region: "North America" },
  { name: "Lufthansa", country: "Germany", iata: "LH", hub: "FRA", fleet: 300, region: "Europe" },
  { name: "Ryanair", country: "Ireland", iata: "FR", hub: "DUB", fleet: 580, region: "Europe" },
  { name: "Air France-KLM", country: "France", iata: "AF", hub: "CDG", fleet: 550, region: "Europe" },
  { name: "IAG / British Airways", country: "United Kingdom", iata: "BA", hub: "LHR", fleet: 280, region: "Europe" },
  { name: "easyJet", country: "United Kingdom", iata: "U2", hub: "LTN", fleet: 340, region: "Europe" },
  { name: "Emirates", country: "UAE", iata: "EK", hub: "DXB", fleet: 260, region: "Middle East" },
  { name: "Qatar Airways", country: "Qatar", iata: "QR", hub: "DOH", fleet: 230, region: "Middle East" },
  { name: "Etihad Airways", country: "UAE", iata: "EY", hub: "AUH", fleet: 100, region: "Middle East" },
  { name: "Turkish Airlines", country: "Turkey", iata: "TK", hub: "IST", fleet: 430, region: "Middle East" },
  { name: "flydubai", country: "UAE", iata: "FZ", hub: "DXB", fleet: 80, region: "Middle East" },
  { name: "Singapore Airlines", country: "Singapore", iata: "SQ", hub: "SIN", fleet: 130, region: "Asia-Pacific" },
  { name: "Cathay Pacific", country: "Hong Kong", iata: "CX", hub: "HKG", fleet: 200, region: "Asia-Pacific" },
  { name: "ANA", country: "Japan", iata: "NH", hub: "NRT", fleet: 230, region: "Asia-Pacific" },
  { name: "Japan Airlines", country: "Japan", iata: "JL", hub: "NRT", fleet: 220, region: "Asia-Pacific" },
  { name: "Qantas", country: "Australia", iata: "QF", hub: "SYD", fleet: 130, region: "Asia-Pacific" },
];

const regionColors: Record<string, string> = {
  "North America": "#0052cc",
  Europe: "#00875a",
  "Middle East": "#ff8b00",
  "Asia-Pacific": "#ff5630",
  Other: "#6554c0",
};

const regionColorsDark: Record<string, string> = {
  "North America": "#2684ff",
  Europe: "#36b37e",
  "Middle East": "#ffab00",
  "Asia-Pacific": "#ff7452",
  Other: "#8777d9",
};

export function Airlines() {
  const [filter, setFilter] = useState<Region>("All");

  const filters: Region[] = ["All", "North America", "Europe", "Middle East", "Asia-Pacific", "Other"];
  const filtered = filter === "All" ? airlines : airlines.filter((a) => a.region === filter);

  // Group by region for display
  const grouped = filtered.reduce<Record<string, Airline[]>>((acc, a) => {
    if (!acc[a.region]) acc[a.region] = [];
    acc[a.region].push(a);
    return acc;
  }, {});

  const totalFleet = filtered.reduce((s, a) => s + a.fleet, 0);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
            style={{
              backgroundColor: filter === r ? "var(--accent)" : "var(--card)",
              color: filter === r ? "#fff" : "var(--muted)",
              borderColor: filter === r ? "var(--accent)" : "var(--border)",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="flex gap-4">
        <div className="kpi-card flex-1">
          <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {filtered.length}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Airlines shown
          </div>
        </div>
        <div className="kpi-card flex-1">
          <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {totalFleet.toLocaleString()}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Combined fleet size
          </div>
        </div>
      </div>

      {/* Airlines by region */}
      {Object.entries(grouped).map(([region, items]) => (
        <div key={region}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {items.map((a) => (
              <div
                key={a.name}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
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
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      Hub
                    </div>
                    <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {a.hub}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      Fleet
                    </div>
                    <div className="flex items-center gap-1">
                      <Plane className="w-3 h-3" style={{ color: "var(--accent)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {a.fleet.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Fleet bar */}
                <div className="mt-3">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--border)" }}
                  >
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (a.fleet / 1000) * 100)}%`,
                        backgroundColor: regionColorsDark[region] || "#2684ff",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
