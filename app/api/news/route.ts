import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

interface Article {
  title: string;
  source: { name: string };
  url: string;
  publishedAt: string;
  description: string | null;
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function sourceFromTitle(title: string): string | null {
  // Google Alerts titles often end with " - Source Name"
  const match = / - ([^-]+)$/.exec(title);
  return match ? match[1].trim() : null;
}

function sourceFromUrl(articleUrl: string): string {
  try {
    const hostname = new URL(articleUrl).hostname.replace(/^www\./, "");
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch {
    return articleUrl;
  }
}

async function fetchFeed(url: string): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(url);
    console.log(`[/api/news] Feed ${url.slice(-40)} returned ${feed.items.length} items`);
    return feed.items.map((item) => {
      const link = item.link ?? "";
      const rawTitle = item.title ?? "";
      const sourceName = sourceFromTitle(rawTitle) ?? sourceFromUrl(link);
      return {
        title: stripHtml(rawTitle.replace(/ - [^-]+$/, "")),
        source: { name: sourceName },
        url: link,
        publishedAt: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString(),
        description: item.contentSnippet ? stripHtml(item.contentSnippet) : null,
      };
    });
  } catch (err) {
    console.warn(`[/api/news] Failed to fetch feed ${url}:`, err);
    return [];
  }
}

export async function GET() {
  const feedUrls: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const url = process.env[`GOOGLE_ALERTS_RSS_${i}`];
    if (url) feedUrls.push(url);
  }

  if (feedUrls.length === 0) {
    return NextResponse.json(
      { error: "No Google Alerts RSS URLs configured (GOOGLE_ALERTS_RSS_1 through GOOGLE_ALERTS_RSS_8)." },
      { status: 500 }
    );
  }

  console.log(`[/api/news] Fetching ${feedUrls.length} Google Alerts RSS feed(s)`);

  try {
    const results = await Promise.all(feedUrls.map(fetchFeed));
    const seen = new Set<string>();
    const all = results.flat().filter((a) => {
      if (!a.url || seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    all.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const articles = all.slice(0, 30);
    console.log(`[/api/news] Articles returned: ${articles.length}`);
    return NextResponse.json({ articles });
  } catch (err) {
    console.error("[/api/news] Unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch news" },
      { status: 500 }
    );
  }
}
