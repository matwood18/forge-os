import type {
  ExecutiveConcern,
} from "@/lib/executive/concern";

import type {
  ExecutiveConcernObservation,
} from "@/lib/executive/concern-reconciliation";

import type {
  ExecutiveConcernIdentityCandidate,
  ExecutiveConcernIdentityInput,
  ExecutiveConcernIdentityResolver,
  ExecutiveConcernIdentityResult,
} from "@/lib/executive/concern-identity";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertConfidence(confidence: number): void {
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new Error("Identity confidence must be between 0 and 1.");
  }
}

function normalize(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4)
  );
}

function overlapScore(a: string, b: string): number {
  const left = normalize(a);
  const right = normalize(b);

  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  const overlap = [...left].filter((word) => right.has(word)).length;

  return overlap / Math.min(left.size, right.size);
}

function candidateFor(
  observation: ExecutiveConcernObservation,
  concern: ExecutiveConcern
): ExecutiveConcernIdentityCandidate {
  const evidenceIds = new Set([
    ...observation.evidence.map((evidence) => evidence.id),
    ...concern.supportingEvidence.map((evidence) => evidence.id),
  ]);

  const confidence = Math.min(
    1,
    Math.max(
      0,
      Number(
        (
          overlapScore(observation.title, concern.title) * 0.7 +
          Math.min(observation.confidence, concern.confidence) * 0.3
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
      "The observation and existing concern share grounded wording and evidence context.",
    supportingEvidenceIds: [...evidenceIds].sort(),
  };
}

class ProofExecutiveConcernIdentityResolver
  implements ExecutiveConcernIdentityResolver
{
  resolve(input: ExecutiveConcernIdentityInput): ExecutiveConcernIdentityResult {
    const candidates = input.candidates
      .map((concern) => candidateFor(input.observation, concern))
      .filter((candidate) => candidate.confidence >= 0.55)
      .sort((a, b) => b.confidence - a.confidence);

    if (candidates.length === 0) {
      return {
        kind: "unresolved",
        observation: input.observation,
        reason: "No existing concern is supported strongly enough by the observation evidence.",
      };
    }

    if (
      candidates.length > 1 &&
      candidates[0].confidence - candidates[1].confidence < 0.15
    ) {
      return {
        kind: "ambiguous",
        observation: input.observation,
        candidates,
        reason:
          "Multiple existing concerns are plausible and the resolver must not guess.",
      };
    }

    return {
      kind: "resolved",
      observation: input.observation,
      candidate: candidates[0],
      reason: "Exactly one existing concern is supported strongly enough.",
    };
  }
}

function concern(input: {
  id: string;
  title: string;
  confidence?: number;
  evidenceId: string;
}): ExecutiveConcern {
  const observedAt = new Date("2026-07-09T08:00:00.000Z");

  return {
    id: input.id,
    title: input.title,
    status: "open",
    importance: "high",
    confidence: input.confidence ?? 0.8,
    firstObserved: observedAt,
    lastObserved: observedAt,
    supportingEvidence: [
      {
        id: input.evidenceId,
        kind: "executiveAttention",
        summary: input.title,
        observedAt,
      },
    ],
  };
}

function observation(input: {
  concernId: string;
  title: string;
  evidenceId: string;
}): ExecutiveConcernObservation {
  const observedAt = new Date("2026-07-09T10:00:00.000Z");

  return {
    concernId: input.concernId,
    title: input.title,
    importance: "high",
    confidence: 0.82,
    observedAt,
    evidence: [
      {
        id: input.evidenceId,
        kind: "operatorUpdate",
        summary: input.title,
        observedAt,
      },
    ],
  };
}

async function main(): Promise<void> {
  const resolver = new ProofExecutiveConcernIdentityResolver();

  const originalObservation = observation({
    concernId: "presentation-derived-id:is-not-authoritative",
    title: "Insurance company still needs follow-up",
    evidenceId: "evidence:insurance-follow-up:2",
  });

  const resolved = resolver.resolve({
    observation: originalObservation,
    candidates: [
      concern({
        id: "concern:stable:insurance-follow-up",
        title: "Call insurance",
        evidenceId: "evidence:insurance-follow-up:1",
      }),
      concern({
        id: "concern:stable:dentist-appointment",
        title: "Call dentist",
        evidenceId: "evidence:dentist:1",
      }),
    ],
  });

  assert(resolved.kind === "resolved", "matching evidence should resolve one stable concern identity");

  if (resolved.kind !== "resolved") {
    throw new Error("Expected resolved identity");
  }

  assert(
    resolved.candidate.concernId === "concern:stable:insurance-follow-up",
    "resolved identity should use stable concern candidate id"
  );
  assert(
    resolved.observation === originalObservation,
    "identity resolution should preserve the original observation unchanged"
  );
  assert(
    resolved.candidate.supportingEvidenceIds.includes("evidence:insurance-follow-up:1") &&
      resolved.candidate.supportingEvidenceIds.includes("evidence:insurance-follow-up:2"),
    "resolved identity should preserve supporting provenance"
  );

  const unresolved = resolver.resolve({
    observation: observation({
      concernId: "presentation-derived-id:school-project",
      title: "Maxx needs project supplies",
      evidenceId: "evidence:maxx-project:1",
    }),
    candidates: [
      concern({
        id: "concern:stable:insurance-follow-up",
        title: "Call insurance",
        evidenceId: "evidence:insurance-follow-up:1",
      }),
    ],
  });

  assert(unresolved.kind === "unresolved", "unsupported evidence should remain unresolved");

  const ambiguous = resolver.resolve({
    observation: observation({
      concernId: "presentation-derived-id:call-follow-up",
      title: "Call follow-up",
      evidenceId: "evidence:call-follow-up:1",
    }),
    candidates: [
      concern({
        id: "concern:stable:call-insurance",
        title: "Call insurance",
        evidenceId: "evidence:call-insurance:1",
      }),
      concern({
        id: "concern:stable:call-dentist",
        title: "Call dentist",
        evidenceId: "evidence:call-dentist:1",
      }),
    ],
  });

  assert(ambiguous.kind === "ambiguous", "multiple plausible identities should remain ambiguous");

  if (ambiguous.kind !== "ambiguous") {
    throw new Error("Expected ambiguous identity");
  }

  assert(
    ambiguous.candidates.length === 2,
    "ambiguous result should preserve all plausible candidates"
  );

  console.log("Executive concern identity contract proof passed.");
  console.log(
    JSON.stringify(
      {
        resolvedIdentity: resolved.candidate.concernId,
        unresolvedPreserved: unresolved.kind === "unresolved",
        ambiguousCandidateCount: ambiguous.candidates.length,
        observationPreserved:
          resolved.observation.concernId ===
          "presentation-derived-id:is-not-authoritative",
        confidenceBounded:
          resolved.candidate.confidence >= 0 &&
          resolved.candidate.confidence <= 1,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
