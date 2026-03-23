"use client";

import { useState } from "react";
import { Airlines } from "./Airlines";
import { Airports } from "./Airports";
import { OEMs } from "./OEMs";

type SubTab = "Airlines" | "Airports" | "OEMs";

const subTabs: SubTab[] = ["Airlines", "Airports", "OEMs"];

export function Players() {
  const [sub, setSub] = useState<SubTab>("Airlines");

  return (
    <div className="space-y-6">
      {/* Sub-tab pill switcher */}
      <div className="flex gap-2 flex-wrap">
        {subTabs.map((t) => (
          <button
            key={t}
            onClick={() => setSub(t)}
            className="px-5 py-2 rounded-full text-sm font-semibold border transition-colors"
            style={{
              backgroundColor: sub === t ? "var(--accent)" : "var(--card)",
              color: sub === t ? "#fff" : "var(--muted)",
              borderColor: sub === t ? "var(--accent)" : "var(--border)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {sub === "Airlines" && <Airlines />}
      {sub === "Airports" && <Airports />}
      {sub === "OEMs" && <OEMs />}
    </div>
  );
}
