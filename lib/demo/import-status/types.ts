import type { ImportSessionStatus } from "@/lib/kernel/import-session/types";

export type ImportExecutionStatusProjection = {
  identity: {
    sourceSystem: string;
    externalImportId: string;
  };

  lifecycle: ImportSessionStatus | "unknown";

  counts: {
    discovered: number;
    processed: number;
    succeeded: number;
    failed: number;
  };

  checkpoint: {
    cursor: unknown | null;
    completed: boolean;
  } | null;

  ownership: {
    ownerId: string;
    expiresAt: Date;
  } | null;

  cancellation: {
    requested: boolean;
    cancelledAt: Date | null;
    reason: string | null;
  };

  resumable: boolean;

  updatedAt: Date;
};
