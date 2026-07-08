import type { ImportCancellationRepository } from "./import-cancellation-repository";
import type { ImportCancellationEngine } from "./import-cancellation-engine";

export class BasicImportCancellationEngine
  implements ImportCancellationEngine
{
  constructor(
    private readonly repository: ImportCancellationRepository
  ) {}

  async requestCancellation(input: {
    identity: {
      sourceSystem: string;
      externalImportId: string;
    };
    reason?: string;
    now?: Date;
  }): Promise<void> {
    await this.repository.request({
      id: [
        "import-cancellation",
        input.identity.sourceSystem,
        input.identity.externalImportId,
      ].join(":"),
      identity: input.identity,
      requestedAt: input.now,
      reason: input.reason,
    });
  }

  async isCancellationRequested(identity: {
    sourceSystem: string;
    externalImportId: string;
  }): Promise<boolean> {
    const cancellation =
      await this.repository.findByIdentity(identity);

    return cancellation !== null;
  }

  async markCancelled(
    identity: {
      sourceSystem: string;
      externalImportId: string;
    },
    now?: Date
  ): Promise<void> {
    await this.repository.cancel(identity, now);
  }
}
