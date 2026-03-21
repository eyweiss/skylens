import { Linkedin } from "lucide-react";

export function About() {
  return (
    <div className="max-w-3xl space-y-8">
      {/* About SkyLens */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
          About SkyLens CI
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          SkyLens CI is a real-time market and competitive intelligence report covering the commercial aviation
          landscape. It tracks OEMs, airlines, and airports across key markets, delivering structured intelligence
          on the competitive environment, regulatory landscape, and market dynamics shaping the industry.
        </p>
      </div>

      {/* About Me */}
      <div
        className="p-6 rounded-xl border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--foreground)" }}>
          About the Author
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
          I&apos;ve always been drawn to understanding what sits beneath the surface—how markets shift, how
          competitors think, and how signals turn into strategy. I started in intelligence, analyzing open-source
          data to uncover hidden patterns and risks. Today, I apply that same mindset to market and competitive
          intelligence, helping organizations navigate complex environments and make better strategic decisions.
          My work sits at the intersection of cybersecurity, intelligence, and product strategy, where I turn
          fragmented data into clear, actionable insights.
        </p>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            EW
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              E. Weiss
            </div>
            <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>
              Market &amp; Competitive Intelligence Leader
            </div>
            <a
              href="https://www.linkedin.com/in/weisseyal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              <Linkedin className="w-3.5 h-3.5" />
              linkedin.com/in/weisseyal
            </a>
          </div>
        </div>
      </div>

      {/* Data sources note */}
      <div
        className="p-5 rounded-xl border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Data Sources &amp; Methodology
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          SkyLens CI aggregates data from publicly available sources including IATA, ICAO, OEM annual reports,
          airline fleet databases, and industry publications. Market size figures reflect consensus analyst
          estimates as of Q1 2025. Fleet figures are approximate and based on operational fleets. News content
          is sourced via NewsAPI. The Competitor Spotlight demo profile (AeroVision Systems) is a fictional
          entity created for illustrative purposes.
        </p>
      </div>
    </div>
  );
}
