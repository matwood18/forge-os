import type {
  ExecutiveSituationEvidence,
} from "@/lib/executive/situation";

import type {
  ExecutiveConcernIdentityEvidence,
} from "./types";

import type {
  ExecutiveConcernIdentityEvidenceProjector,
} from "./executive-concern-identity-evidence-projector";

import type {
  ExecutiveConcernIdentityEvidenceProjectionInput,
  ExecutiveConcernIdentityEvidenceProjectionResult,
} from "./types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "about",
  "company",
  "contact",
  "contacted",
  "contacting",
  "call",
  "called",
  "calling",
  "follow",
  "followup",
  "following",
  "for",
  "have",
  "has",
  "need",
  "needs",
  "regarding",
  "the",
  "to",
  "with",
]);

function stableToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length >= 3)
    .filter((token) => !STOP_WORDS.has(token))
    .sort()
    .join("-");
}

function semanticObligationIdentity(
  evidence: ExecutiveSituationEvidence
): ExecutiveConcernIdentityEvidence | undefined {
  const metadata = evidence.identityMetadata;

  if (
    metadata?.kind !== "semantic_claim" ||
    metadata.predicate !== "has_possible_obligation"
  ) {
    return undefined;
  }

  const objectToken = stableToken(metadata.object);

  if (!objectToken) {
    return undefined;
  }

  const subjectToken = stableToken(metadata.subject) || "unknown-subject";
  const confidence = Math.min(
    1,
    Math.max(0, Number((evidence.confidence ?? 0.5).toFixed(2)))
  );

  return {
    id: `concern-identity:obligation:${subjectToken}:${objectToken}`,
    kind: "semantic_obligation",
    label: "Stable concern identity: semantic obligation",
    summary: `Possible obligation identity for ${metadata.subject}: ${metadata.object}.`,
    sourceEvidenceIds: [evidence.id],
    confidence,
  };
}

export class BasicExecutiveConcernIdentityEvidenceProjector
  implements ExecutiveConcernIdentityEvidenceProjector
{
  project(
    input: ExecutiveConcernIdentityEvidenceProjectionInput
  ): ExecutiveConcernIdentityEvidenceProjectionResult {
    const byId = new Map<string, ExecutiveConcernIdentityEvidence>();

    for (const evidence of input.evidence) {
      const identityEvidence = semanticObligationIdentity(evidence);

      if (!identityEvidence) {
        continue;
      }

      const existing = byId.get(identityEvidence.id);

      if (!existing) {
        byId.set(identityEvidence.id, identityEvidence);
        continue;
      }

      byId.set(identityEvidence.id, {
        ...existing,
        confidence: Math.max(existing.confidence, identityEvidence.confidence),
        sourceEvidenceIds: [
          ...new Set([
            ...existing.sourceEvidenceIds,
            ...identityEvidence.sourceEvidenceIds,
          ]),
        ].sort(),
      });
    }

    return {
      identityEvidence: [...byId.values()].sort((a, b) =>
        a.id.localeCompare(b.id)
      ),
      generatedAt: new Date(),
    };
  }
}
