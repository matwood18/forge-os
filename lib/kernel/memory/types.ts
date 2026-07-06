export type MemoryKind = "semantic" | "episodic";

export type MemoryStatus = "active" | "stale" | "contradicted" | "forgotten";

export type MemoryEvidenceKind =
  | "observation"
  | "relationship"
  | "semantic-event"
  | "domain-event";

export type MemoryEvidenceRecord = {
  id: string;

  memoryId: string;

  evidenceKind: MemoryEvidenceKind;

  evidenceId: string;

  supportsMemory: boolean;

  confidenceImpact: number;

  createdAt: Date;
};

export type MemoryConfidenceSnapshot = {
  id: string;

  memoryId: string;

  confidence: number;

  reason: string;

  createdAt: Date;
};

export type MemoryRecord = {
  id: string;

  kind: MemoryKind;

  subjectEntityId: string;

  predicate: string;

  objectEntityId?: string | null;

  objectValue?: string | null;

  confidence: number;

  status: MemoryStatus;

  firstLearnedAt: Date;

  lastConfirmedAt: Date;

  lastContradictedAt?: Date | null;

  forgottenAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
};

export type MemoryCreateInput = Omit<
  MemoryRecord,
  | "id"
  | "status"
  | "firstLearnedAt"
  | "lastConfirmedAt"
  | "lastContradictedAt"
  | "forgottenAt"
  | "createdAt"
  | "updatedAt"
>;

export type MemoryEvidenceCreateInput = Omit<
  MemoryEvidenceRecord,
  "id" | "createdAt"
>;

export type MemoryConfidenceSnapshotCreateInput = Omit<
  MemoryConfidenceSnapshot,
  "id" | "createdAt"
>;

export type MemoryAssertion = {
  belief: MemoryCreateInput;

  evidence: Omit<MemoryEvidenceCreateInput, "memoryId">;
};

export type MemoryQuery = {
  subjectEntityId?: string;

  predicate?: string;

  objectEntityId?: string | null;

  objectValue?: string | null;

  status?: MemoryStatus;

  kind?: MemoryKind;
};