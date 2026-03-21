"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

const sections = [
  "Executive Summary",
  "Company Overview",
  "Products & Services",
  "Market Positioning",
  "Sales & Marketing",
  "Financial Performance",
  "SWOT Analysis",
  "Competitive Benchmarking",
  "Technology & Operations",
  "Recent Developments",
  "Customer Perception",
  "Risks & Threat Assessment",
  "Strategic Recommendations",
];

const lockedCompetitors = [
  "Boeing",
  "Airbus",
  "Embraer",
  "Bombardier",
  "COMAC",
  "ATR",
  "Leonardo",
];

function SWOTItem({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      <div className="text-xs font-bold mb-2" style={{ color }}>
        {label}
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs flex gap-2" style={{ color: "var(--muted)" }}>
            <span style={{ color }}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CompetitorSpotlight() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      {/* Competitor selector row */}
      <div className="flex gap-3 flex-wrap">
        <div
          className="px-4 py-2 rounded-lg border-2 text-sm font-semibold cursor-default"
          style={{
            borderColor: "var(--accent)",
            backgroundColor: "var(--accent-light)",
            color: "var(--accent)",
          }}
        >
          AeroVision Systems
        </div>
        {lockedCompetitors.map((name) => (
          <div
            key={name}
            className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 cursor-not-allowed opacity-60"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--muted)",
            }}
          >
            <Lock className="w-3 h-3" />
            {name}
          </div>
        ))}
      </div>

      {/* Report layout */}
      <div className="flex gap-6 relative">
        {/* Main content */}
        <div className="flex-1 space-y-10 min-w-0">
          {/* Report header */}
          <div
            className="p-6 rounded-xl border relative overflow-hidden"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="absolute top-4 right-4 text-4xl font-black opacity-10 select-none rotate-[-15deg]"
              style={{ color: "var(--accent)" }}
            >
              SAMPLE / DEMO
            </div>
            <div className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>
              COMPETITOR INTELLIGENCE REPORT
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
              AeroVision Systems
            </h2>
            <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
              Commercial Aircraft Manufacturer · Founded 2008 · Headquarters: Montreal, Canada
            </p>
            <div className="flex flex-wrap gap-3">
              {["Commercial OEM", "Narrowbody", "Widebody", "Hybrid-Electric"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Section 0: Executive Summary */}
          <section ref={(el) => { sectionRefs.current[0] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              1. Executive Summary
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-3" style={{ color: "var(--muted)" }}>
              <p>
                AeroVision Systems is a Canadian commercial aircraft manufacturer positioning itself as a credible third-force alternative to Boeing and Airbus in the 150–220 seat narrowbody segment. The company&apos;s flagship AV-200 program represents a direct challenge to the 737 MAX 8 and A320neo with a claimed 18% fuel efficiency advantage driven by advanced composite structures and a next-generation geared turbofan architecture.
              </p>
              <p>
                With $4.2B in committed orders across 11 launch customers as of Q1 2025, AeroVision has demonstrated meaningful market traction—particularly in markets where Boeing&apos;s quality perception issues have created buyer hesitation. However, the company faces significant execution risk with first delivery currently targeted for 2027, against a backdrop of industry-wide supply chain constraints.
              </p>
              <p>
                This report assesses AeroVision&apos;s competitive position, financial trajectory, technology differentiation, and strategic risk across 13 dimensions to inform competitive strategy and market response planning.
              </p>
            </div>
          </section>

          {/* Section 1: Company Overview */}
          <section ref={(el) => { sectionRefs.current[1] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              2. Company Overview
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-3" style={{ color: "var(--muted)" }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Founded", value: "2008" },
                  { label: "HQ", value: "Montreal, QC, Canada" },
                  { label: "CEO", value: "Dr. Sylvie Marchand" },
                  { label: "Employees", value: "~8,400" },
                  { label: "Revenue (2024E)", value: "$1.1B" },
                  { label: "Ownership", value: "Private (PE-backed)" },
                  { label: "Key Investors", value: "Brookfield, CDPQ, Mubadala" },
                  { label: "Programs", value: "AV-200, AV-300 (concept)" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                      {item.label}
                    </div>
                    <div>{item.value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                AeroVision was founded by former Bombardier and Airbus engineers seeking to apply lessons from the Bombardier C Series program—which ultimately became the Airbus A220—to the mainstream narrowbody market. The company operates final assembly in Montreal with component supply from Italy, Japan, and the United States.
              </p>
            </div>
          </section>

          {/* Section 2: Products & Services */}
          <section ref={(el) => { sectionRefs.current[2] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              3. Products &amp; Services
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-4" style={{ color: "var(--muted)" }}>
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                      {["Program", "Seats", "Range", "Status", "Orders"].map((h) => (
                        <th key={h} className="text-left px-3 py-2 font-semibold" style={{ color: "var(--foreground)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { prog: "AV-200", seats: "150–180", range: "3,800nm", status: "In development", orders: "312" },
                      { prog: "AV-200ER", seats: "162–180", range: "4,600nm", status: "Launched", orders: "87" },
                      { prog: "AV-300", seats: "220–240", range: "5,200nm", status: "Concept", orders: "—" },
                    ].map((row, i) => (
                      <tr key={row.prog} style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                        <td className="px-3 py-2 font-semibold" style={{ color: "var(--accent)" }}>{row.prog}</td>
                        <td className="px-3 py-2">{row.seats}</td>
                        <td className="px-3 py-2">{row.range}</td>
                        <td className="px-3 py-2">{row.status}</td>
                        <td className="px-3 py-2">{row.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                AeroVision&apos;s AV-200 platform features an advanced composite fuselage (55% by weight), the CFM LEAP-1X variant with geared fan architecture, and a fly-by-wire system derived from Airbus A350 lineage. The aircraft claims an 18% seat-mile cost advantage over the A320ceo and a 7% advantage over the A320neo.
              </p>
            </div>
          </section>

          {/* Section 3: Market Positioning */}
          <section ref={(el) => { sectionRefs.current[3] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              4. Market Positioning
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-3" style={{ color: "var(--muted)" }}>
              <p>
                AeroVision positions the AV-200 as a &quot;clean sheet&quot; alternative to the re-engined derivatives from Boeing and Airbus, targeting airlines frustrated with delivery delays and seeking a technological step-change rather than incremental improvement. The company&apos;s primary target segments include:
              </p>
              <ul className="space-y-1.5 ml-4">
                {[
                  "Low-cost carriers in Asia-Pacific seeking differentiation on unit cost",
                  "Flag carriers in markets diversifying away from Western OEM dependency",
                  "Regional operators transitioning from turboprop fleets",
                  "Lessors seeking fleet diversification beyond Boeing/Airbus duopoly",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: "var(--accent)" }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                The company has been notably successful in Southeast Asia (IndiGo-equivalent discussions in Indonesia and Vietnam) and has secured a 40-aircraft commitment from Air Arabia as a launch Middle East customer.
              </p>
            </div>
          </section>

          {/* Section 4: Sales & Marketing */}
          <section ref={(el) => { sectionRefs.current[4] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              5. Sales &amp; Marketing
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-3" style={{ color: "var(--muted)" }}>
              <p>
                AeroVision operates a direct sales model with regional offices in Dubai, Singapore, and São Paulo. The company leverages its status as a non-US, non-European alternative to appeal to airlines in geopolitically sensitive markets. Marketing is anchored on three pillars: <span style={{ color: "var(--foreground)" }}>efficiency, independence, and innovation</span>.
              </p>
              <p>
                The company maintains an active presence at Paris Air Show and Singapore Airshow, typically announcing 1–3 major orders per event. Its &quot;AeroVision Academy&quot; pilot training program, operated in partnership with CAE, is used as a customer retention mechanism and switching cost tool.
              </p>
              <p>
                Estimated marketing spend: ~$85M annually (2024), representing ~7.7% of revenue—significantly higher than Boeing/Airbus equivalents, reflecting the higher cost of building brand credibility as a new entrant.
              </p>
            </div>
          </section>

          {/* Section 5: Financial Performance */}
          <section ref={(el) => { sectionRefs.current[5] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              6. Financial Performance
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-4" style={{ color: "var(--muted)" }}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "2022 Revenue", value: "$680M" },
                  { label: "2023 Revenue", value: "$890M" },
                  { label: "2024E Revenue", value: "$1.1B" },
                  { label: "EBITDA Margin", value: "-12% (dev phase)" },
                  { label: "Total Funding Raised", value: "$3.8B" },
                  { label: "Committed Order Value", value: "$4.2B" },
                ].map((item) => (
                  <div key={item.label} className="kpi-card">
                    <div className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                      {item.value}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <p>
                AeroVision remains pre-profitability, operating in a capital-intensive development phase. Current revenue derives primarily from engineering services, government R&D contracts, and component manufacturing. The company projects break-even at 35 aircraft deliveries per year, targeted for 2029. Key financial risk: development overruns, which have already pushed first delivery from 2026 to 2027.
              </p>
            </div>
          </section>

          {/* Section 6: SWOT */}
          <section ref={(el) => { sectionRefs.current[6] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              7. SWOT Analysis
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <SWOTItem
                label="STRENGTHS"
                color="#36b37e"
                items={[
                  "Clean-sheet design with superior fuel efficiency",
                  "Strong composite manufacturing capability",
                  "Geopolitical neutrality as Canadian manufacturer",
                  "Experienced leadership from Airbus/Bombardier",
                  "Growing order book ($4.2B committed)",
                ]}
              />
              <SWOTItem
                label="WEAKNESSES"
                color="#ff7452"
                items={[
                  "No aircraft currently in service (zero EIS experience)",
                  "Capital intensity of pre-profitability phase",
                  "Single-program dependency (AV-200)",
                  "Limited MRO network vs. incumbents",
                  "Delivery timeline risk (already delayed once)",
                ]}
              />
              <SWOTItem
                label="OPPORTUNITIES"
                color="#2684ff"
                items={[
                  "Boeing quality crisis creating buyer hesitation",
                  "Asia-Pacific market growth driving demand",
                  "SAF compatibility positioning for ESG investors",
                  "Lessor diversification demand",
                  "Government co-investment in Canadian aerospace",
                ]}
              />
              <SWOTItem
                label="THREATS"
                color="#ffab00"
                items={[
                  "Airbus A320neo family production ramp acceleration",
                  "COMAC C919 competing in same geopolitical space",
                  "Supply chain disruption extending development",
                  "Interest rate environment pressuring PE-backed growth",
                  "Potential Boeing recovery undermining narrative",
                ]}
              />
            </div>
          </section>

          {/* Section 7: Competitive Benchmarking */}
          <section ref={(el) => { sectionRefs.current[7] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              8. Competitive Benchmarking
            </h3>
            <div className="section-card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
                    {["Metric", "AeroVision AV-200", "Boeing 737 MAX 8", "Airbus A320neo", "COMAC C919"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--foreground)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Seats", "162–180", "162–178", "150–194", "158–192"],
                    ["Range", "3,800nm", "3,550nm", "3,500nm", "2,200nm"],
                    ["Fuel Efficiency vs. prev gen", "+18%", "+14%", "+16%", "+12%"],
                    ["List Price", "$128M", "$121M", "$131M", "$99M*"],
                    ["Backlog (units)", "399", "4,200+", "8,700+", "1,200+"],
                    ["First Delivery", "2027E", "2016", "2016", "2023"],
                    ["Composite content", "55%", "12%", "22%", "23%"],
                  ].map(([metric, ...vals], i) => (
                    <tr key={metric} style={{ borderBottom: i < 6 ? "1px solid var(--border)" : "none" }}>
                      <td className="px-4 py-2.5 font-medium" style={{ color: "var(--foreground)" }}>{metric}</td>
                      {vals.map((v, j) => (
                        <td
                          key={j}
                          className="px-4 py-2.5"
                          style={{ color: j === 0 ? "var(--accent)" : "var(--muted)" }}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 text-xs" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
                * COMAC list price estimated; heavily subsidized for domestic customers
              </div>
            </div>
          </section>

          {/* Section 8: Technology & Operations */}
          <section ref={(el) => { sectionRefs.current[8] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              9. Technology &amp; Operations
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-3" style={{ color: "var(--muted)" }}>
              <p>
                AeroVision&apos;s technology differentiation centers on three core innovations: (1) an advanced thermoplastic composite fuselage enabling 30% weight reduction vs. aluminum; (2) a proprietary health monitoring and predictive maintenance platform &quot;AeroSense,&quot; which it plans to monetize as a SaaS offering to airline MRO teams; and (3) a hybrid-electric APU reducing ground power consumption by 40%.
              </p>
              <p>
                Manufacturing: AV operates a 420,000 sq ft final assembly facility in Montreal and a composites center in Quebec City. Component suppliers include Safran (nacelles), Collins Aerospace (avionics), and Toray (carbon fiber). The supply chain is intentionally diversified across 14 countries to avoid single-country dependency.
              </p>
              <p>
                R&amp;D investment: ~$280M annually (2024), representing 25% of revenue—indicative of a company still in intensive development phase. A partnership with the National Research Council of Canada provides subsidized access to advanced materials research.
              </p>
            </div>
          </section>

          {/* Section 9: Recent Developments */}
          <section ref={(el) => { sectionRefs.current[9] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              10. Recent Developments
            </h3>
            <div className="section-card p-5 text-sm space-y-3" style={{ color: "var(--muted)" }}>
              {[
                { date: "Feb 2025", event: "Secured 40-aircraft commitment from Air Arabia, marking AeroVision's first Middle East customer." },
                { date: "Jan 2025", event: "Completed structural testing of AV-200 composite fuselage section; results confirmed 8% better-than-modeled weight performance." },
                { date: "Dec 2024", event: "Mubadala Investment Company led $600M Series F funding round, valuing AeroVision at ~$6.2B." },
                { date: "Oct 2024", event: "First flight of iron bird (full-scale systems integration rig) completed at Montreal facility." },
                { date: "Aug 2024", event: "Delivery timeline revised to 2027 (from 2026) citing CFM engine certification delays." },
              ].map((d) => (
                <div key={d.date} className="flex gap-4">
                  <div
                    className="text-xs font-semibold w-20 flex-shrink-0 mt-0.5"
                    style={{ color: "var(--accent)" }}
                  >
                    {d.date}
                  </div>
                  <div className="text-sm">{d.event}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10: Customer Perception */}
          <section ref={(el) => { sectionRefs.current[10] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              11. Customer Perception
            </h3>
            <div className="section-card p-5 text-sm leading-relaxed space-y-3" style={{ color: "var(--muted)" }}>
              <p>
                Primary research synthesis (interviews with fleet planning teams at 6 airlines, 2025):
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  { label: "Fuel efficiency claims", sentiment: "Positive", note: "Airlines broadly accept the 18% claim, though some note it requires real-world validation at EIS." },
                  { label: "Delivery confidence", sentiment: "Mixed", note: "The 2026→2027 slip has eroded confidence; airlines want to see iron-bird-to-flight test transition." },
                  { label: "After-sales / MRO", sentiment: "Negative", note: "Biggest concern: AeroVision has no established MRO network. AOG support planning seen as immature." },
                  { label: "Technology differentiation", sentiment: "Positive", note: "AeroSense predictive maintenance platform seen as genuinely innovative and compelling by MRO teams." },
                ].map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <div className="w-40 flex-shrink-0">
                      <span className="font-medium" style={{ color: "var(--foreground)" }}>{item.label}</span>
                      <span
                        className="ml-2 text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: item.sentiment === "Positive" ? "#1a3a2a" : item.sentiment === "Mixed" ? "#2a2a0a" : "#2a1a1a",
                          color: item.sentiment === "Positive" ? "#36b37e" : item.sentiment === "Mixed" ? "#ffab00" : "#ff7452",
                        }}
                      >
                        {item.sentiment}
                      </span>
                    </div>
                    <div>{item.note}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 11: Risks & Threat Assessment */}
          <section ref={(el) => { sectionRefs.current[11] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              12. Risks &amp; Threat Assessment
            </h3>
            <div className="section-card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
                    {["Risk", "Probability", "Impact", "Notes"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--foreground)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Further delivery delays", "High", "High", "Third-party supply chain dependency; CFM engine certification on critical path"],
                    ["Order cancellations", "Medium", "High", "5 customers have cancellation options if delivery slips past Q2 2028"],
                    ["Capital shortfall", "Medium", "Critical", "Break-even requires $2.1B additional investment before first delivery revenue"],
                    ["Boeing recovery", "Medium", "Medium", "A credible Boeing quality turnaround would reduce AV's differentiation narrative"],
                    ["Certification failure", "Low", "Critical", "FAA/Transport Canada certification of novel composite design carries residual risk"],
                    ["COMAC pricing pressure", "High", "Medium", "COMAC C919 undercutting by 20–25% in non-Western markets is already observed"],
                  ].map(([risk, prob, impact, notes], i) => (
                    <tr key={risk} style={{ borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                      <td className="px-4 py-2.5 font-medium" style={{ color: "var(--foreground)" }}>{risk}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: prob === "High" ? "#2a1a1a" : prob === "Medium" ? "#2a2a0a" : "#1a2a1a",
                            color: prob === "High" ? "#ff7452" : prob === "Medium" ? "#ffab00" : "#36b37e",
                          }}
                        >
                          {prob}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: impact === "Critical" || impact === "High" ? "#2a1a1a" : "#2a2a0a",
                            color: impact === "Critical" || impact === "High" ? "#ff7452" : "#ffab00",
                          }}
                        >
                          {impact}
                        </span>
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--muted)" }}>{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 12: Strategic Recommendations */}
          <section ref={(el) => { sectionRefs.current[12] = el; }}>
            <h3 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
              13. Strategic Recommendations
            </h3>
            <div className="section-card p-5 text-sm space-y-3" style={{ color: "var(--muted)" }}>
              {[
                {
                  rec: "Accelerate MRO Network Development",
                  detail: "AeroVision's weakest competitive dimension is after-sales support. A proactive MRO partnership announcement (e.g., with ST Engineering or Air France Industries) before EIS would meaningfully improve airline confidence.",
                },
                {
                  rec: "Target Lessor Segment Aggressively",
                  detail: "Aircraft lessors represent AeroVision's fastest path to fleet diversification advocacy. Securing 2–3 top-10 lessors (AerCap, SMBC) as committed customers would validate the program and unlock secondary market creation.",
                },
                {
                  rec: "Establish Asia-Pacific Regional Presence",
                  detail: "Southeast Asia represents the highest-growth opportunity for the AV-200. Opening a full regional office (not just sales rep) in Singapore with local engineering support would signal long-term commitment to the region's carriers.",
                },
                {
                  rec: "Capitalize on Boeing Quality Narrative Carefully",
                  detail: "AeroVision benefits from Boeing's difficulties but should avoid overtly exploiting them. A positive differentiation message ('why AeroVision is better') will be more durable than a negative comparison campaign.",
                },
                {
                  rec: "Manage Certification Risk Proactively",
                  detail: "Engage FAA and Transport Canada in concurrent certification dialogue and consider establishing a Washington D.C. regulatory affairs function to ensure AeroVision is represented in evolving post-MAX safety frameworks.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                    style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                      {item.rec}
                    </div>
                    <div>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky TOC */}
        <div className="hidden xl:block w-56 flex-shrink-0">
          <div
            className="sticky top-24 p-4 rounded-xl border text-xs"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>
              Contents
            </div>
            <ul className="space-y-1">
              {sections.map((s, i) => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo(i)}
                    className="w-full text-left py-1 px-2 rounded transition-colors hover:opacity-80"
                    style={{
                      color: activeSection === i ? "var(--accent)" : "var(--muted)",
                      backgroundColor: activeSection === i ? "var(--accent-light)" : "transparent",
                    }}
                  >
                    {i + 1}. {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Locked competitors paywall */}
      <div
        className="mt-8 p-6 rounded-xl border text-center"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <Lock className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--muted)" }} />
        <h3 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Full Competitor Library
        </h3>
        <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: "var(--muted)" }}>
          Full intelligence reports for Boeing, Airbus, Embraer, Bombardier, COMAC, ATR, and 14 other OEMs
          are available in the commercial subscription tier.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-70"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          <Lock className="w-4 h-4" />
          Request Access
        </div>
      </div>
    </div>
  );
}
