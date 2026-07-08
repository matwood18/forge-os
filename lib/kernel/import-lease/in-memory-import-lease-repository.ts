import type { ImportLeaseRepository } from "./import-lease-repository";
import type {
  ImportLease,
  ImportLeaseAcquireInput,
  ImportLeaseIdentity,
  ImportLeaseReleaseInput,
} from "./types";

export class InMemoryImportLeaseRepository
  implements ImportLeaseRepository
{
  private readonly leases = new Map<string, ImportLease>();

  private key(identity: ImportLeaseIdentity): string {
    return [
      identity.sourceSystem,
      identity.externalImportId,
    ].join(":");
  }

  async acquire(
    input: ImportLeaseAcquireInput
  ): Promise<ImportLease | null> {
    const existing = this.leases.get(
      this.key(input.identity)
    );

    const now = input.acquiredAt ?? new Date();

    if (
      existing &&
      !existing.releasedAt &&
      existing.expiresAt > now
    ) {
      return null;
    }

    const lease: ImportLease = {
      id: input.id,
      identity: input.identity,
      ownerId: input.ownerId,
      acquiredAt: now,
      expiresAt: input.expiresAt,
      releasedAt: null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.leases.set(this.key(input.identity), lease);

    return lease;
  }

  async release(
    input: ImportLeaseReleaseInput
  ): Promise<ImportLease | null> {
    const existing = this.leases.get(
      this.key(input.identity)
    );

    if (!existing || existing.ownerId !== input.ownerId) {
      return null;
    }

    const updated: ImportLease = {
      ...existing,
      releasedAt: input.releasedAt ?? new Date(),
      updatedAt: input.releasedAt ?? new Date(),
    };

    this.leases.set(this.key(input.identity), updated);

    return updated;
  }

  async findByIdentity(
    identity: ImportLeaseIdentity
  ): Promise<ImportLease | null> {
    return this.leases.get(this.key(identity)) ?? null;
  }
}
