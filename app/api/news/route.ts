import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEWSAPI_KEY;
  console.log("[/api/news] NEWSAPI_KEY present:", !!apiKey);
  if (!apiKey) {
    console.error("[/api/news] NEWSAPI_KEY is not set in environment variables");
    return NextResponse.json({ error: "NEWSAPI_KEY environment variable not set" }, { status: 500 });
  }

  const query = encodeURIComponent(
    'commercial aviation OR airline OR airlines OR airport OR "american airlines" OR "delta airlines" OR "united airlines" OR "southwest airlines" OR "air canada" OR FAA OR easyjet'
  );
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;
  console.log("[/api/news] Fetching URL:", url.replace(apiKey, "REDACTED"));

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    console.log("[/api/news] NewsAPI response status:", res.status);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[/api/news] NewsAPI error response:", data);
      return NextResponse.json(
        { error: data.message || `NewsAPI returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    console.log("[/api/news] Articles returned:", data.articles?.length ?? 0);
    return NextResponse.json({ articles: data.articles || [] });
  } catch (err) {
    console.error("[/api/news] Fetch error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch news" },
      { status: 500 }
    );
  }
}
