import type { ExecutiveConcern } from "@/lib/executive/concern";

import type { ExecutiveConcernIdentityResolver } from "./executive-concern-identity-resolver";
import type {
  ExecutiveConcernIdentityCandidate,
  ExecutiveConcernIdentityInput,
  ExecutiveConcernIdentityResult,
} from "./types";

function assertConfidence(confidence: number): void {
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new Error("Executive concern identity confidence must be between 0 and 1.");
  }
}

function evidenceIdentitySet(concern: ExecutiveConcern): Set<string> {
  const identities = new Set<string>();

  for (const evidence of concern.supportingEvidence) {
    identities.add(evidence.id);

    if (evidence.sourceId) {
      identities.add(evidence.sourceId);
    }
  }

  return identities;
}

function candidateFor(
  input: ExecutiveConcernIdentityInput,
  concern: ExecutiveConcern
): ExecutiveConcernIdentityCandidate | undefined {
  const observationEvidenceIds = new Set(input.observation.identityEvidenceIds ?? []);

  if (observationEvidenceIds.size === 0) {
    return undefined;
  }

  const concernEvidenceIds = evidenceIdentitySet(concern);
  const sharedEvidenceIds = [...observationEvidenceIds]
    .filter((evidenceId) => concernEvidenceIds.has(evidenceId))
    .sort();

  if (sharedEvidenceIds.length === 0) {
    return undefined;
  }

  const supportRatio = sharedEvidenceIds.length / observationEvidenceIds.size;
  const confidence = Math.min(
    1,
    Math.max(
      0,
      Number(
        (
          supportRatio * 0.7 +
          Math.min(input.observation.confidence, concern.confidence) * 0.3
        ).toFixed(2)
      )
    )
  );

  assertConfidence(confidence);

  return {
    concernId: concern.id,
    title: concern.title,
    confidence,
    reason:
      "The observation shares explicit identity evidence with this durable concern.",
    supportingEvidenceIds: sharedEvidenceIds,
  };
}

export class BasicExecutiveConcernIdentityResolver
  implements ExecutiveConcernIdentityResolver
{
  resolve(input: ExecutiveConcernIdentityInput): ExecutiveConcernIdentityResult {
    const candidates = input.candidates
      .map((concern) => candidateFor(input, concern))
      .filter(
        (candidate): candidate is ExecutiveConcernIdentityCandidate =>
          candidate !== undefined
      )
      .sort((a, b) => {
        if (b.confidence !== a.confidence) {
          return b.confidence - a.confidence;
        }

        if (b.supportingEvidenceIds.length !== a.supportingEvidenceIds.length) {
          return b.supportingEvidenceIds.length - a.supportingEvidenceIds.length;
        }

        return a.concernId.localeCompare(b.concernId);
      });

    if (candidates.length === 0) {
      return {
        kind: "unresolved",
        observation: input.observation,
        reason:
          "No existing durable concern shares explicit identity evidence with this observation.",
      };
    }

    const strongestConfidence = candidates[0].confidence;
    const strongestSupportCount = candidates[0].supportingEvidenceIds.length;

    const strongestCandidates = candidates.filter(
      (candidate) =>
        candidate.confidence === strongestConfidence &&
        candidate.supportingEvidenceIds.length === strongestSupportCount
    );

    if (strongestCandidates.length > 1) {
      return {
        kind: "ambiguous",
        observation: input.observation,
        candidates: strongestCandidates,
        reason:
          "Multiple durable concerns share equally strong identity evidence with this observation.",
      };
    }

    return {
      kind: "resolved",
      observation: input.observation,
      candidate: candidates[0],
      reason:
        "Exactly one durable concern shares the strongest explicit identity evidence with this observation.",
    };
  }
}
