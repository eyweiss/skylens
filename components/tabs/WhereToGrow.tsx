"use client";

import { useState } from "react";
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

// ─── Country profile data ──────────────────────────────────────────────────────

interface CountryProfile {
  name: string;
  flag: string;
  marketSize: string;
  regulator: string;
  majorCarriers: string[];
  majorAirports: string[];
  oemsPresent: string[];
  fleetSize: string;
  growthOutlook: string;
  regulatoryEnv: string;
}

const profiles: CountryProfile[] = [
  {
    name: "United States",
    flag: "🇺🇸",
    marketSize: "$145B (2025E)",
    regulator: "FAA (Federal Aviation Administration)",
    majorCarriers: ["American Airlines", "Delta Air Lines", "United Airlines", "Southwest Airlines"],
    majorAirports: ["ATL", "DFW", "LAX", "ORD", "DEN"],
    oemsPresent: ["Boeing", "Cessna (Textron)", "Gulfstream", "Piper", "Cirrus"],
    fleetSize: "7,400+ commercial aircraft",
    growthOutlook:
      "Moderate (2–3% annual passenger growth). Market maturity constrains rapid expansion, but infrastructure upgrades and fleet replacement drive OEM demand.",
    regulatoryEnv:
      "Most mature aviation regulatory framework globally. Post-737 MAX crisis, FAA has increased oversight rigor on OEM certification processes, extending timelines. Strong safety record but increasingly complex regulatory burden for new entrants. NGAP program addressing controller workforce shortage.",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    marketSize: "$38B (2025E)",
    regulator: "CAA (Civil Aviation Authority)",
    majorCarriers: ["British Airways (IAG)", "easyJet", "Virgin Atlantic", "Jet2"],
    majorAirports: ["LHR", "LGW", "MAN", "STN"],
    oemsPresent: ["Airbus (UK wings)", "BAE Systems", "Rolls-Royce"],
    fleetSize: "1,200+ commercial aircraft",
    growthOutlook:
      "Steady recovery post-Brexit disruption. Heathrow capacity constraints remain unresolved, suppressing growth at London hub. Regional airports seeing stronger proportional growth.",
    regulatoryEnv:
      "Post-Brexit, UK CAA operates independently from EASA, creating dual certification requirements for some aircraft and parts. Generally maintains high alignment with EASA standards. UK Jet Zero Strategy mandates SAF blending from 2025, with 10% target by 2030.",
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    marketSize: "$42B (2025E)",
    regulator: "LBA (Luftfahrt-Bundesamt) / EASA",
    majorCarriers: ["Lufthansa Group", "Eurowings", "Condor"],
    majorAirports: ["FRA", "MUC", "DUS", "TXL"],
    oemsPresent: ["Airbus (Hamburg assembly)", "MTU Aero Engines", "Liebherr Aerospace"],
    fleetSize: "850+ commercial aircraft",
    growthOutlook:
      "Constrained by slot availability at major hubs and environmental policy pressure. Lufthansa Group rationalization ongoing. Business travel recovery slower than leisure markets.",
    regulatoryEnv:
      "Germany operates under EASA framework as a founding member state. Among the most stringent noise and emissions regulators in Europe. ATC capacity investment lagging demand recovery; ground delays at FRA routinely affect schedules.",
  },
  {
    name: "France",
    flag: "🇫🇷",
    marketSize: "$36B (2025E)",
    regulator: "DGAC (Direction Générale de l'Aviation Civile) / EASA",
    majorCarriers: ["Air France-KLM", "Transavia", "Air Corsica"],
    majorAirports: ["CDG", "ORY", "NCE", "MRS"],
    oemsPresent: ["Airbus (Toulouse HQ)", "ATR", "Dassault Aviation", "Safran"],
    fleetSize: "750+ commercial aircraft",
    growthOutlook:
      "Strong leisure recovery driving CDG throughput growth. Paris 2024 Olympics provided a temporary boost. Government-mandated short-haul train substitution policy limits domestic aviation growth.",
    regulatoryEnv:
      "France is implementing some of Europe's most aggressive aviation sustainability policies: bans on domestic routes where train alternatives under 2.5 hours exist. DGAC actively participating in EASA SAF mandate development. Slot coordination at CDG and ORY tightly managed.",
  },
  {
    name: "UAE",
    flag: "🇦🇪",
    marketSize: "$34B (2025E)",
    regulator: "GCAA (General Civil Aviation Authority)",
    majorCarriers: ["Emirates", "Etihad Airways", "flydubai", "Air Arabia"],
    majorAirports: ["DXB", "AUH", "SHJ"],
    oemsPresent: ["No indigenous OEM; major buyer of Boeing, Airbus, ATR"],
    fleetSize: "600+ commercial aircraft",
    growthOutlook:
      "Among the world's highest growth markets. Dubai is the world's busiest international airport. Al Maktoum (DWC) mega-expansion to add 260M pax capacity. Emirates widebody fleet expansion driving major OEM backlog.",
    regulatoryEnv:
      "GCAA operates a progressive, internationally aligned regulatory framework. UAE has been proactive in drone and advanced air mobility regulation, establishing itself as a global testbed. Open-skies policy and strategic slot availability fuel hub competition.",
  },
  {
    name: "India",
    flag: "🇮🇳",
    marketSize: "$25B (2025E)",
    regulator: "DGCA (Directorate General of Civil Aviation)",
    majorCarriers: ["IndiGo", "Air India", "SpiceJet", "Vistara (now Air India)"],
    majorAirports: ["DEL", "BOM", "BLR", "HYD", "MAA"],
    oemsPresent: ["No indigenous OEM; Boeing and Airbus dominant"],
    fleetSize: "700+ commercial aircraft (fastest growing)",
    growthOutlook:
      "World's fastest-growing large aviation market. UDAN regional connectivity scheme expanding secondary airport access. IndiGo 500-aircraft order and Air India 470-aircraft order signal a decade of structural expansion. On track to become world's third-largest aviation market by 2030.",
    regulatoryEnv:
      "DGCA is modernizing after years of capacity constraints and staffing gaps. New Greenfield airports under construction across tier-2 and tier-3 cities. Government's UDAN scheme provides route subsidies for underserved markets. Foreign direct investment restrictions for airlines limit international entry.",
  },
  {
    name: "Singapore",
    flag: "🇸🇬",
    marketSize: "$18B (2025E)",
    regulator: "CAAS (Civil Aviation Authority of Singapore)",
    majorCarriers: ["Singapore Airlines", "Scoot", "Jetstar Asia"],
    majorAirports: ["SIN (Changi)"],
    oemsPresent: ["ST Engineering (MRO)", "No indigenous OEM"],
    fleetSize: "200+ commercial aircraft",
    growthOutlook:
      "Changi serves as Southeast Asia's premier hub, with Terminal 5 expansion ($10B) expected to double capacity. Singapore Airlines maintains one of the world's youngest and most efficient fleets, driving continuous OEM demand.",
    regulatoryEnv:
      "CAAS is regarded as one of the most competent and business-friendly regulators in Asia-Pacific. Singapore has signed comprehensive air services agreements with 130+ countries. Strong government support for aviation as a strategic industry, including R&D grants for SAF and advanced air mobility.",
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    marketSize: "$28B (2025E)",
    regulator: "JCAB (Japan Civil Aviation Bureau)",
    majorCarriers: ["ANA", "Japan Airlines", "Peach", "Jetstar Japan"],
    majorAirports: ["HND", "NRT", "KIX", "ITM"],
    oemsPresent: ["Mitsubishi Aircraft", "Kawasaki (components)", "Subaru (components)"],
    fleetSize: "700+ commercial aircraft",
    growthOutlook:
      "Domestic market structurally constrained by population decline and strong Shinkansen competition. International recovery strong, particularly inbound tourism. Mitsubishi SpaceJet program effectively abandoned — Japan's OEM ambitions reset.",
    regulatoryEnv:
      "JCAB is a highly conservative regulator with a strong safety record. Close alignment with FAA standards. Slot constraints at HND and NRT are persistent capacity limiting factors. Government-supported SAF production roadmap underway with 10% blending target by 2030.",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    marketSize: "$16B (2025E)",
    regulator: "CASA (Civil Aviation Safety Authority)",
    majorCarriers: ["Qantas", "Jetstar", "Virgin Australia", "Regional Express"],
    majorAirports: ["SYD", "MEL", "BNE", "PER"],
    oemsPresent: ["No indigenous commercial OEM; Boeing and Airbus dominant"],
    fleetSize: "400+ commercial aircraft",
    growthOutlook:
      "Strong recovery in domestic and trans-Pacific travel. Western Sydney Airport (WSA) set to open 2026, relieving SYD capacity pressure. Qantas Project Sunrise (ultra-long-haul direct flights) drives A350ULR demand.",
    regulatoryEnv:
      "CASA recently undertook major regulatory reform to align more closely with EASA and FAA frameworks. Qantas-CASA relationship has been contentious following operational safety investigations. Australia's remote geography makes aviation essential infrastructure, shaping regulatory approach to ensure connectivity.",
  },
  {
    name: "Brazil",
    flag: "🇧🇷",
    marketSize: "$20B (2025E)",
    regulator: "ANAC (Agência Nacional de Aviação Civil)",
    majorCarriers: ["LATAM Brazil", "Gol", "Azul"],
    majorAirports: ["GRU", "GIG", "BSB", "CGH"],
    oemsPresent: ["Embraer (global commercial OEM HQ)"],
    fleetSize: "600+ commercial aircraft",
    growthOutlook:
      "Large domestic market with significant underserved regions driving LCC growth. Gol bankruptcy proceedings (2024) created market disruption. Azul expansion continues. Embraer E2 family securing domestic and export orders.",
    regulatoryEnv:
      "ANAC has evolved into a modern, technically competent regulator with ICAO Category 1 status. Brazilian aviation has undergone significant liberalization since 2000. High airport concession fees and infrastructure quality variability outside major hubs remain challenges.",
  },
  {
    name: "China",
    flag: "🇨🇳",
    marketSize: "$98B (2025E)",
    regulator: "CAAC (Civil Aviation Administration of China)",
    majorCarriers: ["Air China", "China Eastern", "China Southern", "Hainan Airlines"],
    majorAirports: ["PEK", "PVG", "CAN", "CTU", "SZX"],
    oemsPresent: ["COMAC (C919, ARJ21)", "AVIC"],
    fleetSize: "4,000+ commercial aircraft",
    growthOutlook:
      "World's second-largest aviation market, projected to become largest by 2030. Post-COVID recovery complete. COMAC C919 entering airline service creates a strategic shift away from Boeing/Airbus dependency as a stated national policy.",
    regulatoryEnv:
      "CAAC operates as both regulator and policy instrument for aviation industrial policy. COMAC C919 certification was a CAAC-managed process; Western regulators (FAA/EASA) have not yet granted type certificates, limiting C919 to Chinese domestic operations. China maintains tight foreign airline market access controls.",
  },
];

