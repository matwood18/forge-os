import type {
  ExecutiveConcernRepository,
} from "@/lib/executive/concern";

import type {
  ExecutiveConcernReconciliationEngine,
} from "@/lib/executive/concern-reconciliation";

import type {
  ExecutiveConcernCoordinator,
} from "./executive-concern-coordinator";

import type {
  ExecutiveConcernCoordinationInput,
  ExecutiveConcernCoordinationRecord,
  ExecutiveConcernCoordinationResult,
} from "./types";

export class BasicExecutiveConcernCoordinator
  implements ExecutiveConcernCoordinator
{
  constructor(
    private readonly repository: ExecutiveConcernRepository,
    private readonly reconciliationEngine: ExecutiveConcernReconciliationEngine
  ) {}

  async coordinate(
    input: ExecutiveConcernCoordinationInput
  ): Promise<ExecutiveConcernCoordinationResult> {
    const records: ExecutiveConcernCoordinationRecord[] = [];

    for (const observation of input.projection.observations) {
      const existingConcern = await this.repository.findById(
        observation.concernId
      );

      const decision = this.reconciliationEngine.reconcile({
        existingConcern,
        observation,
      });

      switch (decision.kind) {
        case "create": {
          const concern = await this.repository.create(decision.createInput);

          records.push({
            decision,
            concern,
          });

          break;
        }

        case "update": {
          const concern = await this.repository.update(decision.updateInput);

          records.push({
            decision,
            concern,
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
            decision,
            concern: existingConcern,
          });

          break;
        }
      }
    }

    return {
      records,
      createdCount: records.filter(
        (record) => record.decision.kind === "create"
      ).length,
      updatedCount: records.filter(
        (record) => record.decision.kind === "update"
      ).length,
      unchangedCount: records.filter(
        (record) => record.decision.kind === "no_change"
      ).length,
      generatedAt: input.projection.generatedAt,
    };
  }
}
