import {
  BasicExecutiveComparisonEngine,
  BasicExecutiveSelectionEngine,
  projectSelectedReasoningResult,
} from "@/lib/executive";

import { BasicSuggestionProjector } from "@/lib/executive/suggestion";

const reasoning = {
  priorities: [
    {
      title: "Handle insurance issue affecting Jess",
      rationale: "Relationship impact exists because Jess is upset.",
      suggestedNextStep: "Call insurance.",
      evidenceIds: ["important"],
      confidence: 0.9,
    },
    {
      title: "Research headphones",
      rationale: "Could be interesting someday.",
      suggestedNextStep: "",
      evidenceIds: ["quiet"],
      confidence: 0.5,
    },
  ],
  generatedAt: new Date(),
  provider: "basic" as const,
};

const comparison =
  new BasicExecutiveComparisonEngine().compare({
    priorities: reasoning.priorities,
    generatedAt: reasoning.generatedAt,
  });

const selection =
  new BasicExecutiveSelectionEngine().select({
    priorities: comparison.priorities,
    generatedAt: comparison.generatedAt,
  });

const selected =
  projectSelectedReasoningResult(
    selection,
    reasoning
  );

if (selected.priorities.length !== 1) {
  throw new Error("Selection did not filter quiet priorities.");
}

const suggestions =
  new BasicSuggestionProjector().project({
    reasoningInput: {
      input: "test",
      evidence: [
        {
          id: "important",
          label: "Important",
          summary: "Evidence",
        },
      ],
    },
    reasoningResult: selected,
  });

if (suggestions.length !== 1) {
  throw new Error("Suggestion projection leaked quiet priorities.");
}

if (suggestions[0].evidence[0]?.id !== "important") {
  throw new Error("Evidence was not preserved.");
}

if ("selectionSignals" in suggestions[0]) {
  throw new Error("Selection metadata leaked into suggestions.");
}

console.log("Executive selection integration proof passed.");
console.log(
  JSON.stringify(
    {
      selectedPriorityCount: selected.priorities.length,
      suggestionCount: suggestions.length,
      evidencePreserved:
        suggestions[0].evidence[0]?.id === "important",
      noSelectionLeak:
        !("selectionSignals" in suggestions[0]),
    },
    null,
    2
  )
);
