// lib/kernel/import-session/types.ts

export type ImportSessionStatus =
  | "pending"
  | "running"
  | "completed"
  | "completed_with_failures"
  | "failed";

export type ImportSessionCounts = {
  discovered: number;
  processed: number;
  succeeded: number;
  failed: number;
};

export type ImportSessionExternalIdentity = {
  sourceSystem: string;
  externalId: string;
};

export type ImportSession = {
  id: string;
  externalIdentity: ImportSessionExternalIdentity;
  status: ImportSessionStatus;
  counts: ImportSessionCounts;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ImportSessionCreateInput = {
  id: string;
  externalIdentity: ImportSessionExternalIdentity;
  discovered: number;
  createdAt?: Date;
};

export type ImportSessionProgressInput = {
  sessionId: string;
  processed: number;
  succeeded: number;
  failed: number;
};

export type ImportSessionCompletionInput = {
  sessionId: string;
  completedAt?: Date;
};
