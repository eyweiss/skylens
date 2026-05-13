"use client";

import { useState, useEffect, useRef } from "react";
import { Plane } from "lucide-react";

const PASSWORD = "skylens2026";
const STORAGE_KEY = "skylens_auth";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAuthenticated(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (authenticated === false) {
      inputRef.current?.focus();
    }
  }, [authenticated]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setAuthenticated(true);
    } else {
      setError(true);
      setInput("");
      inputRef.current?.focus();
    }
  }

  // Null during first render to avoid hydration mismatch
  if (authenticated === null) return null;

  if (authenticated) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plane className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold leading-none tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              SkyLens CI
            </div>
            <div className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
              Commercial Aviation Market Intelligence
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            ref={inputRef}
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Enter access password"
            autoComplete="current-password"
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--background)",
              border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
              color: "var(--foreground)",
            }}
          />

          {error && (
            <p className="text-xs text-center" style={{ color: "#ef4444" }}>
              Incorrect password
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Access
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-center leading-relaxed" style={{ color: "var(--muted)" }}>
          Access is free by request —{" "}
          <a
            href="mailto:eyal.weiss@pm.me"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            eyal.weiss@pm.me
          </a>
        </p>
      </div>
    </div>
  );
}
