import React from "react";
import { AbsoluteFill } from "remotion";
import { TAJWEED_RULES } from "./tajweed";
import { TRANSLATION_FONT } from "./fonts";

// Compact legend of only the rules that actually appear in this video, so
// viewers can learn what each colour means.
export const TajweedLegend: React.FC<{ rules: string[] }> = ({ rules }) => {
  const items = rules
    .map((r) => TAJWEED_RULES[r])
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  if (items.length === 0) return null;

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 18px",
          maxWidth: 900,
          padding: "0 60px",
        }}
      >
        {items.map((r) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: r.color,
                boxShadow: `0 0 10px ${r.color}`,
              }}
            />
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 22, color: "#cdd8e6" }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
