"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, ExternalLink, Calendar, Newspaper } from "lucide-react";

interface Article {
  title: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  description: string | null;
}

type Category = "All" | "Airlines" | "Airports" | "OEMs" | "Regulation" | "Safety" | "Sustainability" | "General";

const CATEGORIES: { name: Exclude<Category, "All">; keywords: string[]; color: string; bg: string }[] = [
  {
    name: "Airlines",
    keywords: ["airline", "airlines", "carrier", "fleet", "passenger", "flight", "route"],
    color: "#2563eb",
    bg: "rgba(37,99,235,0.12)",
  },
  {
    name: "Airports",
    keywords: ["airport", "terminal", "runway", "hub", "gate", "slot"],
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.12)",
  },
  {
    name: "OEMs",
    keywords: ["boeing", "airbus", "embraer", "bombardier", "comac", "aircraft", "narrowbody", "widebody", "order", "delivery"],
    color: "#ea580c",
    bg: "rgba(234,88,12,0.12)",
  },
  {
    name: "Regulation",
    keywords: ["faa", "easa", "icao", "regulation", "regulatory", "certification", "airworthiness"],
    color: "#dc2626",
    bg: "rgba(220,38,38,0.12)",
  },
  {
    name: "Safety",
    keywords: ["crash", "incident", "accident", "grounding", "investigation", "safety"],
    color: "#ca8a04",
    bg: "rgba(202,138,4,0.12)",
  },
  {
    name: "Sustainability",
    keywords: ["saf", "sustainable", "emissions", "carbon", "electric", "hybrid", "green"],
    color: "#16a34a",
    bg: "rgba(22,163,74,0.12)",
  },
];

function detectCategory(title: string, description: string | null): Exclude<Category, "All"> {
  const text = `${title} ${description ?? ""}`.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => text.includes(kw))) {
      return cat.name;
    }
  }
  return "General";
}

const CATEGORY_STYLE: Record<Exclude<Category, "All">, { color: string; bg: string }> = {
  Airlines:       { color: "#2563eb", bg: "rgba(37,99,235,0.12)" },
  Airports:       { color: "#7c3aed", bg: "rgba(124,58,237,0.12)" },
  OEMs:           { color: "#ea580c", bg: "rgba(234,88,12,0.12)" },
  Regulation:     { color: "#dc2626", bg: "rgba(220,38,38,0.12)" },
  Safety:         { color: "#ca8a04", bg: "rgba(202,138,4,0.12)" },
  Sustainability: { color: "#16a34a", bg: "rgba(22,163,74,0.12)" },
  General:        { color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};

const FILTER_OPTIONS: Category[] = ["All", "Airlines", "Airports", "OEMs", "Regulation", "Safety", "Sustainability"];

function SkeletonCard() {
  return (
    <div
      className="p-4 rounded-xl border animate-pulse"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="h-3 rounded mb-2" style={{ backgroundColor: "var(--border)", width: "60%" }} />
      <div className="h-4 rounded mb-2" style={{ backgroundColor: "var(--border)", width: "90%" }} />
      <div className="h-4 rounded mb-3" style={{ backgroundColor: "var(--border)", width: "75%" }} />
      <div className="h-3 rounded" style={{ backgroundColor: "var(--border)", width: "40%" }} />
    </div>
  );
}

export function RecentNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setArticles(data.articles || []);
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const categorised = articles.map((a) => ({
    ...a,
    category: detectCategory(a.title, a.description),
  }));

  const filtered = activeFilter === "All"
    ? categorised
    : categorised.filter((a) => a.category === activeFilter);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            Aviation Industry News
          </h2>
          {lastFetched && (
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Updated {lastFetched.toLocaleTimeString()}
            </div>
          )}
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--muted)",
            borderColor: "var(--border)",
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
            style={{
              backgroundColor: activeFilter === cat ? "var(--accent)" : "var(--card)",
              color: activeFilter === cat ? "#fff" : "var(--muted)",
              borderColor: activeFilter === cat ? "var(--accent)" : "var(--border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div
          className="p-4 rounded-xl border text-sm"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <div className="font-semibold mb-1" style={{ color: "#ff7452" }}>
            Could not load news
          </div>
          <div>{error}</div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Articles */}
      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((article, i) => {
            const catStyle = CATEGORY_STYLE[article.category as Exclude<Category, "All">];
            return (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block p-4 rounded-xl border group transition-all hover:border-[var(--accent)] hover:shadow-sm"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                {/* Category badge */}
                <span
                  className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
                >
                  {article.category}
                </span>

                <div className="flex items-center gap-2 mb-2 pr-20">
                  <Newspaper className="w-3 h-3 flex-shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    {article.source.name}
                  </span>
                  <span className="text-xs ml-auto flex items-center gap-1" style={{ color: "var(--muted)" }}>
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <h3
                  className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors"
                  style={{ color: "var(--foreground)" }}
                >
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--muted)" }}>
                    {article.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                  <ExternalLink className="w-3 h-3" />
                  Read more
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Empty state — no articles at all, or none matching the active filter */}
      {!loading && !error && (articles.length === 0 || filtered.length === 0) && (
        <div
          className="p-8 rounded-xl border text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <Newspaper className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            {articles.length === 0
              ? "No articles found. Try refreshing."
              : `No articles found for "${activeFilter}".`}
          </div>
        </div>
      )}
    </div>
  );
}