// ─── Market Attractiveness Matrix data ────────────────────────────────────────

type MatrixRegion = "North America" | "Europe" | "Middle East" | "Asia-Pacific" | "Americas";

interface MatrixPoint {
  name: string;
  x: number;  // market size 0-100
  y: number;  // growth rate 0-100
  z: number;  // ease of entry 0-100 (bubble size)
  region: MatrixRegion;
  flag: string;
}

const matrixData: MatrixPoint[] = [
  { name: "United States",  x: 90, y: 38, z: 85, region: "North America", flag: "🇺🇸" },
  { name: "China",          x: 88, y: 78, z: 28, region: "Asia-Pacific",  flag: "🇨🇳" },
  { name: "UAE",            x: 55, y: 72, z: 68, region: "Middle East",   flag: "🇦🇪" },
  { name: "India",          x: 52, y: 90, z: 45, region: "Asia-Pacific",  flag: "🇮🇳" },
  { name: "Germany",        x: 70, y: 20, z: 75, region: "Europe",        flag: "🇩🇪" },
  { name: "United Kingdom", x: 65, y: 25, z: 80, region: "Europe",        flag: "🇬🇧" },
  { name: "Singapore",      x: 22, y: 70, z: 82, region: "Asia-Pacific",  flag: "🇸🇬" },
  { name: "Japan",          x: 72, y: 20, z: 60, region: "Asia-Pacific",  flag: "🇯🇵" },
  { name: "Australia",      x: 45, y: 40, z: 78, region: "Asia-Pacific",  flag: "🇦🇺" },
  { name: "Brazil",         x: 42, y: 44, z: 50, region: "Americas",      flag: "🇧🇷" },
];

