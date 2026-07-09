import {
  BasicExecutiveConcernIdentityEvidenceProjector,
} from "@/lib/executive/concern-identity-evidence";

import type {
  ExecutiveSituationEvidence,
} from "@/lib/executive/situation";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function obligationEvidence(input: {
  id: string;
  object: string;
  confidence?: number;
}): ExecutiveSituationEvidence {
  return {
    id: input.id,
    label: "Semantic claim: has_possible_obligation",
    summary: `The current operator may have an obligation: ${input.object}.`,
    confidence: input.confidence ?? 0.72,
    source: "proof",
    identityMetadata: {
      kind: "semantic_claim",
      subject: "current_operator",
      predicate: "has_possible_obligation",
      object: input.object,
    },
  };
}

async function main(): Promise<void> {
  const projector = new BasicExecutiveConcernIdentityEvidenceProjector();

  const result = projector.project({
    evidence: [
      obligationEvidence({
        id: "claim:first",
        object: "contacting insurance",
        confidence: 0.7,
      }),
      obligationEvidence({
        id: "claim:second",
        object: "contacted the insurance company",
        confidence: 0.82,
      }),
      {
        id: "emotion:jess",
        label: "Semantic claim: expresses_possible_emotion",
        summary: "Jess may be expressing frustration.",
        confidence: 0.65,
        source: "proof",
        identityMetadata: {
          kind: "semantic_claim",
          subject: "jess",
          predicate: "expresses_possible_emotion",
          object: "frustration",
        },
      },
    ],
  });

  assert(
    result.identityEvidence.length === 1,
    "equivalent insurance obligation wording should converge to one identity evidence item"
  );

  const identityEvidence = result.identityEvidence[0];

  assert(
    identityEvidence.id ===
      "concern-identity:obligation:current-operator:insurance",
    "stable identity evidence id should preserve semantic obligation object"
  );

  assert(
    identityEvidence.sourceEvidenceIds.includes("claim:first") &&
      identityEvidence.sourceEvidenceIds.includes("claim:second"),
    "stable identity evidence should preserve source evidence provenance"
  );

  assert(
    identityEvidence.confidence === 0.82,
    "stable identity evidence should keep strongest supporting confidence"
  );

  console.log("Executive concern identity evidence proof passed.");
  console.log(
    JSON.stringify(
      {
        identityEvidenceCount: result.identityEvidence.length,
        identityEvidenceId: identityEvidence.id,
        sourceEvidenceIds: identityEvidence.sourceEvidenceIds,
        strongestConfidence: identityEvidence.confidence,
      },
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
