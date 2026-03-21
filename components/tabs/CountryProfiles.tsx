"use client";

import { useState } from "react";

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
    growthOutlook: "Moderate (2–3% annual passenger growth). Market maturity constrains rapid expansion, but infrastructure upgrades and fleet replacement drive OEM demand.",
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
    growthOutlook: "Steady recovery post-Brexit disruption. Heathrow capacity constraints remain unresolved, suppressing growth at London hub. Regional airports seeing stronger proportional growth.",
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
    growthOutlook: "Constrained by slot availability at major hubs and environmental policy pressure. Lufthansa Group rationalization ongoing. Business travel recovery slower than leisure markets.",
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
    growthOutlook: "Strong leisure recovery driving CDG throughput growth. Paris 2024 Olympics provided a temporary boost. Government-mandated short-haul train substitution policy limits domestic aviation growth.",
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
    growthOutlook: "Among the world's highest growth markets. Dubai is the world's busiest international airport. Al Maktoum (DWC) mega-expansion to add 260M pax capacity. Emirates widebody fleet expansion driving major OEM backlog.",
    regulatoryEnv:
      "GCAA operates a progressive, internationally aligned regulatory framework. UAE has been proactive in drone and advanced air mobility regulation, establishing itself as a global testbed. Open-skies policy and strategic slot availability fuel hub competition.",
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
    growthOutlook: "Changi serves as Southeast Asia's premier hub, with Terminal 5 expansion ($10B) expected to double capacity. Singapore Airlines maintains one of the world's youngest and most efficient fleets, driving continuous OEM demand.",
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
    growthOutlook: "Domestic market structurally constrained by population decline and strong Shinkansen competition. International recovery strong, particularly inbound tourism. Mitsubishi SpaceJet (formerly MRJ) program effectively abandoned—Japan's OEM ambitions reset.",
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
    growthOutlook: "Strong recovery in domestic and trans-Pacific travel. Western Sydney Airport (WSA) set to open 2026, relieving SYD capacity pressure. Qantas Project Sunrise (ultra-long-haul direct flights) drives A350ULR demand.",
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
    growthOutlook: "Large domestic market with significant underserved regions driving LCC growth. Gol bankruptcy proceedings (2024) created market disruption. Azul expansion continues. Embraer E2 family securing domestic and export orders.",
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
    growthOutlook: "World's second-largest aviation market, projected to become largest by 2030. Post-COVID recovery complete. COMAC C919 entering airline service creates a strategic shift away from Boeing/Airbus dependency as a stated national policy.",
    regulatoryEnv:
      "CAAC operates as both regulator and policy instrument for aviation industrial policy. COMAC C919 certification was a CAAC-managed process; Western regulators (FAA/EASA) have not yet granted type certificates, limiting C919 to Chinese domestic operations. China maintains tight foreign airline market access controls.",
  },
];

export function CountryProfiles() {
  const [selected, setSelected] = useState("United States");
  const profile = profiles.find((p) => p.name === selected)!;

  return (
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
