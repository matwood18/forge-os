import { BasicExecutiveComparisonEngine } from "@/lib/executive/comparison";
import { BasicSuggestionProjector } from "@/lib/executive/suggestion";
import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

const generatedAt = new Date("2026-07-09T17:00:00.000Z");

const reasoningInput: ExecutiveReasoningInput = {
  input: "Jess is upset about insurance. I should organize my desk.",
  evidence: [
    {
      id: "evidence:jess",
      label: "Jess affected by insurance issue",
      summary: "Jess appears affected by an unresolved insurance responsibility.",
      confidence: 0.9,
      source: "execution:test",
    },
    {
      id: "evidence:desk",
      label: "Desk organization",
      summary: "Desk organization would be useful.",
      confidence: 0.7,
      source: "execution:test",
    },
  ],
};

const reasoningResult: ExecutiveReasoningResult = {
  provider: "basic",
  generatedAt,
  priorities: [
    {
      title: "Organize desk",
      rationale: "This would improve organization.",
      suggestedNextStep: "Clear the desk.",
      evidenceIds: ["evidence:desk"],
      confidence: 0.7,
    },
    {
      title: "Contact Jess about insurance",
      rationale:
        "Jess appears affected and this remains unresolved.",
      suggestedNextStep:
        "Contact Jess after addressing insurance.",
      evidenceIds: ["evidence:jess"],
      confidence: 0.85,
    },
  ],
};

const comparison =
  new BasicExecutiveComparisonEngine().compare({
    priorities: reasoningResult.priorities,
    generatedAt: reasoningResult.generatedAt,
  });

const comparedReasoningResult: ExecutiveReasoningResult = {
  ...reasoningResult,
  priorities: comparison.priorities.map(
    (item) => item.priority
  ),
};

const suggestions =
  new BasicSuggestionProjector().project({
    reasoningInput,
    reasoningResult: comparedReasoningResult,
  });

const firstSuggestion = suggestions[0];

const proof = {
  comparisonChangedOrdering:
    firstSuggestion?.title === "Contact Jess about insurance",

  suggestionShapePreserved:
    firstSuggestion?.whyItMatters ===
      "Jess appears affected and this remains unresolved." &&
    firstSuggestion?.suggestedNextStep ===
      "Contact Jess after addressing insurance.",

  evidencePreserved:
    firstSuggestion?.evidence[0]?.id === "evidence:jess",

  noComparisonLeak:
    !Object.prototype.hasOwnProperty.call(
      firstSuggestion ?? {},
      "executiveWeight"
    ) &&
    !Object.prototype.hasOwnProperty.call(
      firstSuggestion ?? {},
      "comparisonSignals"
    ),
};

const passed = Object.values(proof).every(Boolean);

if (!passed) {
  console.error("Executive comparison integration proof failed.");
  console.error(JSON.stringify(proof, null, 2));
  process.exit(1);
}

console.log("Executive comparison integration proof passed.");
console.log(JSON.stringify(proof, null, 2));
