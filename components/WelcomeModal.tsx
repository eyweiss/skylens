"use client";

import { useEffect, useState } from "react";
import { X, Briefcase, Search, BarChart2 } from "lucide-react";

const STORAGE_KEY = "skylens-welcome-seen";

interface RoleCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
}

const roles: RoleCard[] = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Airline Business Development",
    description: "Find growth opportunities and evaluate new markets using the attractiveness matrix and competitor signals.",
    accentColor: "#2563eb",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Competitive Intelligence",
    description: "Monitor competitor moves in real time — from fleet orders to route launches — and get ahead of market shifts.",
    accentColor: "#7c3aed",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Strategy & Executive",
    description: "Understand market position and track industry cycles with structured briefings built for leadership decisions.",
    accentColor: "#0891b2",
  },
];

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } catch {
      // localStorage blocked (SSR / private mode) — stay hidden
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={dismiss}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl rounded-2xl border shadow-2xl p-8"
        style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-opacity hover:opacity-60"
          style={{ color: "var(--muted)" }}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Heading */}
        <div className="text-center mb-8">
          <div
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
          >
            Welcome to SkyLens CI
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Who are you using this for?
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            SkyLens adapts to your role. See the{" "}
            <strong style={{ color: "var(--foreground)" }}>Guide tab</strong> for a tailored
            workflow.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-xl border p-5 flex flex-col gap-3 cursor-default"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: role.accentColor + "20", color: role.accentColor }}
              >
                {role.icon}
              </div>
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {role.title}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {role.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={dismiss}
            className="px-8 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
