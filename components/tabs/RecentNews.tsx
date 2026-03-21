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
          <div className="mt-2 text-xs">
            Make sure <code className="px-1 rounded" style={{ backgroundColor: "var(--border)" }}>NEWSAPI_KEY</code> is
            set in your environment variables.
          </div>
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
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border group transition-all hover:border-[var(--accent)] hover:shadow-sm"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
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
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && articles.length === 0 && (
        <div
          className="p-8 rounded-xl border text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <Newspaper className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            No articles found. Try refreshing.
          </div>
        </div>
      )}
    </div>
  );
}
