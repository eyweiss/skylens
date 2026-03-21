"use client";

import { useState } from "react";
import { Users } from "lucide-react";

type Region = "All" | "North America" | "Europe" | "Middle East" | "Asia-Pacific";

interface Airport {
  name: string;
  country: string;
  iata: string;
  passengers: number;
  region: Region;
}

const airports: Airport[] = [
  { name: "Hartsfield-Jackson Atlanta", country: "United States", iata: "ATL", passengers: 104, region: "North America" },
  { name: "Dallas/Fort Worth", country: "United States", iata: "DFW", passengers: 73, region: "North America" },
  { name: "Denver International", country: "United States", iata: "DEN", passengers: 69, region: "North America" },
  { name: "Chicago O'Hare", country: "United States", iata: "ORD", passengers: 68, region: "North America" },
  { name: "Los Angeles International", country: "United States", iata: "LAX", passengers: 75, region: "North America" },
  { name: "London Heathrow", country: "United Kingdom", iata: "LHR", passengers: 79, region: "Europe" },
  { name: "Paris Charles de Gaulle", country: "France", iata: "CDG", passengers: 67, region: "Europe" },
  { name: "Frankfurt Airport", country: "Germany", iata: "FRA", passengers: 59, region: "Europe" },
  { name: "Amsterdam Schiphol", country: "Netherlands", iata: "AMS", passengers: 61, region: "Europe" },
  { name: "Madrid Barajas", country: "Spain", iata: "MAD", passengers: 57, region: "Europe" },
  { name: "Dubai International", country: "UAE", iata: "DXB", passengers: 87, region: "Middle East" },
  { name: "Doha Hamad International", country: "Qatar", iata: "DOH", passengers: 45, region: "Middle East" },
  { name: "Istanbul Airport", country: "Turkey", iata: "IST", passengers: 76, region: "Middle East" },
  { name: "Abu Dhabi International", country: "UAE", iata: "AUH", passengers: 24, region: "Middle East" },
  { name: "Riyadh King Khalid", country: "Saudi Arabia", iata: "RUH", passengers: 41, region: "Middle East" },
  { name: "Tokyo Haneda", country: "Japan", iata: "HND", passengers: 85, region: "Asia-Pacific" },
  { name: "Singapore Changi", country: "Singapore", iata: "SIN", passengers: 59, region: "Asia-Pacific" },
  { name: "Beijing Capital", country: "China", iata: "PEK", passengers: 75, region: "Asia-Pacific" },
  { name: "Hong Kong International", country: "Hong Kong", iata: "HKG", passengers: 40, region: "Asia-Pacific" },
  { name: "Sydney Kingsford Smith", country: "Australia", iata: "SYD", passengers: 44, region: "Asia-Pacific" },
];

const regionColors: Record<string, string> = {
  "North America": "#2684ff",
  Europe: "#36b37e",
  "Middle East": "#ffab00",
  "Asia-Pacific": "#ff7452",
};

export function Airports() {
  const [filter, setFilter] = useState<Region>("All");

  const filters: Region[] = ["All", "North America", "Europe", "Middle East", "Asia-Pacific"];
  const filtered = filter === "All" ? airports : airports.filter((a) => a.region === filter);

  const maxPax = Math.max(...airports.map((a) => a.passengers));

  const grouped = filtered.reduce<Record<string, Airport[]>>((acc, a) => {
    if (!acc[a.region]) acc[a.region] = [];
    acc[a.region].push(a);
    return acc;
  }, {});

  const totalPax = filtered.reduce((s, a) => s + a.passengers, 0);

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
            Airports shown
          </div>
        </div>
        <div className="kpi-card flex-1">
          <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
            {totalPax}M+
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Combined annual passengers
          </div>
        </div>
      </div>

      {/* Airports by region */}
      {Object.entries(grouped).map(([region, items]) => (
        <div key={region}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: regionColors[region] || "#2684ff" }}
            />
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {region}
            </h3>
          </div>
          <div className="section-card overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Airport", "Country", "IATA", "Annual Passengers", "Traffic"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: "var(--muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items
                  .sort((a, b) => b.passengers - a.passengers)
                  .map((ap, i) => (
                    <tr
                      key={ap.iata}
                      style={{
                        borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                        {ap.name}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--muted)" }}>
                        {ap.country}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--accent-light)",
                            color: regionColors[region] || "#2684ff",
                          }}
                        >
                          {ap.iata}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
                          <span style={{ color: "var(--foreground)" }}>{ap.passengers}M</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 w-36">
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: "var(--border)" }}
                        >
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(ap.passengers / maxPax) * 100}%`,
                              backgroundColor: regionColors[region] || "#2684ff",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
