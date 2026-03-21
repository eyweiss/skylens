"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketOverview } from "@/components/tabs/MarketOverview";
import { OEMs } from "@/components/tabs/OEMs";
import { Airlines } from "@/components/tabs/Airlines";
import { Airports } from "@/components/tabs/Airports";
import { CompetitorSpotlight } from "@/components/tabs/CompetitorSpotlight";
import { CountryProfiles } from "@/components/tabs/CountryProfiles";
import { RecentNews } from "@/components/tabs/RecentNews";
import { About } from "@/components/tabs/About";

type Tab =
  | "Market Overview"
  | "OEMs"
  | "Airlines"
  | "Airports"
  | "Competitor Spotlight"
  | "Country Profiles"
  | "Recent News"
  | "About";

const tabs: Tab[] = [
  "Market Overview",
  "OEMs",
  "Airlines",
  "Airports",
  "Competitor Spotlight",
  "Country Profiles",
  "Recent News",
  "About",
];

const tabComponents: Record<Tab, React.ComponentType> = {
  "Market Overview": MarketOverview,
  OEMs: OEMs,
  Airlines: Airlines,
  Airports: Airports,
  "Competitor Spotlight": CompetitorSpotlight,
  "Country Profiles": CountryProfiles,
  "Recent News": RecentNews,
  About: About,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Market Overview");
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
