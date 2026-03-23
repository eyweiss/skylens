import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { unstable_cache } from "next/cache";

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

interface RawArticle {
  title: string;
  description: string | null;
  source: string;
}

export interface CompetitiveSignal {
  company: string;
  signalType:
    | "Fleet Order"
    | "Route Launch"
    | "Route Exit"
    | "Partnership"
    | "Pricing Move"
    | "Hub Investment"
    | "Leadership Change"
    | "Financial"
    | "Regulatory";
  headline: string;
  interpretation: string;
  whoShouldCare: ("Airlines" | "Airports" | "OEMs")[];
  urgency: "High" | "Medium" | "Low";
  source: string;
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

async function fetchFeed(url: string): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((item) => {
      const link = item.link ?? "";
      const rawTitle = item.title ?? "";
      const sourceName = sourceFromTitle(rawTitle) ?? sourceFromUrl(link);
      return {
        title: stripHtml(rawTitle.replace(/ - [^-]+$/, "")),
        description: item.contentSnippet ? stripHtml(item.contentSnippet) : null,
        source: sourceName,
      };
    });
  } catch (err) {
    console.warn(`[/api/signals] Failed to fetch feed ${url}:`, err);
    return [];
  }
}

async function fetchNewsApi(): Promise<RawArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];
  try {
    const url = `https://newsapi.org/v2/everything?q=aviation+airline+airport&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 7200 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles ?? []).map((a: { title?: string; description?: string; source?: { name?: string } }) => ({
      title: a.title ?? "",
      description: a.description ?? null,
      source: a.source?.name ?? "NewsAPI",
    }));
  } catch {
    return [];
  }
}

async function classifySignals(articles: RawArticle[]): Promise<CompetitiveSignal[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const articleLines = articles
    .slice(0, 30)
    .map((a) => `- ${a.title}: ${a.description ?? ""}`)
    .join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      system: "You are a senior aviation competitive intelligence analyst.",
      messages: [
        {
          role: "user",
          content: `Analyze these aviation news articles and extract the 8 most significant competitive signals. For each signal return a JSON array:

[{
  "company": "company name",
  "signalType": one of: "Fleet Order" | "Route Launch" | "Route Exit" | "Partnership" | "Pricing Move" | "Hub Investment" | "Leadership Change" | "Financial" | "Regulatory",
  "headline": "one line describing what happened",
  "interpretation": "one sentence: what this likely means strategically",
  "whoShouldCare": array of: "Airlines" | "Airports" | "OEMs",
  "urgency": "High" | "Medium" | "Low",
  "source": "publication name"
}]

Return ONLY the JSON array, no other text.

Articles:
${articleLines}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Anthropic API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const text: string = data.content?.[0]?.text ?? "[]";

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleaned) as CompetitiveSignal[];
}

async function getSignals(): Promise<CompetitiveSignal[]> {
  const feedUrls: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const url = process.env[`GOOGLE_ALERTS_RSS_${i}`];
    if (url) feedUrls.push(url);
  }

  const [rssResults, newsApiArticles] = await Promise.all([
    Promise.all(feedUrls.map(fetchFeed)),
    fetchNewsApi(),
  ]);

  const seen = new Set<string>();
  const all: RawArticle[] = [...rssResults.flat(), ...newsApiArticles].filter((a) => {
    if (!a.title || seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });

  if (all.length === 0) {
    throw new Error("No articles available to analyze. Check your RSS feed configuration.");
  }

  return classifySignals(all);
}

const getCachedSignals = unstable_cache(
  async () => getSignals(),
  ["competitive-signals"],
  { revalidate: 7200 } // 2 hours
);

export async function GET() {
  try {
    const signals = await getCachedSignals();
    return NextResponse.json({ signals, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[/api/signals]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate signals" },
      { status: 500 }
    );
  }
}
