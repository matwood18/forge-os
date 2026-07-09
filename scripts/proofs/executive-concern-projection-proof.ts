import { BasicExecutiveConcernProjector } from "@/lib/executive/concern-projection";
import type { ExecutiveAttentionResult } from "@/lib/executive/attention";
import type { ExecutiveOutput } from "@/lib/executive/output";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const generatedAt = new Date("2026-07-09T15:00:00.000Z");

const attention: ExecutiveAttentionResult = {
  generatedAt,
  attention: [
    {
      priority: {
        priority: {
          title: "Contact insurance",
          rationale: "Jess is affected by unresolved insurance follow-up.",
          suggestedNextStep: "Contact insurance and update Jess.",
          evidenceIds: ["evidence:insurance"],
          confidence: 0.86,
        },
        comparisonSignals: [],
        executiveWeight: 40,
        originalIndex: 0,
      },
      state: "surfaced",
      selectionDecision: "surface",
      selectionSignals: [
        {
          kind: "requiresUserAttention",
          label: "User action appears required",
          weight: 30,
          evidenceIds: ["evidence:insurance"],
        },
      ],
      createdAt: generatedAt,
    },
  ],
};

const output: ExecutiveOutput = {
  suggestions: [
    {
      id: "suggestion:1:contact-insurance",
      title: "Contact insurance",
      whyItMatters:
        "Jess is affected, and the insurance responsibility remains unresolved.",
      suggestedNextStep: "Contact insurance and update Jess with the outcome.",
      evidence: [
        {
          id: "evidence:insurance",
          label: "Executive situation: Insurance responsibility affecting Jess",
          summary:
            "Jess appears affected by an unresolved insurance responsibility.",
          confidence: 0.86,
          source: "execution:test",
        },
      ],
      confidence: 0.86,
      status: "pending",
      createdAt: generatedAt,
    },
  ],
  clarifications: [],
  summary: {
    suggestionCount: 1,
    clarificationCount: 0,
    hasActionableSuggestions: true,
    hasPendingClarifications: false,
  },
  generatedAt,
};

const projection = new BasicExecutiveConcernProjector().project({
  attention,
  output,
});

const observation = projection.observations[0];

assert(projection.generatedAt === generatedAt, "generatedAt should be preserved");
assert(projection.observations.length === 1, "one concern observation should be produced");
assert(observation.concernId === "concern:contact-insurance", "stable concern id should be title-derived");
assert(observation.title === "Contact insurance", "title should be preserved");
assert(observation.importance === "high", "surfaced attention should become high importance");
assert(observation.confidence === 0.86, "confidence should come from executive priority");
assert(observation.evidence.length === 2, "attention and suggestion evidence should be included");
assert(Boolean(observation.latestRecommendation), "suggestion should become latest recommendation");
assert(
  observation.latestRecommendation?.suggestedNextStep ===
    "Contact insurance and update Jess with the outcome.",
  "suggested next step should be preserved"
);
assert(!observation.clarificationNeeded, "no clarification should be fabricated");

console.log("Executive concern projection proof passed.");
console.log(
  JSON.stringify(
    {
      observationCount: projection.observations.length,
      concernId: observation.concernId,
      importance: observation.importance,
      evidenceKinds: observation.evidence.map((item) => item.kind),
      latestRecommendationProjected: Boolean(observation.latestRecommendation),
      clarificationFabricated: Boolean(observation.clarificationNeeded),
    },
    null,
    2
  )
);

