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

async function fetchFeed(url: string): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(url);
    console.log(`[/api/news] Feed ${url.slice(-40)} returned ${feed.items.length} items`);
    return feed.items.map((item) => ({
      title: item.title ?? "",
      source: { name: feed.title ?? new URL(url).hostname },
      url: item.link ?? "",
      publishedAt: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      description: item.contentSnippet ?? null,
    }));
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
    const all = results.flat();

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
