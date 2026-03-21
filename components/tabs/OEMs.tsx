"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { useTheme } from "next-themes";

type Region = "All" | "Americas" | "Europe" | "Asia-Pacific";

const oems = [
  { name: "Boeing", country: "United States", region: "Americas", lat: 47.6, lng: -122.3 },
  { name: "Cessna (Textron)", country: "United States", region: "Americas", lat: 37.7, lng: -97.3 },
  { name: "Gulfstream (General Dynamics)", country: "United States", region: "Americas", lat: 32.1, lng: -81.2 },
  { name: "Piper Aircraft", country: "United States", region: "Americas", lat: 27.2, lng: -80.2 },
  { name: "Cirrus Aircraft", country: "United States", region: "Americas", lat: 47.5, lng: -92.5 },
  { name: "Bombardier", country: "Canada", region: "Americas", lat: 45.5, lng: -73.6 },
  { name: "Embraer", country: "Brazil", region: "Americas", lat: -23.2, lng: -45.9 },
  { name: "Airbus", country: "France / Germany", region: "Europe", lat: 43.6, lng: 1.4 },
  { name: "ATR", country: "France", region: "Europe", lat: 43.5, lng: 1.5 },
  { name: "Dassault Aviation", country: "France", region: "Europe", lat: 48.9, lng: 2.3 },
  { name: "Leonardo", country: "Italy", region: "Europe", lat: 41.9, lng: 12.5 },
  { name: "SAAB", country: "Sweden", region: "Europe", lat: 58.4, lng: 15.6 },
  { name: "COMAC", country: "China", region: "Asia-Pacific", lat: 31.2, lng: 121.5 },
  { name: "UAC", country: "Russia", region: "Asia-Pacific", lat: 55.8, lng: 37.6 },
  { name: "Mitsubishi Aircraft", country: "Japan", region: "Asia-Pacific", lat: 35.0, lng: 136.9 },
];

const regionColors: Record<string, string> = {
  Americas: "#0052cc",
  Europe: "#00875a",
  "Asia-Pacific": "#ff5630",
};

const regionColorsDark: Record<string, string> = {
  Americas: "#2684ff",
  Europe: "#36b37e",
  "Asia-Pacific": "#ff7452",
};

export function OEMs() {
  const [filter, setFilter] = useState<Region>("All");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : true;
  const colors = isDark ? regionColorsDark : regionColors;

  const filtered = filter === "All" ? oems : oems.filter((o) => o.region === filter);

  // Build D3 map
  useEffect(() => {
    if (!mapRef.current) return;
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();

    const width = mapRef.current.clientWidth || 700;
    const height = 340;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 6.3)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    fetch("/countries-110m.json")
      .then((r) => r.json())
      .then((world: Topology<{ countries: GeometryCollection }>) => {
        const countries = topojson.feature(world, world.objects.countries);

        g.selectAll("path")
          .data((countries as GeoJSON.FeatureCollection).features)
          .enter()
          .append("path")
          .attr("d", path as unknown as string)
          .attr("fill", isDark ? "#0d1829" : "#e8f0fe")
          .attr("stroke", isDark ? "#1a2a4a" : "#c0cfe8")
          .attr("stroke-width", 0.5);

        // Draw OEM bubbles
        const visible = filter === "All" ? oems : oems.filter((o) => o.region === filter);
        visible.forEach((oem) => {
          const projected = projection([oem.lng, oem.lat]);
          if (!projected) return;
          const [x, y] = projected;
          const col = colors[oem.region];

          g.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 6)
            .attr("fill", col)
            .attr("fill-opacity", 0.85)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);

          g.append("text")
            .attr("x", x + 9)
            .attr("y", y + 4)
            .attr("font-size", "9px")
            .attr("fill", isDark ? "#e8edf5" : "#0c1a3d")
            .text(oem.name);
        });
      });
  }, [filter, isDark, colors]);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["All", "Americas", "Europe", "Asia-Pacific"] as Region[]).map((r) => (
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

      {/* Map */}
      <div className="section-card p-4 overflow-hidden">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--muted)" }}>
          Global OEM Locations
        </h3>
        <svg ref={mapRef} className="w-full" style={{ height: 340 }} />
        {/* Legend */}
        <div className="flex gap-4 mt-3">
          {Object.entries(colors).map(([region, color]) => (
            <div key={region} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              {region}
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((oem) => (
          <div
            key={oem.name}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
              style={{
                backgroundColor: "var(--accent-light)",
                color: colors[oem.region],
              }}
            >
              {oem.region}
            </div>
            <div className="text-sm font-bold mb-0.5" style={{ color: "var(--foreground)" }}>
              {oem.name}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              {oem.country}
            </div>
            <div
              className="text-xs mt-1 px-2 py-0.5 rounded border inline-block"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              Commercial OEM
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
