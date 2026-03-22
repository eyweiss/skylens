import { NextResponse } from "next/server";

const NEWSAPI_QUERY =
  "commercial aviation OR airline OR airlines OR airport OR Boeing OR Airbus OR FAA OR EASA";

export async function GET() {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "NEWSAPI_KEY environment variable is not set." },
      { status: 500 }
    );
  }

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", NEWSAPI_QUERY);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "20");

  console.log("[/api/news] Fetching from NewsAPI");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-Api-Key": apiKey },
      next: { revalidate: 1800 },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[/api/news] NewsAPI error:", data);
      return NextResponse.json(
        { error: data.message || `NewsAPI returned status ${res.status}` },
        { status: res.status }
      );
    }

    const articles = (data.articles ?? []).map((a: {
      title: string;
      source: { name: string };
      url: string;
      publishedAt: string;
      description: string | null;
    }) => ({
      title: a.title,
      source: { name: a.source?.name ?? "Unknown" },
      url: a.url,
      publishedAt: a.publishedAt,
      description: a.description ?? null,
    }));

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
