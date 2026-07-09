import type {
  ExecutiveConcernRepository,
} from "@/lib/executive/concern";

import type {
  ExecutiveConcernIdentityCandidateSource,
  ExecutiveConcernIdentityResolver,
} from "@/lib/executive/concern-identity";

import type {
  ExecutiveConcernReconciliationEngine,
  ExecutiveConcernObservation,
} from "@/lib/executive/concern-reconciliation";

import type {
  ExecutiveConcernCoordinator,
} from "./executive-concern-coordinator";

import type {
  ExecutiveConcernCoordinationInput,
  ExecutiveConcernCoordinationRecord,
  ExecutiveConcernCoordinationResult,
} from "./types";

const DEFAULT_MAX_IDENTITY_CANDIDATES = 8;

function observationWithConcernId(
  observation: ExecutiveConcernObservation,
  concernId: string
): ExecutiveConcernObservation {
  return {
    ...observation,
    concernId,
  };
}

export class BasicExecutiveConcernCoordinator
  implements ExecutiveConcernCoordinator
{
  constructor(
    private readonly repository: ExecutiveConcernRepository,
    private readonly reconciliationEngine: ExecutiveConcernReconciliationEngine,
    private readonly identityResolver?: ExecutiveConcernIdentityResolver,
    private readonly identityCandidateSource?: ExecutiveConcernIdentityCandidateSource,
    private readonly maxIdentityCandidates = DEFAULT_MAX_IDENTITY_CANDIDATES
  ) {}

  async coordinate(
    input: ExecutiveConcernCoordinationInput
  ): Promise<ExecutiveConcernCoordinationResult> {
    const records: ExecutiveConcernCoordinationRecord[] = [];

    for (const observation of input.projection.observations) {
      const identityResult =
        this.identityResolver && this.identityCandidateSource
          ? this.identityResolver.resolve({
              observation,
              candidates: await this.identityCandidateSource.findCandidates({
                observation,
                maxCandidates: this.maxIdentityCandidates,
              }),
            })
          : undefined;

      if (identityResult?.kind === "ambiguous") {
        records.push({
          kind: "identity_ambiguous",
          identityResult,
        });

        continue;
      }

      const reconciledObservation =
        identityResult?.kind === "resolved"
          ? observationWithConcernId(
              observation,
              identityResult.candidate.concernId
            )
          : observation;

      const existingConcern = await this.repository.findById(
        reconciledObservation.concernId
      );

      const decision = this.reconciliationEngine.reconcile({
        existingConcern,
        observation: reconciledObservation,
      });

      switch (decision.kind) {
        case "create": {
          const concern = await this.repository.create(decision.createInput);

          records.push({
            kind: "reconciled",
            decision,
            concern,
            identityResult,
          });

          break;
        }

        case "update": {
          const concern = await this.repository.update(decision.updateInput);

          records.push({
            kind: "reconciled",
            decision,
            concern,
            identityResult,
          });

          break;
        }

        case "no_change": {
          if (!existingConcern) {
            throw new Error(
              "Executive concern reconciliation returned no_change without an existing concern."
            );
          }

          records.push({
            kind: "reconciled",
            decision,
            concern: existingConcern,
            identityResult,
          });

          break;
        }
      }
    }

    const reconciledRecords = records.filter(
      (record): record is Extract<
        ExecutiveConcernCoordinationRecord,
        { kind: "reconciled" }
      > => record.kind === "reconciled"
    );

    return {
      records,
      createdCount: reconciledRecords.filter(
        (record) => record.decision.kind === "create"
      ).length,
      updatedCount: reconciledRecords.filter(
        (record) => record.decision.kind === "update"
      ).length,
      unchangedCount: reconciledRecords.filter(
        (record) => record.decision.kind === "no_change"
      ).length,
      ambiguousCount: records.filter(
        (record) => record.kind === "identity_ambiguous"
      ).length,
      generatedAt: input.projection.generatedAt,
    };
  }
}
