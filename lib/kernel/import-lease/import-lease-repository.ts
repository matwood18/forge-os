import type {
  ImportLease,
  ImportLeaseAcquireInput,
  ImportLeaseIdentity,
  ImportLeaseReleaseInput,
} from "./types";

export interface ImportLeaseRepository {
  acquire(input: ImportLeaseAcquireInput): Promise<ImportLease | null>;
  release(input: ImportLeaseReleaseInput): Promise<ImportLease | null>;
  findByIdentity(identity: ImportLeaseIdentity): Promise<ImportLease | null>;
}
