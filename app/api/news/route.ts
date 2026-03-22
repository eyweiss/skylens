import { NextResponse } from "next/server";

interface Article {
  title: string;
  url: string;
  publishedAt: string;
  description: string;
  source: { name: string };
}

function extractText(xml: string, tag: string): string {
  const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i").exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i").exec(xml);
  return match ? match[1].trim() : "";
}

function parseRSSItems(xml: string): Article[] {
  const items: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractText(block, "title");
    const link = extractText(block, "link") || extractText(block, "guid");
    const pubDate = extractText(block, "pubDate");
    const description = extractText(block, "description");
    if (!title || !link) continue;
    items.push({
      title,
      url: link,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date(0).toISOString(),
      description,
      source: { name: "Google Alerts" },
    });
  }
  return items;
}

export async function GET() {
  const feedUrls: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const val = process.env[`GOOGLE_ALERTS_RSS_${i}`];
    if (val) feedUrls.push(val);
  }

  if (feedUrls.length === 0) {
    return NextResponse.json(
      { error: "No Google Alerts RSS feeds configured. Set GOOGLE_ALERTS_RSS_1 through GOOGLE_ALERTS_RSS_8 environment variables." },
      { status: 500 }
    );
  }

  console.log(`[/api/news] Fetching ${feedUrls.length} Google Alerts RSS feed(s)`);

  try {
    const results = await Promise.allSettled(
      feedUrls.map((url) => fetch(url, { next: { revalidate: 300 } }))
    );

    const articles: Article[] = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "rejected") {
        console.error(`[/api/news] Feed ${i + 1} fetch failed:`, result.reason);
        continue;
      }
      const res = result.value;
      if (!res.ok) {
        console.error(`[/api/news] Feed ${i + 1} returned status ${res.status}`);
        continue;
      }
      const xml = await res.text();
      const items = parseRSSItems(xml);
      console.log(`[/api/news] Feed ${i + 1}: ${items.length} items`);
      articles.push(...items);
    }

    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const top30 = articles.slice(0, 30);

    console.log(`[/api/news] Total articles returned: ${top30.length}`);
    return NextResponse.json({ articles: top30 });
  } catch (err) {
    console.error("[/api/news] Unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch news" },
      { status: 500 }
    );
  }
}
