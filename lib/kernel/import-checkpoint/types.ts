// lib/kernel/import-checkpoint/types.ts
import type { ImportCursor } from "@/lib/kernel/import-provider";

export type ImportCheckpointIdentity = {
  sourceSystem: string;
  externalImportId: string;
};

export type ImportCheckpoint = {
  id: string;
  identity: ImportCheckpointIdentity;
  cursor: ImportCursor | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ImportCheckpointSaveInput = {
  id: string;
  identity: ImportCheckpointIdentity;
  cursor: ImportCursor | null;
  completed: boolean;
  updatedAt?: Date;
};
