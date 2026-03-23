"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

/** Tab name → URL slug */
const TAB_SLUG: Record<Tab, string> = {
  "Market Pulse":        "market-pulse",
  "Players":             "players",
  "Who to Watch":        "who-to-watch",
  "Fleet Watch":         "fleet-watch",
  "Where to Grow":       "where-to-grow",
  "Signals":             "signals",
  "Intelligence Brief":  "intelligence-brief",
  "Recent News":         "recent-news",
  "Competitor Spotlight":"competitor-spotlight",
  "Request Coverage":    "request-coverage",
  "About":               "about",
};

/** URL slug → Tab name */
const SLUG_TAB = Object.fromEntries(
  Object.entries(TAB_SLUG).map(([tab, slug]) => [slug, tab as Tab])
) as Record<string, Tab>;

const DEFAULT_TAB: Tab = "Market Pulse";

const tabComponents: Record<Tab, React.ComponentType> = {
  "Market Pulse":        MarketPulse,
  "Players":             Players,
  "Who to Watch":        WhoToWatch,
  "Fleet Watch":         FleetWatch,
  "Where to Grow":       WhereToGrow,
  "Signals":             Signals,
  "Intelligence Brief":  IntelligenceBrief,
  "Recent News":         RecentNews,
  "Competitor Spotlight":CompetitorSpotlight,
  "Request Coverage":    RequestCoverage,
  "About":               About,
};

// ─── Inner component — uses useSearchParams, must be inside <Suspense> ────────

function HomeContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("tab") ?? TAB_SLUG[DEFAULT_TAB];
  const activeTab: Tab = SLUG_TAB[slug] ?? DEFAULT_TAB;

  function navigateTab(tab: Tab) {
    // replaceState so the back button exits the page rather than cycling tabs.
    // Next.js intercepts replaceState and syncs useSearchParams automatically.
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", TAB_SLUG[tab]);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }

  const ActiveComponent = tabComponents[activeTab];

  return (
    <>
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
                onClick={() => navigateTab(tab)}
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
    </>
  );
}

// ─── Page shell — wraps HomeContent in Suspense as required by useSearchParams ─

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>
      <Footer />
    </div>
  );
}
