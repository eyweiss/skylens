import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

interface ArticleInput {
  title: string;
  description: string | null;
}

export interface BriefSignal {
  type: string;
  text: string;
}

export interface BriefThreat {
  description: string;
  exposedTo: string[];
  urgency: "High" | "Medium" | "Low";
  action: string;
}

export interface BriefOpportunity {
  description: string;
  beneficiary: string[];
  horizon: "Near term" | "Medium term";
  howToAct: string;
}

export interface BriefWatchpoint {
  item: string;
  why: string;
}

export interface StructuredBrief {
  executiveSummary: string;
  signals: BriefSignal[];
  threats: BriefThreat[];
  opportunities: BriefOpportunity[];
  watchpoints: BriefWatchpoint[];
  analystNote: string;
}

async function callClaude(articleLines: string[]): Promise<StructuredBrief> {
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
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a senior aviation market intelligence analyst writing for airline BD teams, airport commercial teams, and OEM sales teams.

Based on these recent aviation news articles, generate a structured weekly intelligence brief as valid JSON only — no markdown, no explanation, just the JSON object.

Use this exact structure:
{
  "executiveSummary": "One paragraph synthesizing the single most important market development this week and its strategic implications.",
  "signals": [
    {"type": "MARKET ALERT|COMPETITOR MOVE|OPPORTUNITY|REGULATORY|TREND", "text": "Actionable insight synthesized from the articles — not a summary, but an intelligence finding."}
  ],
  "threats": [
    {
      "description": "Specific threat description (1-2 sentences)",
      "exposedTo": ["Airlines", "Airports", "OEMs"],
      "urgency": "High|Medium|Low",
      "action": "Concrete recommended response action"
    }
  ],
  "opportunities": [
    {
      "description": "Specific opportunity description (1-2 sentences)",
      "beneficiary": ["Airlines", "Airports", "OEMs"],
      "horizon": "Near term|Medium term",
      "howToAct": "How to capitalize on this opportunity"
    }
  ],
  "watchpoints": [
    {"item": "Thing to monitor in the coming week", "why": "Brief explanation of why this matters"}
  ],
  "analystNote": "One paragraph of broader strategic context — what underlying multi-year trend does this week's news reflect?"
}

Requirements:
- Exactly 5 signals
- Exactly 3 threats
- Exactly 3 opportunities
- Exactly 3 watchpoints
- All insights must be synthesized from the articles below, not invented
- Be specific — name companies, routes, and regions where possible

Articles:
${articleLines.join("\n")}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Anthropic API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const rawText = (data.content?.[0]?.text as string) ?? "";

  // Strip any markdown code fences if Claude wraps in ```json
  const jsonText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: StructuredBrief;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Failed to parse structured JSON from Claude response");
  }

  return parsed;
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
    ["intelligence-brief-v2"],
    { revalidate: 10800 } // 3 hours
  );

  try {
    const structured = await getCachedBrief(articleLines);
    return NextResponse.json({ structured });
  } catch (err) {
    console.error("[/api/intelligence-brief]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate brief" },
      { status: 500 }
    );
  }
}