const matrixRegionColor: Record<MatrixRegion, string> = {
  "North America": "#2684ff",
  "Europe":        "#36b37e",
  "Middle East":   "#ffab00",
  "Asia-Pacific":  "#ff7452",
  "Americas":      "#8777d9",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MatrixTooltip({ active, payload }: any) {
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
        minWidth: 160,
      }}
    >
      <div className="text-sm font-bold mb-0.5" style={{ color: "var(--foreground)" }}>
        {d.flag} {d.name}
      </div>
      <div className="text-xs" style={{ color: matrixRegionColor[d.region as MatrixRegion] }}>
        {d.region}
      </div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
        Market size score: <span style={{ color: "var(--foreground)" }}>{d.x}/100</span>
      </div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        Growth rate score: <span style={{ color: "var(--foreground)" }}>{d.y}/100</span>
      </div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        Entry ease: <span style={{ color: "var(--foreground)" }}>{d.z}/100</span>
      </div>
    </div>
  );
}

function ProfileCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
        {title.toUpperCase()}
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm flex gap-2" style={{ color: "var(--foreground)" }}>
            <span style={{ color: "var(--accent)" }}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function WhereToGrow() {
  const [selected, setSelected] = useState("United States");
  const profile = profiles.find((p) => p.name === selected)!;

  const handleScatterClick = (data: MatrixPoint) => {
    // Only select if a profile exists for this country
    const matchedProfile = profiles.find(
      (p) => p.name === data.name || p.name.includes(data.name.split(" ")[0])
    );
    if (matchedProfile) setSelected(matchedProfile.name);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Where to Grow
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Market attractiveness assessment for aviation expansion
        </p>
      </div>

      {/* Market Attractiveness Matrix */}
      <div>
        <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Market Attractiveness Matrix
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Bubble size = ease of market entry. Click a bubble to view the country profile.
        </p>

        {/* Region legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
          {(Object.entries(matrixRegionColor) as [MatrixRegion, string][]).map(([region, color]) => (
            <div key={region} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs" style={{ color: "var(--muted)" }}>{region}</span>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl border p-5 relative"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* Quadrant labels */}
          <div className="absolute top-8 left-16 text-xs font-semibold opacity-40 pointer-events-none" style={{ color: "var(--muted)" }}>
            Emerging<br />Opportunities
          </div>
          <div className="absolute top-8 right-8 text-xs font-semibold opacity-40 pointer-events-none text-right" style={{ color: "#36b37e" }}>
            Priority<br />Markets
          </div>
          <div className="absolute bottom-16 left-16 text-xs font-semibold opacity-40 pointer-events-none" style={{ color: "var(--muted)" }}>
            Watch<br />&amp; Wait
          </div>
          <div className="absolute bottom-16 right-8 text-xs font-semibold opacity-40 pointer-events-none text-right" style={{ color: "var(--muted)" }}>
            Mature<br />Markets
          </div>

          <ResponsiveContainer width="100%" height={420}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 48, left: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 100]}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                tickLine={false}
                label={{
                  value: "Market Size  (Small → Large)",
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
                  value: "Growth Rate  (Low → High)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -34,
                  fill: "var(--muted)",
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" dataKey="z" domain={[20, 100]} range={[40, 600]} />
              <Tooltip content={<MatrixTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <ReferenceLine x={50} stroke="var(--border)" strokeDasharray="5 4" strokeWidth={1.5} />
              <ReferenceLine y={50} stroke="var(--border)" strokeDasharray="5 4" strokeWidth={1.5} />
              <Scatter
                data={matrixData}
                fillOpacity={0.85}
                onClick={(data) => handleScatterClick(data as unknown as MatrixPoint)}
                style={{ cursor: "pointer" }}
              >
                {matrixData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={matrixRegionColor[entry.region]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country Profiles section */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Country Market Profiles
        </h3>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div
            className="w-52 flex-shrink-0 rounded-xl border overflow-hidden"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", alignSelf: "start" }}
          >
            <div
              className="px-4 py-3 text-xs font-semibold border-b"
              style={{ color: "var(--muted)", borderColor: "var(--border)" }}
            >
              SELECT COUNTRY
            </div>
            {profiles.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelected(p.name)}
                className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors"
                style={{
                  backgroundColor: selected === p.name ? "var(--accent-light)" : "transparent",
                  color: selected === p.name ? "var(--accent)" : "var(--foreground)",
                  borderLeft: selected === p.name ? "3px solid var(--accent)" : "3px solid transparent",
                }}
              >
                <span>{p.flag}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Profile content */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Header */}
            <div
              className="p-6 rounded-xl border"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{profile.flag}</span>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                    {profile.name}
                  </h2>
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    Aviation Market Profile
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted)" }}>
                    Market Size
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                    {profile.marketSize}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted)" }}>
                    Fleet Size
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {profile.fleetSize}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted)" }}>
                    Regulator
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {profile.regulator.split(" (")[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProfileCard title="Major Carriers" items={profile.majorCarriers} />
              <ProfileCard title="Major Airports" items={profile.majorAirports} />
              <ProfileCard title="OEMs Present" items={profile.oemsPresent} />
              <div
                className="p-5 rounded-xl border"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
                  GROWTH OUTLOOK
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {profile.growthOutlook}
                </p>
              </div>
            </div>

            {/* Regulatory environment */}
            <div
              className="p-5 rounded-xl border"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
                REGULATORY ENVIRONMENT
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                {profile.regulatoryEnv}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
