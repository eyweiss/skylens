"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketPulse } from "@/components/tabs/MarketPulse";
import { Players } from "@/components/tabs/Players";
import { WhoToWatch } from "@/components/tabs/WhoToWatch";
import { FleetWatch } from "@/components/tabs/FleetWatch";
import { WhereToGrow } from "@/components/tabs/WhereToGrow";
import { Signals } from "@/components/tabs/Signals";
import { IntelligenceBrief } from "@/components/tabs/IntelligenceBrief";
import { RecentNews } from "@/components/tabs/RecentNews";
import { CompetitorSpotlight } from "@/components/tabs/CompetitorSpotlight";
import { RequestCoverage } from "@/components/tabs/RequestCoverage";
import { About } from "@/components/tabs/About";

type Tab =
  | "Market Pulse"
  | "Players"
  | "Who to Watch"
  | "Fleet Watch"
  | "Where to Grow"
  | "Signals"
  | "Intelligence Brief"
  | "Recent News"
  | "Competitor Spotlight"
  | "Request Coverage"
  | "About";

const tabs: Tab[] = [
  "Market Pulse",
  "Players",
  "Who to Watch",
  "Fleet Watch",
  "Where to Grow",
  "Signals",
  "Intelligence Brief",
  "Recent News",
  "Competitor Spotlight",
  "Request Coverage",
  "About",
];

const tabComponents: Record<Tab, React.ComponentType> = {
  "Market Pulse":       MarketPulse,
  "Players":            Players,
  "Who to Watch":       WhoToWatch,
  "Fleet Watch":        FleetWatch,
  "Where to Grow":      WhereToGrow,
  "Signals":            Signals,
  "Intelligence Brief": IntelligenceBrief,
  "Recent News":        RecentNews,
  "Competitor Spotlight": CompetitorSpotlight,
  "Request Coverage":   RequestCoverage,
  "About":              About,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Market Pulse");
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Tab bar */}
      <div
        className="sticky top-[65px] z-40 border-b"
        style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
      >
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0"
                style={{
                  borderBottomColor: activeTab === tab ? "var(--accent)" : "transparent",
                  color: activeTab === tab ? "var(--accent)" : "var(--muted)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-8">
        <ActiveComponent />
      </main>

      <Footer />
    </div>
  );
}
