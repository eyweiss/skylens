import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

interface ArticleInput {
  title: string;
  description: string | null;
}

async function callClaude(articleLines: string[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a senior aviation market intelligence analyst.
Based on these recent aviation news articles, write a concise weekly intelligence brief with exactly 5 bullet points.

Each bullet point should be a sharp, actionable insight — not just a summary of one article, but a synthesized intelligence finding that would be useful to an airline BD team, airport commercial team, or OEM sales team.

Format each bullet as:
• [SIGNAL TYPE]: Insight text. (Source context)

Signal types: MARKET ALERT / COMPETITOR MOVE / OPPORTUNITY / REGULATORY / TREND

Articles:
${articleLines.join("\n")}

Write only the 5 bullet points, nothing else.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Anthropic API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  return (data.content?.[0]?.text as string) ?? "";
}

export async function POST(request: NextRequest) {
  let articles: ArticleInput[] = [];
  try {
    const body = await request.json();
    articles = Array.isArray(body.articles) ? body.articles : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const articleLines = articles
    .slice(0, 15)
    .map((a) => `- ${a.title}: ${a.description ?? ""}`);

  const getCachedBrief = unstable_cache(
    async (lines: string[]) => callClaude(lines),
    ["intelligence-brief"],
    { revalidate: 10800 } // 3 hours
  );

  try {
    const brief = await getCachedBrief(articleLines);
    return NextResponse.json({ brief });
  } catch (err) {
    console.error("[/api/intelligence-brief]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate brief" },
      { status: 500 }
    );
  }
}
