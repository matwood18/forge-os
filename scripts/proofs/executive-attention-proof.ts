import {
  BasicExecutiveAttentionEngine,
} from "@/lib/executive/attention";

import type {
  ExecutiveSelectionResult,
} from "@/lib/executive/selection";

const generatedAt = new Date();

const selection: ExecutiveSelectionResult = {
  generatedAt,
  decisions: [
    {
      priority: {
        priority: {
          title: "Call insurance",
          rationale: "Unresolved insurance issue",
          suggestedNextStep: "Contact insurance provider",
          evidenceIds: ["evidence-1"],
          confidence: 0.9,
        },
        comparisonSignals: [],
        executiveWeight: 1,
        originalIndex: 0,
      },
      decision: "surface",
      selectionSignals: [
        {
          kind: "highConsequence",
          label: "Potential future cost",
          weight: 1,
          evidenceIds: ["evidence-1"],
        },
      ],
      originalIndex: 0,
    },
    {
      priority: {
        priority: {
          title: "Organize old photos",
          rationale: "Low urgency personal project",
          suggestedNextStep: "Review old photos when convenient",
          evidenceIds: [],
          confidence: 0.7,
        },
        comparisonSignals: [],
        executiveWeight: 0.2,
        originalIndex: 1,
      },
      decision: "quiet",
      selectionSignals: [],
      originalIndex: 1,
    },
  ],
};

const engine = new BasicExecutiveAttentionEngine();

const result = engine.evaluate({
  decisions: selection.decisions,
  generatedAt,
});

const surfaced = result.attention.find(
  (item) => item.selectionDecision === "surface"
);

const quiet = result.attention.find(
  (item) => item.selectionDecision === "quiet"
);

if (surfaced?.state !== "surfaced") {
  throw new Error("Surface selection did not become surfaced attention");
}

if (quiet?.state !== "quiet") {
  throw new Error("Quiet selection did not remain quiet");
}

if (surfaced.selectionSignals.length !== 1) {
  throw new Error("Selection provenance was not preserved");
}

const empty = engine.evaluate({
  decisions: [],
  generatedAt,
});

if (empty.attention.length !== 0) {
  throw new Error("Empty attention input was not handled safely");
}

console.log("Executive attention proof passed.");
console.log(
  JSON.stringify(
    {
      surfacedState: surfaced.state,
      quietState: quiet.state,
      preservedSignals:
        surfaced.selectionSignals.length,
      emptySafe: empty.attention.length === 0,
    },
    null,
    2
  )
);
