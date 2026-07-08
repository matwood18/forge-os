import type {
  ImportLease,
  ImportLeaseAcquireResult,
  ImportLeaseIdentity,
} from "./types";

export interface ImportLeaseEngine {
  acquire(input: {
    identity: ImportLeaseIdentity;
    ownerId: string;
    now?: Date;
    ttlMs: number;
  }): Promise<ImportLeaseAcquireResult>;

  release(input: {
    identity: ImportLeaseIdentity;
    ownerId: string;
    now?: Date;
  }): Promise<ImportLease | null>;
}
