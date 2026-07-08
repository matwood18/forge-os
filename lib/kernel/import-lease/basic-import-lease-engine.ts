import type { ImportLeaseRepository } from "./import-lease-repository";
import type { ImportLeaseEngine } from "./import-lease-engine";
import type {
  ImportLease,
  ImportLeaseAcquireResult,
  ImportLeaseIdentity,
} from "./types";

function leaseId(identity: ImportLeaseIdentity): string {
  return [
    "import-lease",
    identity.sourceSystem.trim(),
    identity.externalImportId.trim(),
  ].join(":");
}

export class BasicImportLeaseEngine implements ImportLeaseEngine {
  constructor(private readonly repository: ImportLeaseRepository) {}

  async acquire(input: {
    identity: ImportLeaseIdentity;
    ownerId: string;
    now?: Date;
    ttlMs: number;
  }): Promise<ImportLeaseAcquireResult> {
    if (input.ttlMs <= 0) {
      throw new Error("Import lease ttlMs must be greater than zero.");
    }

    const now = input.now ?? new Date();
    const expiresAt = new Date(now.getTime() + input.ttlMs);

    const lease = await this.repository.acquire({
      id: leaseId(input.identity),
      identity: input.identity,
      ownerId: input.ownerId,
      acquiredAt: now,
      expiresAt,
    });

    if (lease) {
      return {
        acquired: true,
        lease,
      };
    }

    const activeLease = await this.repository.findByIdentity(input.identity);

    if (!activeLease) {
      throw new Error("Import lease acquisition failed without an active lease.");
    }

    return {
      acquired: false,
      activeLease,
    };
  }

  async release(input: {
    identity: ImportLeaseIdentity;
    ownerId: string;
    now?: Date;
  }): Promise<ImportLease | null> {
    return this.repository.release({
      identity: input.identity,
      ownerId: input.ownerId,
      releasedAt: input.now ?? new Date(),
    });
  }
}
