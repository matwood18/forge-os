import type { ExecutiveReasonedPriority } from "../reasoning";
import type { ExecutiveConcernContinuityEngine } from "./executive-concern-continuity-engine";
import type {
  ExecutiveConcernContinuityInput,
  ExecutiveConcernContinuityRecord,
  ExecutiveConcernContinuityResult,
} from "./types";

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function stableIdentityEvidenceIds(
  priority: ExecutiveReasonedPriority
): string[] {
  return uniqueSorted(
    (priority.identityEvidenceIds ?? []).filter((id) =>
      id.startsWith("concern-identity:")
    )
  );
}

function mergePriorities(
  priorities: ExecutiveReasonedPriority[]
): ExecutiveReasonedPriority {
  const representative = priorities.reduce((best, candidate) => {
    if (candidate.confidence > best.confidence) {
      return candidate;
    }

    return best;
  });

  return {
    ...representative,
    evidenceIds: uniqueSorted(
      priorities.flatMap((priority) => priority.evidenceIds)
    ),
    identityEvidenceIds: uniqueSorted(
      priorities.flatMap(
        (priority) => priority.identityEvidenceIds ?? []
      )
    ),
    confidence: Math.max(
      ...priorities.map((priority) => priority.confidence)
    ),
  };
}

export class BasicExecutiveConcernContinuityEngine
  implements ExecutiveConcernContinuityEngine
{
  correlate(
    input: ExecutiveConcernContinuityInput
  ): ExecutiveConcernContinuityResult {
    const records: ExecutiveConcernContinuityRecord[] = [];
    const consumed = new Set<number>();

    input.reasoning.priorities.forEach((priority, index) => {
      if (consumed.has(index)) {
        return;
      }

      const identityIds = stableIdentityEvidenceIds(priority);

      if (identityIds.length === 0) {
        consumed.add(index);
        records.push({
          status: "unchanged",
          priority,
          contributingPriorities: [priority],
          sharedIdentityEvidenceIds: [],
          contributingEvidenceIds: [...priority.evidenceIds],
        });
        return;
      }

      if (identityIds.length > 1) {
        consumed.add(index);
        records.push({
          status: "ambiguous",
          priority,
          contributingPriorities: [priority],
          sharedIdentityEvidenceIds: identityIds,
          contributingEvidenceIds: [...priority.evidenceIds],
        });
        return;
      }

      const stableIdentityId = identityIds[0];

      const matchingEntries = input.reasoning.priorities
        .map((candidate, candidateIndex) => ({
          candidate,
          candidateIndex,
          identityIds: stableIdentityEvidenceIds(candidate),
        }))
        .filter(
          ({ candidateIndex, identityIds: candidateIdentityIds }) =>
            !consumed.has(candidateIndex) &&
            candidateIdentityIds.length === 1 &&
            candidateIdentityIds[0] === stableIdentityId
        );

      for (const entry of matchingEntries) {
        consumed.add(entry.candidateIndex);
      }

      const contributingPriorities = matchingEntries.map(
        (entry) => entry.candidate
      );

      const mergedPriority = mergePriorities(contributingPriorities);

      records.push({
        status:
          contributingPriorities.length > 1
            ? "converged"
            : "unchanged",
        priority: mergedPriority,
        contributingPriorities,
        sharedIdentityEvidenceIds: [stableIdentityId],
        contributingEvidenceIds: uniqueSorted(
          contributingPriorities.flatMap(
            (item) => item.evidenceIds
          )
        ),
      });
    });

    return {
      priorities: records.map((record) => record.priority),
      records,
      generatedAt: input.reasoning.generatedAt,
      provider: input.reasoning.provider,
    };
  }
}
