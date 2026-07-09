import {
  BasicExecutiveAttentionEngine,
  BasicExecutiveSelectionEngine,
} from "@/lib/executive";

import type {
  ExecutiveComparedPriority,
} from "@/lib/executive/comparison";

const priorities: ExecutiveComparedPriority[] = [
  {
    priority: {
      title: "Call insurance",
      rationale: "Unresolved insurance issue",
      suggestedNextStep: "Contact insurance",
      evidenceIds: ["evidence-1"],
      confidence: 0.9,
    },
    comparisonSignals: [
      {
        kind: "relationshipImpact",
        label: "Relationship impact detected",
        weight: 20,
        evidenceIds: ["evidence-1"],
      },
      {
        kind: "deadline",
        label: "Deadline detected",
        weight: 20,
        evidenceIds: ["evidence-1"],
      },
    ],
    executiveWeight: 40,
    originalIndex: 0,
  },
  {
    priority: {
      title: "Organize photos",
      rationale: "Lower priority organization task",
      suggestedNextStep: "Sort photos",
      evidenceIds: ["evidence-2"],
      confidence: 0.7,
    },
    comparisonSignals: [],
    executiveWeight: 5,
    originalIndex: 1,
  },
];

const selection =
  new BasicExecutiveSelectionEngine().select({
    priorities,
    generatedAt: new Date(),
  });

const attention =
  new BasicExecutiveAttentionEngine().evaluate({
    decisions: selection.decisions,
    generatedAt: selection.generatedAt,
  });

const surfaced = attention.attention.find(
  (state) =>
    state.priority.priority.title === "Call insurance"
);

const quiet = attention.attention.find(
  (state) =>
    state.priority.priority.title === "Organize photos"
);

if (!surfaced || surfaced.state !== "surfaced") {
  throw new Error(
    "Selected priority did not become surfaced attention"
  );
}

if (!quiet || quiet.state !== "quiet") {
  throw new Error(
    "Quiet priority did not remain quiet"
  );
}

console.log(
  "Executive attention integration proof passed."
);

console.log(
  JSON.stringify(
    {
      surfacedState: surfaced.state,
      quietState: quiet.state,
      attentionCount: attention.attention.length,
    },
    null,
    2
  )
);
