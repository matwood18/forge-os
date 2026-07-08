import type { ImportCancellationRepository } from "./import-cancellation-repository";
import type {
  ImportCancellation,
  ImportCancellationIdentity,
  ImportCancellationRequest,
} from "./types";

export class InMemoryImportCancellationRepository
  implements ImportCancellationRepository
{
  private readonly cancellations = new Map<
    string,
    ImportCancellation
  >();

  private key(identity: ImportCancellationIdentity): string {
    return [
      identity.sourceSystem,
      identity.externalImportId,
    ].join(":");
  }

  async request(
    input: ImportCancellationRequest
  ): Promise<ImportCancellation> {
    const now = input.requestedAt ?? new Date();

    const cancellation: ImportCancellation = {
      id: input.id,
      identity: input.identity,
      requestedAt: now,
      cancelledAt: null,
      reason: input.reason ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.cancellations.set(
      this.key(input.identity),
      cancellation
    );

    return cancellation;
  }

  async findByIdentity(
    identity: ImportCancellationIdentity
  ): Promise<ImportCancellation | null> {
    return this.cancellations.get(this.key(identity)) ?? null;
  }

  async cancel(
    identity: ImportCancellationIdentity,
    cancelledAt = new Date()
  ): Promise<ImportCancellation | null> {
    const existing = await this.findByIdentity(identity);

    if (!existing) {
      return null;
    }

    const updated: ImportCancellation = {
      ...existing,
      cancelledAt,
      updatedAt: cancelledAt,
    };

    this.cancellations.set(this.key(identity), updated);

    return updated;
  }
}
