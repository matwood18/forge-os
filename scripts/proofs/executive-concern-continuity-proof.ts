import {
  BasicExecutiveConcernContinuityEngine,
} from "@/lib/executive/concern-continuity";
import type {
  ExecutiveReasoningResult,
} from "@/lib/executive/reasoning";

function assert(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const generatedAt = new Date("2026-07-09T20:00:00.000Z");

const stableIdentity =
  "concern-identity:obligation:current-operator:insurance";

const reasoning: ExecutiveReasoningResult = {
  provider: "basic",
  generatedAt,
  priorities: [
    {
      title: "Contact insurance",
      rationale:
        "Current evidence shows the insurance obligation remains unresolved.",
      suggestedNextStep: "Call insurance.",
      evidenceIds: ["evidence:current-insurance"],
      identityEvidenceIds: [stableIdentity],
      confidence: 0.82,
    },
    {
      title: "Review remembered insurance concern",
      rationale:
        "Durable concern state shows the same insurance issue remains unresolved.",
      suggestedNextStep: "Review the remembered concern.",
      evidenceIds: ["evidence:recalled-insurance"],
      identityEvidenceIds: [stableIdentity],
      confidence: 0.88,
    },
    {
      title: "Organize desk",
      rationale: "Desk organization may be useful.",
      suggestedNextStep: "Clear the desk.",
      evidenceIds: ["evidence:desk"],
      confidence: 0.65,
    },
    {
      title: "Ambiguous concern",
      rationale:
        "This priority carries more than one stable identity candidate.",
      suggestedNextStep: "Preserve ambiguity.",
      evidenceIds: ["evidence:ambiguous"],
      identityEvidenceIds: [
        "concern-identity:obligation:current-operator:insurance",
        "concern-identity:obligation:current-operator:dentist",
      ],
      confidence: 0.7,
    },
  ],
};

const result =
  new BasicExecutiveConcernContinuityEngine().correlate({
    reasoning,
  });

const converged = result.records.find(
  (record) => record.status === "converged"
);

const unchanged = result.records.find(
  (record) =>
    record.status === "unchanged" &&
    record.priority.title === "Organize desk"
);

const ambiguous = result.records.find(
  (record) => record.status === "ambiguous"
);

assert(
  result.priorities.length === 3,
  "Expected two stable-identity priorities to converge into one priority."
);

assert(
  Boolean(converged),
  "Expected matching stable identities to converge."
);

assert(
  converged?.contributingPriorities.length === 2,
  "Expected converged record to preserve both contributing priorities."
);

assert(
  converged?.sharedIdentityEvidenceIds[0] === stableIdentity,
  "Expected converged record to preserve the shared stable identity."
);

assert(
  converged?.priority.evidenceIds.includes(
    "evidence:current-insurance"
  ) &&
    converged.priority.evidenceIds.includes(
      "evidence:recalled-insurance"
    ),
  "Expected converged priority to preserve accumulated evidence."
);

assert(
  converged?.priority.title ===
    "Review remembered insurance concern",
  "Expected deterministic highest-confidence representative priority."
);

assert(
  Boolean(unchanged),
  "Expected priority without stable identity to remain unchanged."
);

assert(
  Boolean(ambiguous),
  "Expected multiple stable identities to remain explicitly ambiguous."
);

assert(
  ambiguous?.contributingPriorities.length === 1,
  "Expected ambiguous priority not to merge with other priorities."
);

assert(
  result.generatedAt === generatedAt,
  "Expected generatedAt to remain unchanged."
);

assert(
  result.provider === "basic",
  "Expected provider provenance to remain unchanged."
);

console.log("Executive concern continuity proof passed.");
console.log(
  JSON.stringify(
    {
      inputPriorityCount: reasoning.priorities.length,
      outputPriorityCount: result.priorities.length,
      convergedPriorityCount: result.records.filter(
        (record) => record.status === "converged"
      ).length,
      unchangedPriorityCount: result.records.filter(
        (record) => record.status === "unchanged"
      ).length,
      ambiguousPriorityCount: result.records.filter(
        (record) => record.status === "ambiguous"
      ).length,
      accumulatedEvidencePreserved:
        converged?.priority.evidenceIds.length === 2,
      stableIdentityPreserved:
        converged?.sharedIdentityEvidenceIds[0] === stableIdentity,
    },
    null,
    2
  )
);
