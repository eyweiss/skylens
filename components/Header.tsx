"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Plane } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plane className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-lg font-bold leading-none" style={{ color: "var(--foreground)" }}>
              SkyLens CI
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Commercial Aviation Market Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--card)",
                color: "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Bright View</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark View</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
