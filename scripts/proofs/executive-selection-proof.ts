import { BasicExecutiveSelectionEngine } from "@/lib/executive/selection";

const engine = new BasicExecutiveSelectionEngine();

const now = new Date();

const surfaced = engine.select({
  generatedAt: now,
  priorities: [
    {
      priority: {
        title: "Follow up on insurance issue affecting Jess",
        rationale: "Jess is upset because insurance was not contacted.",
        suggestedNextStep: "Call insurance today.",
        evidenceIds: ["e1"],
        confidence: 0.9,
      },
      comparisonSignals: [
        {
          kind: "relationshipImpact",
          label: "Relationship impact detected",
          weight: 22,
          evidenceIds: ["e1"],
        },
        {
          kind: "deadline",
          label: "Time boundary detected",
          weight: 30,
          evidenceIds: ["e1"],
        },
      ],
      executiveWeight: 52,
      originalIndex: 0,
    },
  ],
});

if (surfaced.decisions[0].decision !== "surface") {
  throw new Error("Important priority failed to surface");
}

const quiet = engine.select({
  generatedAt: now,
  priorities: [
    {
      priority: {
        title: "Maybe buy new headphones",
        rationale: "Interested in upgrading someday.",
        suggestedNextStep: "",
        evidenceIds: ["e2"],
        confidence: 0.5,
      },
      comparisonSignals: [],
      executiveWeight: 0,
      originalIndex: 0,
    },
  ],
});

if (quiet.decisions[0].decision !== "quiet") {
  throw new Error("Low-value priority failed to remain quiet");
}

if (quiet.decisions[0].priority.priority.evidenceIds[0] !== "e2") {
  throw new Error("Evidence was not preserved");
}

const empty = engine.select({
  generatedAt: now,
  priorities: [],
});

if (empty.decisions.length !== 0) {
  throw new Error("Empty selection should return empty output");
}

console.log("Executive selection proof passed.");
console.log(
  JSON.stringify(
    {
      surfaced: surfaced.decisions[0].decision,
      quiet: quiet.decisions[0].decision,
      evidencePreserved:
        quiet.decisions[0].priority.priority.evidenceIds[0] === "e2",
      emptyHandled: empty.decisions.length === 0,
    },
    null,
    2
  )
);
