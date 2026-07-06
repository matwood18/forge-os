import type { MemoryRecord } from "@/lib/kernel/memory";

export type BeliefStatus = "active" | "stale" | "contradicted" | "superseded";

export type BeliefStrength = "weak" | "moderate" | "strong";

export type BeliefEvidence = {
  memoryId: string;
  memory: MemoryRecord;
  confidence: number;
  reinforcedAt: Date;
};

export type Belief = {
  id: string;

  subjectEntityId: string;
  predicate: string;

  objectEntityId?: string | null;
  objectValue?: string | null;

  status: BeliefStatus;
  strength: BeliefStrength;

  confidence: number;

  evidence: BeliefEvidence[];

  generatedAt: Date;
};

export type BeliefFormationInput = {
  memories: MemoryRecord[];
};

export type BeliefFormationResult = {
  beliefs: Belief[];
};