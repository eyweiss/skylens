"use client";

import { Briefcase, Search, BarChart2, Clock, BookOpen } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  tab: string;
  description: string;
}

interface RoleSection {
  icon: React.ReactNode;
  role: string;
  goal: string;
  steps: Step[];
  accentColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const roles: RoleSection[] = [
  {
    icon: <Briefcase className="w-5 h-5" />,
    role: "For Airline Business Development",
    goal: "Find growth opportunities and evaluate new markets",
    accentColor: "#2563eb",
    steps: [
      {
        tab: "Where to Grow",
        description:
          "Market attractiveness matrix shows which countries offer the best expansion potential",
      },
      {
        tab: "Who to Watch",
        description:
          "Understand which carriers are expanding aggressively into your target markets",
      },
      {
        tab: "Signals",
        description:
          "Monitor daily — route launches and fleet orders signal competitor intent early",
      },
      {
        tab: "Request Coverage",
        description: "Add airlines or routes you need to track",
      },
    ],
  },
  {
    icon: <Search className="w-5 h-5" />,
    role: "For Competitive Intelligence",
    goal: "Monitor competitor moves and get ahead of market shifts",
    accentColor: "#7c3aed",
    steps: [
      {
        tab: "Signals",
        description:
          "Check daily — Claude classifies competitor moves as they happen",
      },
      {
        tab: "Intelligence Brief",
        description:
          "Read weekly — structured briefing with threats, opportunities, and watchpoints",
      },
      {
        tab: "Fleet Watch",
        description:
          "Track aircraft orders that reveal competitor intent 2–3 years ahead",
      },
      {
        tab: "Who to Watch",
        description: "Review threat assessments monthly",
      },
    ],
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    role: "For Strategy & Executives",
    goal: "Understand market position and make informed decisions",
    accentColor: "#0891b2",
    steps: [
      {
        tab: "Market Pulse",
        description:
          "State-of-market indicators show the industry cycle at a glance",
      },
      {
        tab: "Where to Grow",
        description: "Identify priority versus emerging markets",
      },
      {
        tab: "Intelligence Brief",
        description: "Read weekly — executive summary built for leadership",
      },
      {
        tab: "Competitor Spotlight",
        description: "Deep competitive analysis on individual carriers",
      },
    ],
  },
];

const workflowItems = [
  { cadence: "Monday", task: "Intelligence Brief", duration: "5 min" },
  { cadence: "Daily", task: "Signals tab", duration: "2 min" },
  { cadence: "Weekly", task: "Who to Watch updates", duration: "5 min" },
  { cadence: "Monthly", task: "Fleet Watch review", duration: "10 min" },
  {
    cadence: "Quarterly",
    task: "Where to Grow + Players strategic review",
    duration: "20 min",
  },
];

const glossary = [
  { term: "ASK", definition: "Available Seat Kilometers — total capacity offered" },
  { term: "RPK", definition: "Revenue Passenger Kilometers — actual demand" },
  { term: "Load Factor", definition: "% of seats filled with paying passengers" },
  { term: "Yield", definition: "Average revenue per passenger kilometer" },
  { term: "CASK", definition: "Cost per Available Seat Kilometer" },
  { term: "OTP", definition: "On-Time Performance" },
  { term: "LCC", definition: "Low Cost Carrier" },
  { term: "Hub & Spoke", definition: "Network model routing traffic through central hubs" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Guide() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          How to Use SkyLens
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Start here to get the most out of the dashboard — pick your role and follow the recommended
          workflow.
        </p>
      </div>

      {/* Role sections */}
      {roles.map((section) => (
        <div
          key={section.role}
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* Role header */}
          <div
            className="px-6 py-4 flex items-center gap-3 border-b"
            style={{
              backgroundColor: section.accentColor + "18",
              borderColor: section.accentColor + "40",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: section.accentColor + "25", color: section.accentColor }}
            >
              {section.icon}
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                {section.role}
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Goal: {section.goal}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {section.steps.map((step, i) => (
              <div key={i} className="px-6 py-4 flex items-start gap-4">
                {/* Step number */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: section.accentColor + "20", color: section.accentColor }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{
                      backgroundColor: section.accentColor + "15",
                      color: section.accentColor,
                    }}>
                      {step.tab}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Recommended workflow */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
            Recommended Workflow
          </h2>
        </div>
        <div className="space-y-2">
          {workflowItems.map((item) => (
            <div
              key={item.cadence}
              className="flex items-center justify-between rounded-lg px-4 py-3"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="text-xs font-semibold w-20 flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                >
                  {item.cadence}
                </span>
                <span className="text-sm" style={{ color: "var(--foreground)" }}>
                  {item.task}
                </span>
              </div>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {item.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Glossary */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
            Key Metrics Glossary
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {glossary.map((item) => (
            <div
              key={item.term}
              className="flex gap-3 rounded-lg px-4 py-3"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <span
                className="text-xs font-bold flex-shrink-0 w-24"
                style={{ color: "var(--accent)" }}
              >
                {item.term}
              </span>
              <span className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {item.definition}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
