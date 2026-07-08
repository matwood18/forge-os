import type { ImportSessionRepository } from "@/lib/kernel/import-session/import-session-repository";
import type { ImportCheckpointRepository } from "@/lib/kernel/import-checkpoint/import-checkpoint-repository";
import type { ImportLeaseRepository } from "@/lib/kernel/import-lease/import-lease-repository";
import type { ImportCancellationRepository } from "@/lib/kernel/import-cancellation/import-cancellation-repository";
import type { ImportExecutionStatusProjection } from "./types";

export class ImportStatusBuilder {
  constructor(
    private readonly sessions: ImportSessionRepository,
    private readonly checkpoints: ImportCheckpointRepository,
    private readonly leases: ImportLeaseRepository,
    private readonly cancellations: ImportCancellationRepository
  ) {}

  async build(identity: {
    sourceSystem: string;
    externalImportId: string;
  }): Promise<ImportExecutionStatusProjection | null> {
    const session =
      await this.sessions.findByExternalIdentity({
        sourceSystem: identity.sourceSystem,
        externalId: identity.externalImportId,
      });

    if (!session) {
      return null;
    }

    const checkpoint =
      await this.checkpoints.findByIdentity(identity);

    const lease =
      await this.leases.findByIdentity(identity);

    const cancellation =
      await this.cancellations.findByIdentity(identity);

    return {
      identity,
      lifecycle: session.status,
      counts: session.counts,

      checkpoint: checkpoint
        ? {
            cursor: checkpoint.cursor,
            completed: checkpoint.completed,
          }
        : null,

      ownership: lease && !lease.releasedAt
        ? {
            ownerId: lease.ownerId,
            expiresAt: lease.expiresAt,
          }
        : null,

      cancellation: {
        requested: cancellation !== null,
        cancelledAt: cancellation?.cancelledAt ?? null,
        reason: cancellation?.reason ?? null,
      },

      resumable:
        session.status !== "completed" &&
        session.status !== "completed_with_failures",

      updatedAt: session.updatedAt,
    };
  }
}
