import type {
  ExecutiveConcern,
  ExecutiveConcernRepository,
  ExecutiveConcernStatus,
} from "@/lib/executive/concern";

import type {
  ExecutiveConcernIdentityCandidateSource,
  ExecutiveConcernIdentityCandidateSourceInput,
} from "./executive-concern-identity-candidate-source";

const DEFAULT_ELIGIBLE_STATUSES: ExecutiveConcernStatus[] = [
  "open",
  "watching",
  "blocked",
];

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

function sharedIdentityCount(
  observationIdentityEvidenceIds: Set<string>,
  concern: ExecutiveConcern
): number {
  const concernEvidenceIds = evidenceIdentitySet(concern);

  return [...observationIdentityEvidenceIds].filter((evidenceId) =>
    concernEvidenceIds.has(evidenceId)
  ).length;
}

export class BasicExecutiveConcernIdentityCandidateSource
  implements ExecutiveConcernIdentityCandidateSource
{
  constructor(
    private readonly repository: ExecutiveConcernRepository,
    private readonly eligibleStatuses: ExecutiveConcernStatus[] =
      DEFAULT_ELIGIBLE_STATUSES
  ) {}

  async findCandidates(
    input: ExecutiveConcernIdentityCandidateSourceInput
  ): Promise<ExecutiveConcern[]> {
    if (!Number.isInteger(input.maxCandidates) || input.maxCandidates < 1) {
      throw new Error("Executive concern identity candidate limit must be positive.");
    }

    const observationIdentityEvidenceIds = new Set(
      input.observation.identityEvidenceIds ?? []
    );

    if (observationIdentityEvidenceIds.size === 0) {
      return [];
    }

    const candidates = (
      await Promise.all(
        this.eligibleStatuses.map((status) =>
          this.repository.listByStatus(status)
        )
      )
    ).flat();

    const byId = new Map<string, ExecutiveConcern>();

    for (const candidate of candidates) {
      byId.set(candidate.id, candidate);
    }

    return [...byId.values()]
      .map((candidate) => ({
        candidate,
        sharedIdentityCount: sharedIdentityCount(
          observationIdentityEvidenceIds,
          candidate
        ),
      }))
      .filter((entry) => entry.sharedIdentityCount > 0)
      .sort((a, b) => {
        if (b.sharedIdentityCount !== a.sharedIdentityCount) {
          return b.sharedIdentityCount - a.sharedIdentityCount;
        }

        if (
          b.candidate.lastObserved.getTime() !==
          a.candidate.lastObserved.getTime()
        ) {
          return (
            b.candidate.lastObserved.getTime() -
            a.candidate.lastObserved.getTime()
          );
        }

        return a.candidate.id.localeCompare(b.candidate.id);
      })
      .slice(0, input.maxCandidates)
      .map((entry) => entry.candidate);
  }
}
