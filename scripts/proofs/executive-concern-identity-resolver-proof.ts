import {
  BasicExecutiveConcernIdentityResolver,
} from "@/lib/executive/concern-identity";

import type {
  ExecutiveConcern,
} from "@/lib/executive/concern";

import type {
  ExecutiveConcernObservation,
} from "@/lib/executive/concern-reconciliation";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function concern(input: {
  id: string;
  title: string;
  confidence?: number;
  evidence: Array<{
    id: string;
    sourceId?: string;
  }>;
}): ExecutiveConcern {
  const observedAt = new Date("2026-07-09T08:00:00.000Z");

  return {
    id: input.id,
    title: input.title,
    status: "open",
    importance: "high",
    confidence: input.confidence ?? 0.82,
    firstObserved: observedAt,
    lastObserved: observedAt,
    supportingEvidence: input.evidence.map((evidence) => ({
      id: evidence.id,
      kind: "executiveAttention",
      summary: input.title,
      observedAt,
      sourceId: evidence.sourceId,
    })),
  };
}

function observation(input: {
  concernId: string;
  title: string;
  confidence?: number;
  identityEvidenceIds?: string[];
}): ExecutiveConcernObservation {
  const observedAt = new Date("2026-07-09T10:00:00.000Z");

  return {
    concernId: input.concernId,
    title: input.title,
    importance: "high",
    confidence: input.confidence ?? 0.88,
    observedAt,
    identityEvidenceIds: input.identityEvidenceIds,
    evidence: [
      {
        id: `concern-evidence:${input.concernId}`,
        kind: "executiveAttention",
        summary: input.title,
        observedAt,
        sourceId: input.title,
      },
    ],
  };
}

async function main(): Promise<void> {
  const resolver = new BasicExecutiveConcernIdentityResolver();

  const resolved = resolver.resolve({
    observation: observation({
      concernId: "concern:presentation:insurance-company-still-needs-follow-up",
      title: "Insurance company still needs follow-up",
      identityEvidenceIds: ["evidence:insurance"],
    }),
    candidates: [
      concern({
        id: "concern:stable:insurance-follow-up",
        title: "Call insurance",
        evidence: [
          {
            id: "concern-evidence:attention:contact-insurance",
            sourceId: "evidence:insurance",
          },
        ],
      }),
      concern({
        id: "concern:stable:dentist",
        title: "Call dentist",
        evidence: [
          {
            id: "concern-evidence:attention:call-dentist",
            sourceId: "evidence:dentist",
          },
        ],
      }),
    ],
  });

  assert(resolved.kind === "resolved", "shared explicit evidence should resolve identity");

  if (resolved.kind !== "resolved") {
    throw new Error("Expected resolved result");
  }

  assert(
    resolved.candidate.concernId === "concern:stable:insurance-follow-up",
    "resolver should return the durable stable concern identity"
  );
  assert(
    resolved.candidate.supportingEvidenceIds.includes("evidence:insurance"),
    "resolver should preserve shared identity evidence provenance"
  );
  assert(
    resolved.observation.concernId ===
      "concern:presentation:insurance-company-still-needs-follow-up",
    "resolver should not mutate the presentation-derived observation identity"
  );

  const unresolved = resolver.resolve({
    observation: observation({
      concernId: "concern:presentation:maxx-project",
      title: "Maxx needs project supplies",
      identityEvidenceIds: ["evidence:maxx-project"],
    }),
    candidates: [
      concern({
        id: "concern:stable:insurance-follow-up",
        title: "Call insurance",
        evidence: [
          {
            id: "concern-evidence:attention:contact-insurance",
            sourceId: "evidence:insurance",
          },
        ],
      }),
    ],
  });

  assert(
    unresolved.kind === "unresolved",
    "unmatched explicit evidence should remain unresolved"
  );

  const noEvidence = resolver.resolve({
    observation: observation({
      concernId: "concern:presentation:missing-identity-evidence",
      title: "Insurance company still needs follow-up",
    }),
    candidates: [
      concern({
        id: "concern:stable:insurance-follow-up",
        title: "Call insurance",
        evidence: [
          {
            id: "concern-evidence:attention:contact-insurance",
            sourceId: "evidence:insurance",
          },
        ],
      }),
    ],
  });

  assert(
    noEvidence.kind === "unresolved",
    "missing identity evidence should not fall back to title matching"
  );

  const ambiguous = resolver.resolve({
    observation: observation({
      concernId: "concern:presentation:shared-evidence",
      title: "Follow up on shared responsibility",
      identityEvidenceIds: ["evidence:shared"],
    }),
    candidates: [
      concern({
        id: "concern:stable:first",
        title: "First possible concern",
        evidence: [
          {
            id: "concern-evidence:first",
            sourceId: "evidence:shared",
          },
        ],
      }),
      concern({
        id: "concern:stable:second",
        title: "Second possible concern",
        evidence: [
          {
            id: "concern-evidence:second",
            sourceId: "evidence:shared",
          },
        ],
      }),
    ],
  });

  assert(
    ambiguous.kind === "ambiguous",
    "equally supported candidates should remain ambiguous"
  );

  if (ambiguous.kind !== "ambiguous") {
    throw new Error("Expected ambiguous result");
  }

  assert(
    ambiguous.candidates.length === 2,
    "ambiguous result should preserve equally supported candidates"
  );

  console.log("Executive concern identity resolver proof passed.");
  console.log(
    JSON.stringify(
      {
        resolvedIdentity:
          resolved.kind === "resolved"
            ? resolved.candidate.concernId
            : undefined,
        unresolvedPreserved: unresolved.kind === "unresolved",
        noTitleFallback: noEvidence.kind === "unresolved",
        ambiguousCandidateCount: ambiguous.candidates.length,
        sharedEvidencePreserved:
          resolved.kind === "resolved" &&
          resolved.candidate.supportingEvidenceIds.includes("evidence:insurance"),
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
